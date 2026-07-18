# API overview

Base URL: `http://localhost:5000/api/v1` in local development. The API prefix is defined by `appConstants.API_PREFIX`.

## Status legend

- **Implemented**: mounted in `server/src/app.js` and supported by current code.
- **Designed**: approved contract; implement before a client depends on it.

## Conventions

| Area | Rule |
| --- | --- |
| Format | JSON request/response except multipart upload endpoints. |
| Dates | ISO 8601 UTC strings. |
| IDs | MongoDB ObjectId strings unless a section item explicitly uses UUID. |
| Auth | HttpOnly `accessToken` cookie. Clients send `withCredentials: true`. Bearer tokens may be supported for non-browser clients. |
| Pagination | `?page=1&limit=20`; response meta includes `page`, `limit`, `total`, `hasNextPage`. |
| Mutations | `POST` creates, `PATCH` partially updates, `DELETE` removes/revokes. |
| Ownership | The server derives owner identity from the session; clients never submit `ownerId`. |

## Standard envelope

Successful requests use the current server envelope:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Human-readable result",
  "data": {}
}
```

Errors should converge on:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "body.email", "message": "Invalid email" }]
}
```

Never expose a stack trace, provider error payload, password hash, refresh token, or raw token in production responses.

## Endpoint inventory

| Domain | Prefix | Status | Reference |
| --- | --- | --- | --- |
| Authentication | `/public/auth` | Implemented | [Auth API](authentication.md) |
| Resumes | `/resumes` | Designed | [Resume API](resumes.md) |
| Templates | `/templates` | Designed | [Resume API](resumes.md#templates-and-exports) |
| Exports / sharing | `/resumes/:resumeId` | Designed | [Resume API](resumes.md#templates-and-exports) |
| AI writing / ATS | `/ai` | Designed | [AI API](ai.md) |
| Account, analytics, admin | `/users`, `/analytics`, `/private` | Designed | [Account and admin API](account-admin.md) |

## Versioning and deprecation

Breaking changes require `/api/v2`; additive fields and new endpoints remain in v1. Document a deprecation date, replacement endpoint, and migration note before removing a field.
