# Contributing to stellarcade-sdk

Thanks for your interest in contributing! Please read these rules before you
start — pull requests that don't follow them will be closed.

## The rules

1. **Fork the repo and work from your fork.** Clone your fork, make your
   changes on a branch there, and push to your fork. Never push to this
   repository directly.

   ```sh
   gh repo fork TheBlockCade/stellarcade-sdk --clone
   cd stellarcade-sdk
   git checkout -b my-change
   # ...work, commit...
   git push -u origin my-change
   ```

2. **All pull requests must target `main`** unless a release branch is
   explicitly announced. Draft PRs are welcome for early feedback.

3. **Contributor changes must stay inside `contrib/`** unless the change is a
   bug fix with a linked issue. See [contrib/README.md](contrib/README.md) for
   what belongs there. If your change genuinely requires touching code outside
   `contrib/`, open an issue first and say so — a maintainer will confirm
   scope before you invest the work.

4. **One logical change per PR.** Don't bundle an unrelated refactor with a
   feature; it makes review slower for everyone.

## Before you open a PR

Make sure the package still typechecks, tests, and builds:

```sh
npm install
npm run typecheck
npm test
npm run build
```

New code is expected to come with tests. `fairness.ts` in particular is
security-sensitive — changes there need tests that cover both the accept and
reject paths, not just the happy path.
