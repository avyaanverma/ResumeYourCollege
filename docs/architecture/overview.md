# Architecture overview

## System boundary

```text
React client (Vite, Router data APIs, Redux)
        │ HTTPS + cookie credentials
        ▼
Express REST API (/api/v1)
        │
        ▼
Controller → Service → Repository → Mongoose model → MongoDB
        │
        ├── Object storage (resume assets / exports)
        └── AI provider adapter (OpenAI or Gemini)
```

The client owns presentation, form state, route transitions, and optimistic UI. The server owns authorization, validation, business decisions, persistence, AI prompts, and third-party credentials.

## Five-layer backend architecture

Every server feature must use these layers in this order. A layer may only depend on layers to its right.

```text
Route → Controller → Service → Repository → Model
```

| Layer | Responsibility | Must not do |
| --- | --- | --- |
| **Route** | Declare URL, HTTP verb, middleware, and controller method. | Query MongoDB or contain business rules. |
| **Controller** | Convert HTTP input into a service call and return one `ApiResponse`. | Build database queries or call AI providers. |
| **Service** | Enforce ownership, workflows, transactions, calculations, and provider orchestration. | Read `req`/`res` or expose Mongoose details. |
| **Repository** | Encapsulate Mongoose queries and projection choices. | Enforce HTTP policy or validate request payloads. |
| **Model** | Define collection fields, indexes, defaults, and persistence-level invariants. | Import services/controllers. |

Cross-cutting code sits outside the five layers:

- `middlewares/`: authentication, validation, error mapping, rate limits.
- `utils/`: `ApiResponse`, `ApiError`, async wrappers, JWT helpers.
- `config/`: validated environment configuration.
- `logger/`: structured logging and redaction.

## Public versus private features

`features/public/` contains endpoints that work without a session, for example registration and login. A public feature can still expose protected routes in the same module when they operate on the authenticated user (such as `/auth/me` and `/auth/logout`).

`features/private/` is reserved for staff-only or system-administration features: user administration, template administration, moderation, analytics, audit logs, and provider configuration. Every private route must use `authenticate` plus a role/permission middleware.

## Frontend architecture

```text
app/       composition root: Redux store and data router
features/  business domains: auth, dashboard, resumes, ai
shared/    reusable API client, layouts, primitive UI, utilities
styles/    global tokens and baseline styles
```

React Router data routes own navigation loaders/actions. Redux stores cross-route client state such as the authenticated user, active resume, builder state, and notification queue. Server data must remain the canonical source; do not persist access tokens in local storage.

## Adding a feature

1. Add the API contract to `docs/api/` before implementation.
2. Add a Mongoose model and repository if the feature persists data.
3. Add validation, service, controller, and routes under the appropriate `features/public` or `features/private` module.
4. Mount the route in `server/src/app.js` using `/api/v1/...`.
5. Add client API functions, Redux slice only if cross-route state is needed, then a data route/action/loader.
6. Add unit tests for services and integration tests for routes.
