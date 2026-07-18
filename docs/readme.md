# ResumeYourCollege documentation

ResumeYourCollege is an AI-assisted resume builder for students and early-career professionals. This folder is the source of truth for product, API, and engineering documentation.

## Start here

| Document | Use it for |
| --- | --- |
| [Setup guide](development/setup.md) | Run the client and server locally. |
| [Architecture overview](architecture/overview.md) | Understand the five-layer backend and frontend boundaries. |
| [Folder structure](architecture/folder-structure.md) | Find a feature or add a new one. |
| [Application flows](product/application-flows.md) | Follow authentication, resume, AI, export, and sharing journeys. |
| [API overview](api/overview.md) | Learn API conventions and implementation status. |
| [Auth API](api/authentication.md) | Integrate registration, login, logout, and current-user calls. |
| [Resume API design](api/resumes.md) | Implement the resume lifecycle. |
| [AI API design](api/ai.md) | Implement safe AI-assisted writing and ATS analysis. |
| [Account and admin API](api/account-admin.md) | Implement profile, analytics, and role-protected operations. |
| [Module catalogue](product/modules.md) | See every planned product module and ownership boundary. |
| [Data model](architecture/data-model.md) | Implement MongoDB collections and relationships. |
| [Security guide](development/security.md) | Apply auth, privacy, and AI safety requirements. |

## Documentation status

The public authentication API is implemented under `server/src/features/public/auth` and mounted at `/api/v1/public/auth`. The remaining API documents are the approved target contract for upcoming modules; they are not a claim that those endpoints are already live. Each endpoint table marks its status.

## Documentation map

```text
docs/
├── readme.md                         # This index
├── architecture/
│   ├── overview.md                   # Five-layer architecture
│   ├── folder-structure.md           # Source tree and conventions
│   └── data-model.md                 # MongoDB design
├── api/
│   ├── overview.md                   # API rules, errors, versioning
│   ├── authentication.md             # Current auth contract
│   ├── resumes.md                    # Resume/template/export contract
│   └── ai.md                         # AI contract and guardrails
├── development/
│   ├── setup.md                      # Local setup and commands
│   └── security.md                   # Security checklist
└── product/
    ├── application-flows.md          # End-to-end user flows
    └── modules.md                    # Feature catalogue and delivery order
```

Legacy reference material remains in `docs/authentication/` and `docs/server/`. It is not normative; use the Markdown documents above for current development.
