# AI API and safety design

Status: **Designed — not yet implemented**. Prefix: `/api/v1/ai`. All routes require an authenticated user and an owned `resumeId`.

## Endpoints

| Method | Endpoint | Input | Output |
| --- | --- | --- | --- |
| `POST` | `/generate-summary` | Resume context, target role, tone. | 1–3 proposed summaries. |
| `POST` | `/improve-experience` | One experience item and target role. | Rewritten bullet options. |
| `POST` | `/improve-project` | Project context and role. | Achievement-focused bullets. |
| `POST` | `/suggest-skills` | Resume context and target job description. | Ranked missing skills with rationale. |
| `POST` | `/ats-analysis` | Resume ID and job description. | Score, keywords, gaps, and fixes. |
| `POST` | `/grammar-check` | Selected text only. | Corrections with before/after. |
| `POST` | `/cover-letter` | Resume ID, job description, tone. | Draft plus editable sections. |

Example request:

```json
{
  "resumeId": "ObjectId",
  "jobDescription": "We need a React developer…",
  "targetRole": "Frontend Intern",
  "tone": "confident"
}
```

## Service flow

```text
Controller
  → validate shape, length, and auth
  → service verifies resume ownership
  → context builder selects only necessary resume fields
  → prompt builder emits provider-neutral structured prompt
  → provider adapter calls configured model
  → output parser validates JSON schema and strips unsafe content
  → persist AI generation metadata
  → return suggestions; never silently overwrite the resume
```

## Non-negotiable guardrails

- The user explicitly accepts a suggestion before any resume update.
- Send minimum necessary PII. Redact contact data by default.
- Keep provider keys server-side only; never call an LLM from the browser.
- Rate-limit by user and endpoint; enforce token/input length budgets.
- Return `429` for limits and `503` for temporary provider failures without leaking provider errors.
- Record model, prompt template version, token use, latency, and acceptance outcome.
- Validate provider output with Zod before it enters the client or database.
- Do not claim ATS scores are guarantees of hiring outcomes.
