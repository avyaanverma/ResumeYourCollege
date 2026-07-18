# TODO - Atomic auth commits (server -> client)

## Step 1: Baseline
- [x] Confirm commit boundary: keep existing HEAD (`8b6abc0`) and create atomic commits only for current working tree changes.

## Step 2: Inspect current working changes
- [ ] Read/verify all auth-related files in server and client that are currently modified/untracked.
- [ ] Map the “feature-by-feature” sequence to produce ~40–50 atomic commits.

## Step 3: Start commit batching strategy
- [ ] Create a logical sequence (server setup → middleware → public auth routes → controller/service → models/repo → private/protected auth → client API → auth actions/pages/router → guarded routing).

## Step 4: Implement commits
- [ ] For each atomic step:
  - [ ] Update exactly one small purpose
  - [ ] Run relevant tests (server vitest)
  - [ ] Commit with a clear single-purpose message

## Step 5: Validate end-to-end
- [ ] Run server tests: `cd server && npm test`
- [ ] Build client: `cd client && npm run build` (if available)
- [ ] Run app sanity checks: login/register flow uses cookies and can access /dashboard.

