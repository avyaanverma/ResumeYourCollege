# Module catalogue and delivery plan

## Product modules

| Module | Scope | API status | Primary server location |
| --- | --- | --- | --- |
| Public auth | Register, login, logout, current session. | Implemented | `features/public/auth` |
| Profile | Preferences, avatar, account deletion. | Designed | `features/public/user` |
| Resume builder | CRUD, sections, autosave, versioning. | Designed | `features/public/resume` |
| Templates | Browse templates; admin template management. | Designed | `features/public/template`, `features/private/template` |
| AI assistant | Improve text, summaries, skills, ATS, cover letters. | Designed | `features/public/ai` |
| Export | Asynchronous PDF/DOCX generation and downloads. | Designed | `features/public/export` |
| Sharing | Publish/revoke links and public rendered resume. | Designed | `features/public/share` |
| Analytics | Resume views/downloads and owner summary. | Designed | `features/public/analytics` |
| Admin | Users, template moderation, provider/audit dashboards. | Designed | `features/private/admin` |

## Recommended delivery order

1. Stabilize auth: add refresh rotation, email verification/reset, role middleware, and auth integration tests.
2. Build resume model, ownership-safe CRUD, and editor/autosave UX.
3. Add templates and a deterministic PDF export path.
4. Add versions and revocable sharing.
5. Add AI provider adapter, structured output validation, quotas, and audit records.
6. Add analytics and private admin tools.

## Definition of done for every module

- Contract documented in `docs/api/` with implementation status.
- Zod schema covers body, params, and relevant query values.
- Route/controller/service/repository/model boundaries are respected.
- Ownership and role tests cover access failures.
- Client uses data-route loader/action patterns and displays pending/error states.
- Sensitive data and provider credentials are absent from browser bundles, logs, and responses.
