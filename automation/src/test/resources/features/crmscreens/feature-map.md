# crmscreens — CRM go-live screen checks (Round 2 Phase 3)

> The memory of this feature. Read it before testing; update it after every run.
> App: TAVI CRM staging-crm.taviportal.com (build index-De3hTVb3.js) · Reference: Zoho CRM org943261092 (read-only) · Created 2026-10-28
> Hand results + JS snippets: `executions/execu_2026-10-27_crm-golive-round2/screens/` (results.md, scripts/, after/*.json)

## Scope
G05 Arabic / RTL · G06 shortcuts · G09 performance · S07 flights / bookings · R16 attachments · R23 mass delete · S01 work queue.

## How to run (from automation/)
`./mvnw test -Dsuite=crm-screens-r2 -Dbase.url=https://staging-crm.taviportal.com -Dcredentials.host=staging-crm.taviportal.com "-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv" -Dcredentials.account=valafo4080@94an.com -Dcrm.apiUser=mahmoud.mahamed1515@gmail.com -Dcrm.noOwner=true -Dauth.memoryOnly=true -Dheadless=true`

- API as CRM Admin B (`-Dcrm.apiUser`), screens as test user 2 (`-Dcredentials.account`), never the owner (`-Dcrm.noOwner`).
- `-Dauth.memoryOnly=true` (new in AuthManager): the browser session stays in the JVM, nothing is written to `.auth/`.
- One JVM = one sign-in per account. Stop on HTTP 429 (CrmUser stops by itself).

## API facts (28 Oct 2026)
- Upload: `POST /files {app_key:crm, purpose:attachment, ownership_class:tenant_file, original_filename, declared_content_type, declared_size_bytes}` → `{file_id, upload_url}` (presigned, same host under /s3/…) → PUT bytes (no token) → `POST /files/{id}/confirm {file_id, size_bytes}`.
- Attach: `POST /modules/{m}/records/{r}/attachments {file_id, file_name, content_type, size}`; list GET same path (`data` array); `DELETE …/attachments/{id}` 204 (file itself is kept; still downloadable). Download link: `POST /files/{id}/download {file_id, vouching_app_key:crm[, variant:web]}` → `data.download_url`.
- Limits: 16 MB (16777216) for purpose attachment (422 UNPROCESSABLE above); 0 / negative 400. Types: images, audio, video, PDF, Word, Excel, CSV, PowerPoint (400 ATTACHMENT_TYPE_REJECTED otherwise); .exe refused at POST /files. The screen's own filter also lets .txt / .log through, so those upload and are then refused.
- Notes: `POST …/notes {body, body_html?, attachments:[{file_id, file_name, content_type, size}]}` → 201 `{recorded:true}`; empty → 400 NOTE_EMPTY.
- Mass delete: `DELETE /modules/{m}/records/bulk?ids=a,b` (list Delete Selected, 204 even for unknown ids) · `POST /modules/{m}/records/mass-delete {record_ids}` or `{criteria:[{field, operator, value}]}` → `{matched, deleted, failed, skipped_already_deleted, deletion_group_id, errors}`; >500 → 422 TOO_MANY_RECORDS; criteria mode over 500 = background job (`/mass-delete-jobs/{id}`, `/active`), cap 50,000.
- Work queue: `GET /workqueue/summary?sections=activities,queues,jobs` (pass as query param), `/workqueue/queues`, `/workqueue/team`. Queue filters persist server side.
- Language: per user, `PUT /settings/value {app_key:general, key:general.user.locale.language, scope_type:User, value_json:"\"ar\"", expected_version}` (Settings › Personal › Locale). The header EN/AR switch only changes `localStorage.anyware_language` (not saved to the account).
- Flights / bookings: no route (`/api/v1/v2/*` 404, `/api/v2/*` "No gateway route is configured"); UI `/v2/flights/search`, `/v2/bookings` redirect to Home. They exist only as demo custom actions ("SkyRoutes Travel") in the mocks bundle.

## Shortcuts (the app's full list, from the "?" help)
Ctrl+K command menu (toggle; GO TO / CREATE / MODULES / RECORDS / NOTES / ATTACHMENTS search, ↑↓ ↵ esc) · Ctrl+\ sidebar · ? help. Local ones: Ctrl+Z / Ctrl+Shift+Z in the blueprint designer and home edit mode, Ctrl+Enter in an entry note, arrow keys scroll a records table. Zoho (28 Oct, live): no global shortcut help found ("?" / Ctrl+K do nothing).

## Traps
- Leads module has 564 fields and 13 layouts on staging: `/modules/{leads}/fields` 3–55 s and `/layouts` 5–40 s, so the Leads list / create form / record page are slow; measure with 60 s timeouts.
- Admin B has no kanban view on Transactions: the Kanban button opens "New Kanban view" (kanban timing needs a saved kanban view).
- The lane's network uploads at ~11–23 KB/s: only small files; size limits are checked with the declared size.
