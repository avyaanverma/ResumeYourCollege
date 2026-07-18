# Application flows

## 1. Authentication and dashboard

```text
Visitor → /login or /register
  → data-route action submits form
  → POST /public/auth/login or /register
  → server validates and sets session cookies
  → Redux receives safe user session state
  → redirect /dashboard
  → dashboard loader calls GET /public/auth/me
  → authorized dashboard renders
```

Failure cases: validation errors stay on the form; `401` returns to login; `409` shows duplicate-email guidance; unavailable API shows a retryable connection message.

## 2. Resume creation and autosave

```text
Dashboard → Create resume → POST /resumes
  → redirect /resumes/:resumeId/edit
  → loader fetches owned resume
  → user edits one section
  → debounced PATCH /resumes/:resumeId
  → service verifies ownership + validates patch
  → repository persists update
  → UI reports Saved / retry state
```

Create version snapshots only when the user explicitly saves a version, publishes, restores, or exports; not for every keystroke.

## 3. AI improvement

```text
Select a resume section → request improvement
  → POST /ai/improve-experience
  → server validates, checks resume ownership, builds minimal context
  → AI provider adapter returns structured suggestions
  → UI previews alternatives
  → user accepts one
  → normal resume PATCH saves the selected text
```

AI suggestions are proposals, never automatic edits.

## 4. Export and share

```text
Export PDF → POST /resumes/:id/exports → 202 exportId
  → client polls GET /exports/:exportId
  → ready → temporary signed download URL

Share → POST /resumes/:id/share-links
  → public token URL
  → visitor GET /public/resumes/:token
  → sanitized published resume only
```

## 5. Admin flow

```text
Admin sign-in → authenticate → authorizeRoles('ADMIN')
  → /private/templates, /private/users, /private/analytics
  → audit every write action
```

No admin logic belongs in public client routes without server-side role enforcement.
