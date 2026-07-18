# Account, analytics, and admin API

Status: **Designed — not yet implemented**. These endpoints complete the account and operational API surface.

## Account profile

All profile routes require authentication.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/users/me` | Get the current user's safe profile and preferences. |
| `PATCH` | `/api/v1/users/me` | Update allowed profile fields and preferences. |
| `POST` | `/api/v1/users/me/avatar` | Upload/refer to a profile image after file validation. |
| `DELETE` | `/api/v1/users/me/avatar` | Remove avatar reference and asset. |
| `DELETE` | `/api/v1/users/me` | Request account deletion; revoke sessions and schedule purge. |

Allowed patch body:

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "preferences": { "defaultTemplateId": "ObjectId", "autoSave": true }
}
```

Email changes must use a separate verification flow. Password changes must require the current password and revoke other sessions.

## Owner analytics

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/analytics/resumes/:resumeId?from=&to=` | Aggregate views/downloads for an owned resume. |
| `GET` | `/api/v1/analytics/overview?from=&to=` | Aggregate the current user's resume activity. |

Return aggregates, not raw visitor identifiers. Event collection is documented with share links in [Resume API](resumes.md#public-share-links-and-analytics).

## Private administration

All routes require `authenticate` and `authorizeRoles('ADMIN')`. Prefix: `/api/v1/private`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/users?page=&limit=&query=` | Search/list accounts with safe fields. |
| `PATCH` | `/users/:userId/status` | Enable or disable an account. |
| `GET` | `/templates` | List all templates including drafts. |
| `POST` | `/templates` | Create a template. |
| `PATCH` | `/templates/:templateId` | Update/publish/unpublish a template. |
| `GET` | `/ai-generations?from=&to=` | Review quota/health metadata, never raw secrets. |
| `GET` | `/audit-logs?actorId=&action=` | Review immutable administrative audit events. |

Every private write must create an audit record containing actor ID, action, target type/ID, timestamp, and safe before/after summary. Do not make administrative APIs accessible merely because the client hides a button; authorization is always enforced in the service/middleware.
