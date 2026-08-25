#!/usr/bin/env bash
#
# The Mac Mini worker.
#
# Pulls agent-ready issues off GitHub, works one per branch, opens a PR, and
# comments on the issue. Never touches main. Run it inside tmux so it survives
# a dropped SSH connection:
#
#   tmux new -s worker
#   ~/dev/t-portfolio-website/scripts/mini-worker.sh
#   Ctrl-b d          to detach
#   tmux attach -t worker
#
# Specific issues:     ./mini-worker.sh 1 3
# See what it would do: DRY_RUN=1 ./mini-worker.sh
#
set -euo pipefail

# A non-interactive ssh session does not read ~/.zprofile, so Homebrew is not
# on PATH and every tool looks missing. This one line is why.
export PATH=/opt/homebrew/bin:/opt/homebrew/sbin:$PATH

REPO_DIR="${REPO_DIR:-$HOME/dev/t-portfolio-website}"
DRY_RUN="${DRY_RUN:-0}"
ONLY_ISSUES="$*"

cd "$REPO_DIR"

log() { printf '\n[worker %s] %s\n' "$(date +%H:%M:%S)" "$*"; }

# Refuse to run anywhere near a dirty tree. Working on top of somebody else's
# uncommitted changes is how an agent produces a PR nobody can review.
if [[ -n "$(git status --porcelain)" ]]; then
  log "ABORT: working tree is dirty. Commit or stash first."
  git status --short
  exit 1
fi

if [[ -n "$ONLY_ISSUES" ]]; then
  numbers="$ONLY_ISSUES"
else
  numbers=$(gh issue list --label agent-ready --state open --json number --jq '.[].number')
fi

if [[ -z "${numbers// }" ]]; then
  log "nothing labelled agent-ready is open. Done."
  exit 0
fi

log "queue: $(echo "$numbers" | tr '\n' ' ')"

for n in $numbers; do
  branch="issue-$n"

  if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
    log "#$n: branch $branch already on origin, skipping"
    continue
  fi

  title=$(gh issue view "$n" --json title --jq .title)
  log "#$n: $title"

  if [[ "$DRY_RUN" == "1" ]]; then
    log "#$n: DRY_RUN, not working it"
    continue
  fi

  git checkout main --quiet
  git pull --quiet origin main
  git checkout -b "$branch" --quiet

  # The issue body is the spec. Everything the agent needs to know about how to
  # work in this repo is in CLAUDE.md, which the prompt points at rather than
  # duplicating: one copy of the rules, and it is the one under version
  # control.
  prompt=$(cat <<PROMPT
You are working on GitHub issue #$n in this repository, on branch $branch.

Read CLAUDE.md first, then HANDOFF.md. Follow every rule in them. The ones that
bite most often: no dashes in prose, never invent facts about Tobias or his
projects (leave a visible blank instead), and route every font-size through the
type tokens.

On CLAUDE.md rules 5 and 6, show do not describe and verify in a browser: this
machine has no browser tool. You cannot screenshot and you cannot load the
site. Do NOT claim visual verification you did not do. Instead, end your commit
message with a line beginning "UNVERIFIED:" listing exactly what a human still
has to look at. Someone with a browser checks it on the PR. Claiming a clean
visual check you could not run is worse than saying you could not run it.

Here is the issue.

--- ISSUE #$n: $title ---
$(gh issue view "$n" --json body --jq .body)
--- END ISSUE ---

Do the work. Then:
1. Run: npx tsc -b --noEmit && npm run build
2. Commit to $branch with a message explaining WHY, not just what.
3. Do NOT push and do NOT open a PR. The worker script does that.

If the issue turns out to need a decision only Tobias can make, do not guess.
Make no changes, and write a file called BLOCKED.md at the repo root saying
exactly what you need from him.
PROMPT
)

  # acceptEdits accepts file edits and STILL GATES Bash. The first real run, on
  # issue #2, hit exactly that: the agent edited three files correctly and then
  # could not run tsc, could not run the build, and could not commit, so the
  # definition of done three lines above it was unreachable. The fix is the
  # allowlist in .claude/settings.json, which permits build, test and the git
  # verbs needed to make a commit, and denies push and merge.
  #
  # The branch and the PR gate are what make this safe, not the permission
  # mode. The agent cannot push, cannot merge, and cannot reach main.
  claude -p "$prompt" --permission-mode acceptEdits 2>&1 | tail -40 || {
    log "#$n: claude exited non-zero"
  }

  if [[ -f BLOCKED.md ]]; then
    log "#$n: agent reports blocked"
    gh issue comment "$n" --body "$(printf 'The Mac Mini worker could not complete this unattended.\n\n%s' "$(cat BLOCKED.md)")"
    gh issue edit "$n" --add-label blocked-on-t --remove-label agent-ready
    rm -f BLOCKED.md
    git checkout main --quiet
    git branch -D "$branch" --quiet
    continue
  fi

  if [[ -z "$(git log origin/main..HEAD --oneline)" ]]; then
    log "#$n: no commits, nothing to open a PR with"
    # Uncommitted edits have to be discarded before leaving the branch, or they
    # follow the checkout onto main and strand there. That happened on the
    # first run of #2: the agent could not commit, the branch was deleted, and
    # three modified files were left sitting on main. The dirty tree guard at
    # the top caught it on the next run, which is the guard working, but the
    # right behaviour is not to create the mess in the first place.
    git checkout -- . 2>/dev/null || true
    git clean -fd --quiet 2>/dev/null || true
    git checkout main --quiet
    git branch -D "$branch" --quiet
    gh issue comment "$n" --body "The Mac Mini worker made changes but produced no commit, so there is nothing to review. Working tree was reset. Check the worker log."
    continue
  fi

  git push --quiet -u origin "$branch"
  url=$(gh pr create \
    --base main \
    --head "$branch" \
    --title "$title" \
    --body "$(printf 'Closes #%s\n\nWorked unattended on the Mac Mini. Review before merging: the agent has not seen this in a browser the way Tobias will.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)' "$n")")
  gh issue comment "$n" --body "Worked on the Mac Mini. PR: $url"
  log "#$n: PR $url"

  git checkout main --quiet
done

log "queue drained"
