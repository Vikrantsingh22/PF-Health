# PF Health Security and Privacy

## Security posture

PF Health is a synthetic-record prototype with private cloud history. Its strongest PF-data privacy control remains refusing to collect or integrate real member data. The only real personal datum accepted is the Google-verified email identity managed by Supabase Auth; application history is keyed by the immutable Auth user UUID and does not duplicate email.

## Development sandbox boundary

All development execution is isolated in Docker. No project dependency installation, application process, test runner, build, seed/reset command, or local datastore may run directly on the host.

- Mount only files below the `pf-health` repository root.
- Never mount the Docker socket, user home directory, parent/sibling repositories, system directories, devices, or credential stores.
- Run as a non-root container user with no privileged mode or added capabilities unless a narrowly documented need is approved.
- Use a dedicated bridge network; do not use host network, PID, or IPC namespaces.
- Bind required ports to `127.0.0.1` only.
- Keep dependency and mutable runtime state in named volumes or disposable container storage.
- Scope Docker commands, logs, and cleanup to the PF Health Compose project. Never prune or stop unrelated images, containers, volumes, or networks.
- Prefer a read-only container filesystem where practical, with explicit writable mounts for application needs.

If Docker is unavailable or a task requires access outside this boundary, stop and request a human decision. Do not fall back to host-native execution.

## Data classification

### Allowed

- Clearly fictional names, employers, dates, identifiers, and documents
- Rule IDs, source IDs, assessment results, and safe audit metadata
- A Google-verified email identity held in Supabase Auth solely for sign-in and ownership
- Standard Google identity scopes required by Supabase (`openid`, email, and profile); no Google API access is requested and provider tokens are not read or persisted in application storage
- Local developer configuration without secrets

### Prohibited

- Real or plausible UAN, Aadhaar, PAN, bank account, phone, PF/EPFO OTP, government credential, claim, passbook, employer account, or identity document data
- EPFO/member-portal sessions or cookies
- Production API keys committed to Git
- Scraped government records

Fixtures use obvious synthetic prefixes and must be reviewed before commit.

## Threats and controls

### Accidental real-data entry

- Do not provide fields for UAN/Aadhaar/PAN/bank data.
- Display a synthetic-data notice near sample selection and drafting.
- Use server-side allowlists and reject unexpected identifier-shaped fields.
- Keep telemetry off by default for the demo.

### Unauthorized or stale mutation

- Stateful pages and APIs require a server-verified Supabase user session.
- User-owned rows reference `auth.users(id)` and enforce select/insert/update/delete ownership through RLS.
- Ownership comes only from the verified session; never from a request body or route parameter.
- Guided and Laboratory aggregate updates require optimistic revisions in addition to domain snapshot versions.
- Mutations remain limited to the known demo member or the authenticated user's synthetic Laboratory session and allowed actions.
- Require expected snapshot version and explicit simulation confirmation.
- Bind confirmation tokens to exact proposed changes; make them short-lived and single-use.
- Append audit events atomically with mutation/revalidation where feasible.

### Injection and model misuse

- Treat model/document content as untrusted.
- Use strict schemas, prompt separation, output limits, and deterministic fallback.
- Never expose an open-ended model proxy or tool access from the product.
- Never let model output select commands or database fields.

### Web application risks

- Validate all inputs server-side with strict schemas.
- Encode output through React defaults; sanitize any future rich text.
- Use secure headers and a restrictive content security policy compatible with the app.
- Keep error responses generic and attach a request ID.
- Prevent confirmation-token replay and apply rate limits to AI/mutation routes if network-accessible.
- Do not use dynamic execution or unsafe HTML for generated text.

The shipped app applies a same-origin CSP, blocks framing and MIME sniffing, suppresses referrer disclosure, isolates the top-level browsing context, and disables camera, microphone, geolocation, payment, and USB permissions. Next.js requires inline bootstrap scripts for hydration, so `script-src` permits inline scripts but no third-party origin; development alone also permits evaluation and WebSocket connections for hot reloading. Generated or user-controlled rich HTML is prohibited, and React's escaped rendering remains the content boundary.

### Dependency and secret risks

- Pin dependencies with a lockfile and keep the dependency set small.
- Review installation scripts and audit material vulnerabilities before submission.
- Keep secrets in local environment files excluded from Git; provide `.env.example` with names only.
- Client bundles contain only the browser-safe Supabase project URL and publishable key. Database URLs and any future Supabase secret/service-role key are server-only and must never use a `NEXT_PUBLIC_` prefix.
- No Supabase secret/service-role key is required by PF Health; introducing one requires a separate security review.
- Optional AI functionality must be disabled cleanly when no key exists.

## Logging and audit

Application logs may include request ID, route, status, duration, safe synthetic member ID, and error category. They must exclude full request bodies, authorization headers, cookies, prompts, generated drafts, documents, and credentials.

Domain audit events are user-visible product history, not security logs. Their metadata is allowlisted and immutable after append.

## Network and external systems

Deterministic evaluation requires no external source. Authentication and persistence contact only the configured Supabase project. No adapter may contact EPFO or a government domain. Research links are rendered for humans only; the application does not crawl or automate them.

Developer agents need write access only within `pf-health`. Package registry access is permitted only from the build or application container when dependencies are intentionally installed. They do not need personal accounts, cloud admin, EPFO credentials, unrestricted production access, or access to unrelated host services.

## Security verification

- `npm run verify:submission` secret-pattern scan and prohibited-data fixture review
- `npm run verify:supabase-security` anonymous read/write isolation probe
- Database inspection proving both persistent tables have owner policies for all four operations
- Two-user tests proving cross-owner IDs return no data
- Input validation and malformed payload tests
- Stale version, token replay, wrong-record, and unsupported-action tests
- XSS-safe rendering tests for generated/plain text
- AI-disabled and AI-failure paths
- Dependency audit with findings triaged, not blindly auto-fixed
- Manual inspection of browser network calls during the demo
- Compose configuration review for forbidden mounts, privileges, namespaces, capabilities, and non-localhost port bindings
- Verification that install, lint, typecheck, tests, builds, seed/reset, and application execution occur inside containers

The automated scan is a release guard, not a substitute for human review or a dedicated secret scanner. It reports only finding category and file path so a discovered value is not copied into logs.

## Incident response for the prototype

If real personal data or credentials enter the repository: stop work, do not reproduce the value in logs/chat, revoke exposed credentials if relevant, remove the data from working files and history using an approved recovery process, and document the incident without copying the secret.
