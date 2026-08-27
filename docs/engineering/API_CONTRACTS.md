# PF Health API Contracts

The MVP may implement these contracts as Next.js route handlers or equivalent application interfaces. Domain behavior must not depend on HTTP. All request and response bodies are schema-validated.

## Conventions

- Base path: `/api/v1`
- JSON only for application endpoints
- ISO-8601 UTC timestamps
- Opaque synthetic IDs
- `Cache-Control: no-store` for member and resolution state
- Mutation requests require expected snapshot version
- Errors use one stable envelope and never expose stack traces

```ts
interface ApiError {
  error: {
    code:
      | "VALIDATION_ERROR"
      | "NOT_FOUND"
      | "CONFLICT"
      | "UNSUPPORTED_ACTION"
      | "REVIEW_REQUIRED"
      | "INTERNAL_ERROR";
    message: string;
    requestId: string;
    fieldErrors?: Record<string, string[]>;
  };
}
```

## GET `/api/v1/demo/member`

Returns the current synthetic member view. It never accepts a UAN or other government identifier.

**200:**

```json
{
  "member": {
    "memberId": "demo_ravi",
    "displayName": "Ravi Sharma",
    "snapshotVersion": 1,
    "employments": []
  }
}
```

## POST `/api/v1/demo/reset`

Resets only the known local demo fixture and appends a `DEMO_RESET` audit event. No arbitrary member ID or payload is accepted.

**200:** current member summary and initial assessment, or a stable link to retrieve them.

## POST `/api/v1/assessments`

**Request:**

```json
{
  "memberId": "demo_ravi",
  "workflow": { "type": "GENERAL_HEALTH" },
  "expectedSnapshotVersion": 1
}
```

**200:**

```json
{
  "assessment": {
    "assessmentId": "assessment_01",
    "memberId": "demo_ravi",
    "memberSnapshotVersion": 1,
    "ruleSetVersion": 1,
    "status": "NEEDS_ATTENTION",
    "passedChecks": 4,
    "failedChecks": 1,
    "unknownChecks": 0,
    "totalChecks": 5,
    "checks": [],
    "issues": [],
    "evaluatedAt": "2026-08-22T00:00:00.000Z"
  }
}
```

The real response includes structured checks and issues defined in `DATA_MODEL.md`; the abbreviated arrays above are not permission to omit them.

**409:** snapshot version is stale.

## GET `/api/v1/assessments/{assessmentId}`

Returns a previously completed assessment. It must not silently rerun rules. Unknown IDs return 404.

## GET `/api/v1/issues/{issueId}`

Returns an issue-detail view model with deterministic fallback copy, structured owners/actions, source references, and limitations. Generated copy, if present, is separately labeled and cannot alter structured values.

## POST `/api/v1/resolutions`

Opens a resolution for a current issue.

```json
{
  "memberId": "demo_ravi",
  "issueId": "issue_01",
  "expectedSnapshotVersion": 1
}
```

Returns `201` with an `OPEN` resolution. Reject if the issue does not belong to the current snapshot.

## POST `/api/v1/resolutions/{resolutionId}/select-action`

```json
{
  "actionCode": "SIMULATE_EXIT_UPDATE"
}
```

The action must appear in the issue's allowed actions. Selection does not mutate member data.

## POST `/api/v1/resolutions/{resolutionId}/confirm-simulation`

Returns a short-lived, single-use confirmation token bound to the resolution, member, employment record, proposed field changes, and expected snapshot version. The response repeats the exact synthetic changes and disclaimer for confirmation UI.

## POST `/api/v1/resolutions/{resolutionId}/apply-simulation`

```json
{
  "employmentId": "employment_previous_01",
  "expectedSnapshotVersion": 1,
  "exitDate": "2025-06-30",
  "exitReason": "CESSATION_SHORT_SERVICE",
  "confirmationToken": "opaque-token"
}
```

On success, atomically validate the token/action/version, apply the synthetic mutation, append an audit event, rerun checks, append revalidation, and return the updated member, before/after summary, and new assessment.

**409:** token replay, stale version, or state conflict.
**422:** invalid or unsupported action/field values.

## GET `/api/v1/members/{memberId}/audit-events`

Returns safe events ordered by occurrence time and stable tie-breaker. Pagination is optional for the MVP; the contract must not expose arbitrary metadata.

## POST `/api/v1/ai/issue-explanation`

Optional and non-authoritative. Accepts an issue ID and locale, not raw member data. The server constructs minimal facts from the current structured issue.

On AI failure or invalid output, return deterministic fallback content with `source: "DETERMINISTIC_FALLBACK"`; do not fail the health journey.

## POST `/api/v1/ai/correction-draft`

Optional. Accepts an issue ID, resolution action code, locale, and explicitly editable synthetic context. It may return draft text only. It cannot return commands, status, owners, eligibility, or new facts.

## Contract safeguards

- Every stateful route requires a verified Supabase session and otherwise returns `UNAUTHENTICATED` with HTTP 401.
- Ownership is derived from the verified Auth user UUID, never accepted from client JSON.
- Cross-owner aggregate IDs are represented as `NOT_FOUND`; APIs do not disclose their existence.
- No open-ended proxy endpoint to a model.
- No endpoint accepts real identifiers, credentials, OTPs, or arbitrary government URLs.
- Route handlers call application services rather than repositories/rules directly.
- API schema tests cover success and every stable error code.
- Contract changes require this file and relevant consumer tests to change together.
# Laboratory session boundary

Authenticated laboratory routes live under `/api/v1/laboratory`. Presets are read-only and public-safe; every session route requires authentication and is owner-isolated by both query predicates and RLS. Session creation accepts one preset ID or one strict `pf-health-synthetic-scenario@1` document. Draft replacement and runs require `expectedDraftVersion`; confirmed simulations additionally require `expectedSnapshotVersion`. A persisted aggregate revision prevents concurrent request loss. Runs alone create authoritative snapshots, assessments, evidence graphs, actor plans, and run audit events. Scenario JSON excludes user IDs, session IDs, assessment results, audit events, and confirmation/runtime state.

Routes: `GET /presets`; `POST /sessions`; `GET|PUT /sessions/{sessionId}`; `POST /sessions/{sessionId}/runs`; confirmed `simulate-exit-update` and `simulate-account-link` actions; and `POST /sessions/{sessionId}/reset`.

# Authentication and history boundary

Supabase Auth performs Google OAuth using the PKCE flow. Browser and server clients use the publishable key; sessions are rotated through secure SSR cookies. `/login` starts Google OAuth, `/auth/callback` exchanges the authorization code for the Supabase session, and sign-out clears that session. The callback accepts only relative `next` destinations and falls back to `/history`. `/history` is a server-rendered private page rather than a public JSON endpoint. It lists up to 50 recent Guided Ravi runs and 50 Laboratory sessions, permits Laboratory resume, and exposes owner-scoped deletion actions.
