# Folder structure and conventions

```text
ResumeYourCollege/
├── client/                            # JavaScript React application
│   ├── src/
│   │   ├── app/                       # Router and Redux store composition
│   │   ├── features/
│   │   │   ├── auth/                  # API, slice, pages, components
│   │   │   ├── dashboard/
│   │   │   ├── resumes/               # Planned resume builder feature
│   │   │   ├── ai/                    # Planned AI feature
│   │   │   └── templates/             # Planned template feature
│   │   ├── shared/                    # API client, layouts, generic UI
│   │   ├── styles/                    # Global styles and design tokens
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js
├── server/                            # Express / MongoDB API
│   ├── src/
│   │   ├── config/                    # Validated environment config
│   │   ├── constants/                 # API prefix and defaults
│   │   ├── db/                        # MongoDB connection
│   │   ├── features/
│   │   │   ├── public/                # Visitor and signed-in user modules
│   │   │   └── private/               # Admin/system modules
│   │   ├── logger/
│   │   ├── middlewares/
│   │   ├── model/
│   │   ├── repository/
│   │   └── utils/
│   ├── tests/
│   └── server.js
├── docs/                              # All authoritative docs
└── readme.md                          # Pointer to docs/readme.md
```

## Backend feature template

Use one folder per domain. Keep a feature cohesive rather than creating global controller/service folders.

```text
server/src/features/public/resume/
├── resume.routes.js
├── resume.controller.js
├── resume.service.js
└── resume.validation.js

server/src/model/resume.model.js
server/src/repository/resume.repository.js
```

For larger features, add `dto/`, `mappers/`, `providers/`, or `constants.js` inside that feature. Import repositories into services; controllers never query models directly.

## Naming rules

- Use lowercase kebab-free filenames in the existing form: `resume.service.js`, `auth.routes.js`.
- Use plural collection/resource names: `/resumes`, `/templates`.
- Use a verb only for a command that is not CRUD: `:improve`, `:export`, `:publish`.
- Validate incoming body/query/params with Zod at the route boundary.
- Keep response shape consistent with `ApiResponse`; do not return raw Mongoose documents containing sensitive fields.

## Current implementation note

Only `server/src/features/public/auth` is mounted by `server/src/app.js`. Treat the private auth/user folders as unfinished scaffolding until their imports, environment usage, and route mounting are completed.
