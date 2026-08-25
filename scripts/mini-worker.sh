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

Do the work by editing files. That is all you have to do.

Do NOT run a build, a typecheck, or any git command. This shell will refuse
them and it is not your job: the worker script runs the typecheck and the build
after you exit, and it does the commit, the push and the PR. If either check
fails your work is discarded, so make it compile.

Write your commit message to a file called COMMIT_MSG.md at the repo root. The
worker commits with it and then deletes it, so it never lands in the tree.
Explain WHY, not just what. End it with the UNVERIFIED: line described above.

If the issue turns out to need a decision only Tobias can make, do not guess.
Make no changes, and write a file called BLOCKED.md at the repo root saying
exactly what you need from him.
PROMPT
)

  # The agent EDITS. The script BUILDS, COMMITS, PUSHES and OPENS THE PR.
  #
  # This split is the lesson from the first two runs. Twice the agent did
  # correct work and shipped nothing, because it was asked to run `tsc`, `npm
  # run build` and `git commit` from inside a session whose shell refused all
  # three. An allowlist in .claude/settings.json did not help: in headless mode
  # the project settings are not loaded for an untrusted directory.
  #
  # Rather than keep negotiating with the sandbox, take the work away from it.
  # The agent only has to write files, which it can always do. Everything that
  # needs a shell happens out here, where there is one.
  claude -p "$prompt" --permission-mode acceptEdits 2>&1 | tail -30 || {
    log "#$n: claude exited non-zero"
  }

  if [[ -f BLOCKED.md ]]; then
    log "#$n: agent reports blocked"
    gh issue comment "$n" --body "$(printf 'The Mac Mini worker could not complete this unattended.\n\n%s' "$(cat BLOCKED.md)")" || log "#$n: could not comment (token permissions?)"
    gh issue edit "$n" --add-label blocked-on-t --remove-label agent-ready || true
    rm -f BLOCKED.md
    git checkout -- . 2>/dev/null || true
    git clean -fdq 2>/dev/null || true
    git checkout main --quiet
    git branch -D "$branch" --quiet
    continue
  fi

  if [[ -z "$(git status --porcelain)" ]]; then
    log "#$n: the agent changed nothing"
    git checkout main --quiet
    git branch -D "$branch" --quiet
    continue
  fi

  # Verify what the agent could not. A branch that does not compile must never
  # become a PR: the whole point of the gate is that Tobias reviews working
  # code, not a diff he has to build himself to evaluate.
  log "#$n: verifying"
  if ! npx tsc -b --noEmit 2>&1 | tail -5; then
    log "#$n: TYPECHECK FAILED, not opening a PR"
    gh issue comment "$n" --body "The Mac Mini worker made changes that do not typecheck. Left unmerged and reset. See the worker log." || true
    git checkout -- . 2>/dev/null || true
    git clean -fdq 2>/dev/null || true
    git checkout main --quiet
    git branch -D "$branch" --quiet
    continue
  fi
  if ! npm run build 2>&1 | tail -5; then
    log "#$n: BUILD FAILED, not opening a PR"
    gh issue comment "$n" --body "The Mac Mini worker made changes that do not build. Left unmerged and reset. See the worker log." || true
    git checkout -- . 2>/dev/null || true
    git clean -fdq 2>/dev/null || true
    git checkout main --quiet
    git branch -D "$branch" --quiet
    continue
  fi
  log "#$n: typecheck and build pass"

  # The agent writes its commit message to a file, since it cannot run git. If
  # it did not, fall back to something honest rather than inventing a summary
  # of work this script did not do.
  if [[ -f COMMIT_MSG.md ]]; then
    msg_file=COMMIT_MSG.md
  else
    msg_file=$(mktemp)
    printf 'Work issue #%s: %s\n\nThe agent did not leave a commit message.\n' "$n" "$title" > "$msg_file"
  fi

  git add -A
  git reset --quiet COMMIT_MSG.md 2>/dev/null || true
  rm -f COMMIT_MSG.md
  git commit --quiet -F "$msg_file"

  if ! git push --quiet -u origin "$branch" 2>&1; then
    log "#$n: PUSH FAILED. The commit is on local branch $branch on the Mini."
    log "#$n: this is usually the GitHub token lacking write access."
    git checkout main --quiet
    continue
  fi

  url=$(gh pr create \
    --base main \
    --head "$branch" \
    --title "$title" \
    --body "$(printf 'Closes #%s\n\nWorked unattended on the Mac Mini. The agent edited the files; this script ran the typecheck and the build, both of which pass.\n\n**The Mini has no browser.** Anything visual in this PR is unverified. See the UNVERIFIED line in the commit message for what still needs human eyes.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)' "$n")") || {
      log "#$n: could not open a PR (token permissions?). Branch $branch is pushed."
      git checkout main --quiet
      continue
    }
  gh issue comment "$n" --body "Worked on the Mac Mini. PR: $url" || true
  log "#$n: PR $url"

  git checkout main --quiet
done

log "queue drained"
