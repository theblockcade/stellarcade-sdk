# Repository Agent Standards

This file defines the minimum engineering standards that AI agents must follow
when working in this repository. These rules exist to prevent lint debt, weak
typing, build regressions, and workflow bypasses.

## Git and Hook Policy

- Never use `git commit --no-verify`.
- Never use `git push --no-verify`.
- Do not bypass, disable, or delete a failing hook. Fix the underlying issue
  instead.
- Direct pushes to `main` are never allowed, for anyone. Always work on a
  feature branch and open a pull request.
- Hooks live under `.githooks/` (version-controlled, not `.git/hooks/`) and
  are enabled via `git config core.hooksPath .githooks`, which `npm install`
  sets automatically via its `prepare` script. If `git config core.hooksPath`
  doesn't print `.githooks`, run `npm install` before doing anything else —
  an unset hooksPath means every check below is silently skipped, with no
  error.
- `pre-push` runs, in order: `npm run typecheck`, `npm run lint`,
  `npm audit --audit-level=high`, `npm test`, `npm run build` — and, only if
  `website/` files changed, `npm run typecheck && npm run build` inside
  `website/` too. Every applicable check must pass before a push succeeds.
- Confirm all of the above pass locally before pushing. If a check cannot be
  satisfied, report the blocker clearly instead of claiming the task is
  complete.

## Delivery Standard

Do not treat a task as complete until all of these pass:

- `npm run typecheck`
- `npm run lint`
- `npm audit --audit-level=high`
- `npm test`
- `npm run build`
- If you touched `website/`: `cd website && npm run typecheck && npm run build`

CI runs `.github/workflows/ci.yml` on every push/PR, plus
`.github/workflows/website-ci.yml` (typecheck + build) whenever `website/`
changes.

## Commit Message Standard

- Use the imperative mood in the subject line (e.g. `Fix settlement race`,
  not `Fixed` or `Fixes`).
- Keep the subject line to 50 characters or fewer where practical.
- Do not end the subject line with a period.
- Only add a body when it conveys information the subject line can't —
  don't restate the subject.
