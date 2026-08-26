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

# The issue body is read three times per ticket, for the prompt, for ADD_DIR and
# for OWNS. Cache it once so a long queue does not hammer the API.
BODY_CACHE=$(mktemp -d)
trap 'rm -rf "$BODY_CACHE"' EXIT
body() {
  local f="$BODY_CACHE/$1"
  [[ -f "$f" ]] || gh issue view "$1" --json body --jq .body > "$f"
  cat "$f"
}

# COLLISION GUARD, part one: declarations, before any agent starts.
#
# Two branches that rewrite one file can both be correct and both be green, and
# only one of them can merge. It is not a race. The worker pulls fresh main
# before every ticket, but merging is human gated, so ticket two branches from a
# main that does not contain ticket one and will not until somebody clicks
# merge. This cost a completed ticket on 2026-08-26, when #34 and #37 rewrote
# Project.tsx one second apart. See docs/adr/0005-collision-guard.md.
#
# A ticket declares what it will rewrite with lines like:
#   OWNS: src/data/projects/pickleball-iq.ts
#
# The later claimant is skipped by number and left agent-ready. The rest of the
# queue runs, because refusing the whole batch would stop the tickets that
# collide with nothing, which is the failure this guard exists to prevent.
#
# Flat files rather than associative arrays on purpose: `env bash` on the Mini
# resolves to macOS bash 3.2, which has no `declare -A`.
owns_map=$(mktemp)
skips=$(mktemp)
trap 'rm -rf "$BODY_CACHE" "$owns_map" "$skips"' EXIT

for n in $numbers; do
  claims=$(body "$n" | sed -n 's/^OWNS:[[:space:]]*//p' | tr -d '\r' | sed '/^$/d')
  if [[ -z "$claims" ]]; then
    log "#$n: declares no OWNS, allowed unguarded"
    continue
  fi
  conflict=""
  while IFS= read -r f; do
    prev=$(awk -F'\t' -v f="$f" '$1==f {print $2; exit}' "$owns_map")
    if [[ -n "$prev" ]]; then
      conflict="$f|$prev"
      break
    fi
  done <<< "$claims"

  if [[ -n "$conflict" ]]; then
    printf '%s\t%s\t%s\n' "$n" "${conflict%%|*}" "${conflict##*|}" >> "$skips"
    log "#$n: SKIPPED, it claims ${conflict%%|*} which #${conflict##*|} already claims in this batch"
    continue
  fi
  while IFS= read -r f; do
    printf '%s\t%s\n' "$f" "$n" >> "$owns_map"
  done <<< "$claims"
done

if [[ -s "$skips" ]]; then
  log "collision guard: skipping $(wc -l < "$skips" | tr -d ' ') ticket(s) this batch. Merge the PRs above and run again."
fi

for n in $numbers; do
  branch="issue-$n"

  if grep -q "^$n\t" "$skips" 2>/dev/null; then
    log "#$n: held by the collision guard, leaving it agent-ready"
    continue
  fi

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
$(body "$n")
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

  # Directories outside the repo that this issue needs to read.
  #
  # Claude Code confines a session to its working directory, and a headless run
  # can never answer the prompt that would widen it. All three extractor
  # tickets blocked on exactly that: #4 could not read
  # ~/dev/nlp-material-classifier, #5 and #6 could not read iCloud. They were
  # right to stop rather than invent, but the fix is to grant the access.
  #
  # An issue declares what it reads with lines like:
  #   ADD_DIR: /Users/tmaxxx/dev/nlp-material-classifier
  # which become --add-dir arguments. Access is per issue and declared in
  # public, rather than the worker handing every agent the whole disk.
  add_dirs=()
  while IFS= read -r d; do
    [[ -n "$d" ]] && add_dirs+=(--add-dir "$d")
  done < <(body "$n" | sed -n 's/^ADD_DIR:[[:space:]]*//p' | tr -d '\r')
  if [[ ${#add_dirs[@]} -gt 0 ]]; then
    log "#$n: granting read access to $((${#add_dirs[@]})) extra path(s)"
  fi

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
  claude -p "$prompt" ${add_dirs[@]+"${add_dirs[@]}"} --permission-mode acceptEdits 2>&1 | tail -30 || {
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

  # COLLISION GUARD, part two: the real diff, against every open PR.
  #
  # OWNS: is a prediction written by whoever filed the ticket, and the incident
  # this guards against was not predicted: #37 was titled "CSI as the reference
  # case study" and rewrote Project.tsx because that is what the work turned out
  # to need. A declaration catches the collisions somebody anticipated. This
  # catches the ones nobody did, and it catches collisions with PRs opened by an
  # earlier run of this script, which a per invocation scan structurally cannot.
  #
  # The branch is DISCARDED rather than held. Holding it holds the stale base
  # with it, so merging it later reintroduces the same problem. Re-running the
  # ticket against a merged main is the only thing that actually resolves it,
  # and on 2026-08-26 re-running #37 that way produced a better result than any
  # hand resolution would have.
  touched=$(git diff --name-only main)
  open_pr_files=$(gh pr list --state open --json number,files \
    --jq '.[] | . as $p | .files[] | "\(.path)\t\($p.number)"' 2>/dev/null || true)
  overlap=""
  if [[ -n "$open_pr_files" ]]; then
    while IFS= read -r f; do
      [[ -z "$f" ]] && continue
      hit=$(printf '%s\n' "$open_pr_files" | awk -F'\t' -v f="$f" '$1==f {print $2; exit}')
      if [[ -n "$hit" ]]; then
        overlap="$f|$hit"
        break
      fi
    done <<< "$touched"
  fi

  if [[ -n "$overlap" ]]; then
    log "#$n: COLLISION with PR #${overlap##*|} on ${overlap%%|*}, discarding this branch"
    gh issue comment "$n" --body "$(printf 'Held by the collision guard. This ticket rewrote `%s`, which is also rewritten by the open PR #%s.\n\nBoth branches would be green and only one could merge, so this run was discarded rather than opened as a PR. Merge #%s first, then re-run this ticket: it will be written against the merged file rather than resolved by hand, which is the better result.' "${overlap%%|*}" "${overlap##*|}" "${overlap##*|}")" || true
    rm -f COMMIT_MSG.md
    git checkout -- . 2>/dev/null || true
    git clean -fdq 2>/dev/null || true
    git checkout main --quiet
    git branch -D "$branch" --quiet
    continue
  fi

  # The agent writes its commit message to a file, since it cannot run git.
  #
  # Copy it OUT of the tree before doing anything else. The first version of
  # this pointed msg_file at COMMIT_MSG.md in place, then deleted the file to
  # keep it out of the commit, and then asked git to read the message from the
  # path it had just deleted. git failed, set -e killed the run, and issue #3
  # in the same batch was never attempted. The work survived on the branch, the
  # agent's own commit message did not.
  msg_file=$(mktemp)
  if [[ -f COMMIT_MSG.md ]]; then
    cp COMMIT_MSG.md "$msg_file"
    rm -f COMMIT_MSG.md
  else
    printf 'Work issue #%s: %s\n\nThe agent did not leave a commit message.\n' "$n" "$title" > "$msg_file"
  fi

  git add -A
  if ! git commit --quiet -F "$msg_file"; then
    log "#$n: COMMIT FAILED, leaving branch $branch in place for a human"
    gh issue comment "$n" --body "The Mac Mini worker could not commit. Branch \`$branch\` is on the Mini with the changes intact." || true
    git checkout main --quiet
    continue
  fi

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
