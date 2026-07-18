# Security and privacy guide

## Authentication

- Hash passwords with bcrypt (cost 12 or higher).
- Keep access and refresh tokens in `HttpOnly`, `Secure` (production), appropriate `SameSite` cookies.
- Verify access token signatures with `ACCESS_TOKEN_SECRET`; use the correct `_id` JWT claim.
- Rotate refresh tokens and revoke them on logout, password reset, and account disable.
- Apply strict rate limits to register, login, reset, AI, export, and public share endpoints.

## Authorization and data isolation

- Every resource service derives the actor from `req.user`, then checks ownership before repository reads/writes.
- Never accept `userId`, `ownerId`, role, or audit identity from a client request.
- Add `authorizeRoles('ADMIN')` after `authenticate` for `features/private` routes.
- Use projections to exclude `password`, `refreshToken`, internal notes, and audit fields.

## Input and output safety

- Validate body, params, and query with Zod before controller logic.
- Use an allow-list of patchable fields for resume autosave.
- Apply payload limits, HPP protection, Helmet, CORS allow-lists, compression, and structured error handling.
- Do not return error stack traces in production.
- Treat resume content as untrusted when rendering; escape text and sanitize any rich text.

## AI and privacy

- Never expose OpenAI/Gemini/API provider keys to the client.
- Minimize personal data sent to providers and explain this processing in the privacy policy.
- Log request metadata, not raw passwords, cookies, full tokens, or unnecessary resume contents.
- Validate AI output and require user confirmation before changing documents.

## Secrets incident note

If a real credential is ever committed or pasted into logs, rotate it immediately, invalidate affected sessions, remove it from repository history according to team policy, and update the deployment secret store. Do not copy credentials into docs or test fixtures.
