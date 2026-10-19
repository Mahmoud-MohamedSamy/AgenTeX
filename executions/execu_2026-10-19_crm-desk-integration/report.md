# CRM ⇄ Desk Integration — Run 1 (read-only), 19 Oct 2026

- **Spec:** `docs/crm-desk-integration/spec-crm-desk-integration.md` · **Gaps:** `docs/crm-desk-integration/crm-desk-integration-missing-list.md` (Z1–Z9) · **PRD:** NDC-1669
- **Apps:** staging-crm / staging-desk.taviportal.com, Edge (headless), owner account + Desk agent `fedelav803` (no integration permission)
- **Automation:** `automation/` feature `crmdeskintegration` — `ReadApiTest` (API, 21 cases) and `ReadUiTest` (screens, 16 cases)
- **Scope:** read-only, as the user decided. Nothing was saved, connected, paused or created. Editors were closed, dialogs cancelled, pickers closed with Escape. The only POST was `/tickets/classify`, which only calculates Handshake buckets.
- **Plane:** nothing filed (user: not unless told).

## Summary

| | Cases | Pass | Fail | Not run yet |
|---|---|---|---|---|
| API (`ReadApiTest`) | 21 | 17 | 4 | 0 |
| Screens (`ReadUiTest`) | 16 | 9 | 4 | 3 (rate limit, see below) |
| **Total** | **37** | **26** | **8** | **3** |

Gap checks (pass = still missing): Z1, Z2, Z3, Z5, Z6, Z7 confirmed still missing. Z4 and Z9 are confirmed by failing behaviour rows below.

## Failed — app findings

| # | Case | What is wrong | Expected (Zoho / NDC-1669) | Kind |
|---|---|---|---|---|
| 1 | I16 | The Desk contact list shows the raw values `synced` (6×) and `needs_attention` (14×) under contact names | Labels "Synced" / "Needs attention" (the app's own strings have them) | Possible bug |
| 2 | H10 (API + screen) | Both Failure Log reasons show raw record ids: "The CRM contacts record `<id>` with the same email is already paired with Desk record `<id>`." | Human-readable reason naming the record (§10) | Possible bug |
| 3 | H3 | Sync History rows have only added / updated counts — no failed count, while the Failure Log has 2 entries | Date, direction, record type, added, updated, **failed** (§10) | Possible bug / partial requirement |
| 4 | O3 | `GET /customers/contact/<random id>/stats` answers 200 with zero counts for a contact that does not exist (other endpoints answer 404) | 404 for a record that does not exist | Possible bug (low) |
| 5 | E1 / Z4 | CRM-side delete options are "Keep and flag", "Keep but unlink", "Delete". No "Delete … if there are no associates". Desk side (Never / Delete) matches | Zoho: Always delete · Delete if no associates · Never delete | Gap 4 (confirmed) |
| 6 | J1a / Z9 | `panel.profile_access` is empty → every Desk profile (agents, light agents, reviewers) has Full Access to CRM data | Zoho: only the Administrator profile until the admin ticks others | Gap 9 (confirmed) |
| 7 | J1 / Z9 | The middle access level is called "Custom Access" in the app's strings | Zoho: "Restricted Access" (user decision: match Zoho) | Gap 9 (confirmed) |

Evidence: `automation/target/evidence/<case>/app.png` (TAVI). The side-by-side TAVI-vs-Zoho images were not generated in this run (the reference path was wrong — fixed, they will be produced on the next run); the gap images `docs/crm-desk-integration/evidence/04…` and `09…` already show items 5–7.

## Passed

- **A1** Desk page: subtitle, 5 tabs (no Notifications). CRM page: subtitle, 6 tabs. **M1** CRM Notifications: all 7 signals + "Notify the CRM contact owner".
- **A3** The agent gets 403 on config, runs, history, failures, links, needs-attention (status is readable — needed by the pane).
- **A7** CRM and Desk read the same settings object (same row_version).
- **A10** No token / garbage token → 401 in both apps, no data.
- **B1** Status consistent: connected, not paused, connected_at set, queue {0, 0, 0, parked 2}.
- **C1 / C2** Sync table matches the config (Contacts / Accounts Two-way, Contracts On, Calls Off); Contacts Edit shows "8 of 12 fields mapped" (closed without saving).
- **C3 / C4** Every saved mapping exists on both sides, no read-only targets, no duplicates, matching data types.
- **E10** Related Lists offer every CRM module (Contacts, Accounts, Deals, Leads, Subscriptions "No ticket link").
- **H1** Sync History: 7-day window, known directions and modules (API + screen).
- **I2** Pane Info fields = `panel.info_fields.contacts` with CRM values; **I7** (API) an unlinked contact gets 404 "not mapped to a CRM record".
- **I17** Links complete: 34 contacts, 4 accounts, 4 contracts; each with both ids and a status.
- **K1** Layout picker offers Handshake Mode. **K2 / K7 / K8** 39 tickets classified (33 New, 6 Contacts/Leads), consistent with links.
- **L1 / L2 / L3** CRM contact "Desk Tickets" card: columns, both tickets, statistics match the list (2 / 1 open / 1 closed), filters All / Open / On hold / Closed.
- **M5** Mentionable users: 10 agents + 6 CRM users.
- **O4** No tokens or secrets in status / settings.

## Not run yet — rate limit

- **B1/B2 (screen), I1/I2 (screen), I7 (screen)** were re-run after fixing a test timing defect (they had read the page while it still showed "Loading…"). The re-run was stopped by **HTTP 429 on the owner's API sign-in** — caused by the many one-off probe sign-ins earlier today. Per the rules, nothing was retried.
- Fix applied: screen tests now read the API with the browser's own session (no extra sign-ins). To run after the limit clears:
  `./mvnw test -Dtest=ReadUiTest -Dheadless=true "-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv" -Dcredentials.host=staging-crm.taviportal.com -Dcredentials.account=ndc-staging-owner@taviportal.com`
- The failure screenshots of the first attempt show the Overview, the pane on ticket #298 ("Synced", tabs Info / Potentials / Notes / Activities) and the "Not linked to a CRM record" state on ticket #296 all present — expected to pass.

## Inconclusive in a read-only run (need Run 2 / Run 3)

- **K3 / K5 / K6** Customers / Potentials columns: no linked requester has a CRM deal.
- **J4–J10** permission enforcement: needs a profile set to Custom / No access (a settings change).
- **B3–B14** pause, resume, disconnect, connect, first-sync progress, 12-month lookback.
- **G, D, E2–E9, F, H6–H8, H11–H13, I8–I11, I15, L5–L13, M2–M4, M6–M9**: all change data.

## Observations

- Teammates are using the integration today: settings row_version moved from 35570115 (18 Oct baseline) to 37041419; new tickets "Mail => Ticket => Contact => Sync". Refresh the baseline before any write run.
- 32 of 42 links are "needs attention" (most contact links). Not judged — likely the keep-and-flag delete preference after teammates deleted CRM contacts; check in Run 2.
- `GET /links` is paged at 25 by default (not a bug; the automation pages through it).

## Automation notes

- Healed: `DeskRecordPage.layoutPicker` — `ariaLabel=Layout` did not match; the "…View / …Mode" button xpath was promoted (correct, kept).
- Test defects fixed during the run: wrong substring length (2), unpaged links list, page read before "Loading…" ended, wrong Zoho reference folder, missing default credentials file (now passed on the command line).
