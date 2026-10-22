# CRM ⇄ Desk Integration — feature map

Apps: TAVI CRM `https://staging-crm.taviportal.com` and TAVI Desk `https://staging-desk.taviportal.com` (tenant NDC-Staging `a7a7a7a7-0000-0000-0000-000000000004`), verified 19 Oct 2026.
Spec: `docs/crm-desk-integration/spec-crm-desk-integration.md` (+ `.html`) · gaps: `docs/crm-desk-integration/crm-desk-integration-missing-list.md` (Z1–Z9) · PRD NDC-1669.
Reference: live Zoho Desk `taviportal` + Zoho CRM org943261092 (integrated 18 Oct 2026); reference shots in `zoho/`.

## How it is tested
- **API rows** (`ReadApiTest`): no browser. `AppUser.as(email)` signs in once through `POST /api/v1/iam/auth/login` on the CRM host
  (header `x-tenant-id`), then `.crm()` / `.desk()` call either host with `x-app-key crm|desk` and the same token. 429 → stop.
- **Screen rows** (`ReadUiTest`): BaseTest + owner session from `.auth/` on the Desk host. CRM pages reuse the same session:
  the token cookies sit on `.taviportal.com`; `CrmSession.ensure` copies `aw_auth_tenant_id` to the CRM origin.
- Credentials: owner from `docs/Credentials/Microsoft Edge Passwords.csv` (no header row); the agent from
  `automation/.auth/extra-credentials.csv` (gitignored; header `name,url,username,password`).

Run: `./mvnw test -Dfeature=crmdeskintegration -Dtags=crmdesk-read` (Run 1, read-only) · API only `-Dtest=ReadApiTest` · screens `-Dtest=ReadUiTest -Dheadless=true` · gap checks `-Dtags=gap-check`.

## Accounts
| Account | Use |
|---|---|
| ndc-staging-owner@taviportal.com | owner, integrated user; shared with teammates |
| fedelav803@meinvr.com | Desk agent "Customer Experience Specialists 2", no `desk:integration:*` (user, 19 Oct 2026) |

## Where it lives
| What | Value |
|---|---|
| CRM settings | `/settings/integrations/desk` — tabs Overview, Configuration Details, Permissions, Notifications, Sync History, Failure Log |
| Desk settings | `/settings/integrations/crm` — same without Notifications |
| Desk ticket | `/views/all/tickets/{id}` — CRM pane "CRM Contact Info" (tabs Info / Potentials / Notes / Activities) |
| Desk contact | `/modules/43004ce2-…/customers/{id}` |
| CRM contact | `/modules/6f553963-…/records/{id}` — "Desk Tickets" card |
| Ticket list Layout picker | Classic / Compact / Table View + work modes Status / Countdown / Priority / **Handshake Mode** (per-user preference — don't switch it on the shared owner) |

## API (all under `/api/v1/desk/integrations/crm`, both hosts)
- `status` (agents can read it), `config` (row_version), `history?days=&tz=` rows {date, direction, module, added, updated} — **no failed count**.
- `failures` {queue_id, kind, module_key, record_id, attempts, last_error, error_code}.
- `links` is **paged, 25 by default** — use `page_size=200&page=N` or `kind=contact|account|contract`.
- `schema/crm/{contacts|accounts}` and `schema/desk/{desk_contacts|desk_accounts}` (Desk side keys carry the `desk_` prefix; plain `contacts` → 400).
- `context/{contact|account}/{deskId}/info|potentials|activities|notes-target|candidates?q=` — singular kind; unlinked → 404 `CRM_LINK_NOT_FOUND`.
- `tickets/classify` POST `{ticket_ids:[…]}` → `[{ticket_id, bucket, deal_id, deal_name}]` (read-only computation).
- `tickets/for-record?module_key=&record_id=`, `stats?module_key=&record_id=`, `customers/{kind}/{id}/stats?months=`.
- `mentionable-users` kinds `agent`, `crm_user`.
- Desk tickets: `GET /modules/88e8ea44-…/records?page=N&per_page=100` (no `/desk/tickets` list; `/desk/tickets/{id}` works).
- 404 (gaps): `/products`, `/list-views`, `/invite`, `/light-agents`, `/audit`, `/logs`, `/handshake`.

## Traps
- Teammates use the integration live (19 Oct: "Mail => Ticket => Contact => Sync" tickets, row_version moved 35570115 → 37041419). Never write in Run 1.
- No linked contact has a CRM deal (19 Oct) → Handshake Customers / Potentials need data from a write run.
- Git Bash mangles `/desk/...` args for node → `MSYS_NO_PATHCONV=1`.

## Test inventory
| Case | Test | Groups | Last result |
|---|---|---|---|
| A3 | ReadApiTest.agentCannotReadIntegrationAdminData | crmdesk-read | PASSED 19 Oct 2026 |
| A10 | ReadApiTest.noOrBadTokenIs401 | crmdesk-read | PASSED 19 Oct 2026 |
| A7 | ReadApiTest.bothAppsShareOneSettingsObject | crmdesk-read | PASSED 19 Oct 2026 |
| B1 | ReadApiTest.statusIsConsistent | crmdesk-read | PASSED 19 Oct 2026 |
| C3 | ReadApiTest.mappingsMatchSchemas | crmdesk-read | PASSED 19 Oct 2026 |
| C4 | ReadApiTest.mappedPairsHaveCompatibleTypes | crmdesk-read | PASSED 19 Oct 2026 |
| E10 | ReadApiTest.relatedListsFollowCrmModules | crmdesk-read | PASSED 19 Oct 2026 |
| H1 | ReadApiTest.historyShape | crmdesk-read | PASSED 19 Oct 2026 |
| H3 | ReadApiTest.historyHasFailedCounts | crmdesk-read | FAILED 19 Oct 2026 (no failed count) |
| H10 | ReadApiTest.failureReasonsAreReadable | crmdesk-read | FAILED 19 Oct 2026 (raw ids) |
| I2 | ReadApiTest.paneInfoFieldsFollowConfig | crmdesk-read | PASSED 19 Oct 2026 |
| I7 | ReadApiTest.unlinkedContactAnswer | crmdesk-read | PASSED 19 Oct 2026 |
| I17 | ReadApiTest.linksAreComplete | crmdesk-read | PASSED 19 Oct 2026 |
| K2 K7 K8 | ReadApiTest.handshakeBucketsMatchRequesters | crmdesk-read | PASSED 19 Oct 2026 |
| L1 L2 | ReadApiTest.crmCardMatchesDeskTickets | crmdesk-read | PASSED 19 Oct 2026 |
| M5 | ReadApiTest.mentionableUsers | crmdesk-read | PASSED 19 Oct 2026 |
| O3 | ReadApiTest.randomIdsAre404 | crmdesk-read | FAILED 19 Oct 2026 (stats for a missing contact = 200) |
| O4 | ReadApiTest.noSecretsInSettings | crmdesk-read | PASSED 19 Oct 2026 |
| J1a | ReadApiTest.defaultAccessIsAdminOnly | crmdesk-read, Z9 | FAILED 19 Oct 2026 (all profiles Full Access) |
| Z1 Z2 Z7 | ReadApiTest.gapRoutesStillMissing | gap-check | PASSED (still missing) |
| Z3 Z5 | ReadApiTest.configGapsStillMissing | gap-check | PASSED (still missing) |
| UI rows | ReadUiTest.* | crmdesk-ui | see Run history |

## Run history
| Date | Scope | Passed | Failed | Healed | Notes |
|---|---|---|---|---|---|
| 19 Oct 2026 | Run 1 API (ReadApiTest) | 16 | 5 | 0 | 1 of the 5 was a test defect (fixed) → final 17 / 4 |
| 19 Oct 2026 | Run 1 screens (ReadUiTest) | 9 | 4 real + 3 test defects | 1 (layoutPicker) | re-run of the 3 stopped by HTTP 429 on the owner's API sign-in; screens now use the browser token (IntegrationApi.browser()) |

## Traps (added 19 Oct)
- **HTTP 429 on API sign-in** after many sign-ins in one day (probe scripts sign in per call). Screen tests must use `IntegrationApi.browser()`; API tests sign in once per JVM.
- The default `credentials.file` (`TAVI Staging Desk Credentials.csv`) no longer exists — pass `-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv -Dcredentials.host=staging-crm.taviportal.com -Dcredentials.account=ndc-staging-owner@taviportal.com`.
- Settings tabs and the CRM pane load after the switch ("Loading…"): page objects wait until it disappears before reading.
- `@ZohoRef` paths are relative to the feature folder: `zoho/<file>.png`.
- The access-level names show on screen only when a profile is restricted; Z9 reads them from `/locales/en/crm-desk-integration.json`.

## Write runs (20 Oct 2026, user-approved)
- Classes: `WriteBase` (helpers, facts → target/crmdesk-write-facts.txt), `WriteRunTest` (Run 2), `ConnectionRunTest` (Run 3, screen), `RecheckTest`, `K10CheckTest`, `ProbeTest` (GET-only explorer: lines in target/probe-in.txt, one sign-in).
- Run: `./mvnw test -Dtest=WriteRunTest` (API only) · Run 3 needs `-Dheadless=true` + the credentials flags above.
- Ids: CRM accounts `b2398920-…`, deals `f42cbafd-…`; Desk accounts `784400e1-…`, contracts `0924eb24-…`. Layouts: CRM contact Standard `92269f8a-…`, CRM account `d817ff75-…` (account_name required), Desk contact `bcac166e-…` (last_name required), Desk account `3e687db9-…`, Desk ticket `1b55c25d-…` (subject, status required). Desk Agent profile `44444444-…-402`.
- API shapes: `profile_access` = `[{profile_id, enabled, contacts:{enabled, info, potentials, notes, activities:[calls,meetings,tasks]}, accounts:{…}}]`; links POST `{kind, crm_record_id, desk_record_id}`; ticket deal PUT `{deal_id}`; pause `{reason}`; CRM new ticket `POST /tickets/prefill|/tickets` with `crm_module_key` + `crm_record_id`; `/customers/{kind}/{id}/stats` wants the DESK id (CRM card uses `/stats?module_key=&record_id=`).
- Sync is fast (~5 s). Settings PUT validates direction/enums but NOT unknown fields (CD-04) and accepts a missing row_version (CD-05).

| Date | Scope | Passed | Failed | Notes |
|---|---|---|---|---|
| 20 Oct 2026 | Run 1 re-run of B1/B2, I1/I2, I7 | 3 | 0 | after the 429 cleared |
| 20 Oct 2026 | Run 2 writes (WriteRunTest + RecheckTest) | 23 | 4 | + M2 inconclusive; E3/L5 first failures were test defects (fixed) |
| 20 Oct 2026 | Run 3 connection (ConnectionRunTest + K10CheckTest) | 1 | 4 | disconnect + reconnect done; connected_at now 2026-10-20 15:32:54 UTC |

Traps (20 Oct): the Maven shell can be reaped on low memory but the surefire JVM keeps running and still cleans up — wait for the PID to exit, don't kill it mid-run. `@AfterClass` of a BaseTest class runs after the browser closed: use the API user (not `IntegrationApi.browser()`) there.
