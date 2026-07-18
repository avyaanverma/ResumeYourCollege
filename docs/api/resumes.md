# Resume, template, export, and sharing API

Status: **Designed — not yet implemented**. All routes require authentication unless marked public.

## Resume lifecycle

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/resumes?page=1&limit=20&status=draft` | List the signed-in user's resumes. |
| `POST` | `/api/v1/resumes` | Create a blank or template-based resume. |
| `GET` | `/api/v1/resumes/:resumeId` | Fetch one owned resume. |
| `PATCH` | `/api/v1/resumes/:resumeId` | Autosave a partial document update. |
| `DELETE` | `/api/v1/resumes/:resumeId` | Soft-delete a resume; never hard-delete synchronously. |
| `POST` | `/api/v1/resumes/:resumeId/duplicate` | Create a copy owned by the requester. |
| `POST` | `/api/v1/resumes/:resumeId/versions` | Save immutable version snapshot. |
| `GET` | `/api/v1/resumes/:resumeId/versions` | List version history. |
| `POST` | `/api/v1/resumes/:resumeId/restore` | Restore a selected version. |

### Create request

```json
{ "title": "Summer internship", "templateId": "optionalObjectId" }
```

### Patch request

Use a narrow patch body so autosave does not overwrite unrelated sections:

```json
{
  "summary": "Computer science student building full-stack web applications.",
  "experience": [{ "id": "uuid", "company": "Acme", "bullets": ["Built…"] }]
}
```

The service confirms the resume belongs to `req.user._id`, validates allowed fields, updates `updatedAt`, and creates a version only for explicit version/publish/export events.

## Templates and exports

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/templates` | List public templates. |
| `GET` | `/api/v1/templates/:templateId` | Get a template schema and preview metadata. |
| `POST` | `/api/v1/private/templates` | Admin: create a template. |
| `PATCH` | `/api/v1/private/templates/:templateId` | Admin: update a template. |
| `POST` | `/api/v1/resumes/:resumeId/exports` | Queue PDF/DOCX export. |
| `GET` | `/api/v1/exports/:exportId` | Read export status and signed download URL. |

Export body: `{ "format": "pdf" }`. Respond with `202` and an export ID when generation is asynchronous. Signed download URLs must expire and must not expose permanent storage paths.

## Public share links and analytics

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/resumes/:resumeId/share-links` | Create/re-enable a share link. |
| `DELETE` | `/api/v1/resumes/:resumeId/share-links/:linkId` | Revoke a link. |
| `GET` | `/api/v1/public/resumes/:token` | Public sanitized resume view. |
| `POST` | `/api/v1/public/resumes/:token/events` | Record allowed view/download event. |

Public views must return only intentionally published data, never user email by default, edit metadata, AI history, or private notes.
