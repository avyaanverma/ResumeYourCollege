# Data model

The current `User` model is implemented. The remaining collections are the target schema for the resume-builder modules.

## Collections

| Collection | Purpose | Key indexes |
| --- | --- | --- |
| `users` | Identity, preferences, session metadata. | unique `email`; `role`. |
| `resumes` | One editable resume document and its structured sections. | `{ ownerId, updatedAt }`; `slug` when published. |
| `resumeVersions` | Immutable snapshot created on explicit save/export/publish. | `{ resumeId, version }` unique. |
| `templates` | System or user-owned visual templates. | `{ visibility, category }`. |
| `aiGenerations` | Auditable AI request metadata and accepted output. | `{ userId, createdAt }`; TTL only for sensitive raw prompts if required. |
| `exports` | Generated PDF/docx artifact metadata. | `{ resumeId, createdAt }`. |
| `shareLinks` | Revocable public resume URLs. | unique `token`; `{ resumeId, isActive }`. |
| `analyticsEvents` | Privacy-safe view/download event aggregates. | `{ resumeId, occurredAt }`. |

## Resume document shape

```json
{
  "_id": "ObjectId",
  "ownerId": "ObjectId",
  "title": "Software engineering internship resume",
  "templateId": "ObjectId",
  "status": "draft",
  "basics": { "fullName": "…", "email": "…", "links": [] },
  "summary": "…",
  "experience": [{ "id": "uuid", "company": "…", "bullets": ["…"] }],
  "education": [],
  "projects": [],
  "skills": [],
  "certifications": [],
  "customSections": [],
  "style": { "accentColor": "#4f46e5", "font": "system" },
  "ats": { "lastScore": null, "lastAnalyzedAt": null },
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

Store section item IDs as UUIDs so the client can reorder/update individual entries safely. Do not store generated PDFs or access tokens inside the resume document; store external asset references only.
