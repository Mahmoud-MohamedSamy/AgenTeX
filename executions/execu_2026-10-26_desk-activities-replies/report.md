# Run report — Desk Activity Life Cycle + Ticket Replies (26 Oct 2026)

Host `https://staging-desk.taviportal.com` (NDC-Staging). Runner: agent `fedelav803@meinvr.com` (Desk Agent, Customer Support); cross-department checks as admin `mahmoud.mmohamedsamy@gmail.com` (HR / Marketing / Sales). Owner account not used. Zoho reference: help docs + live Desk portal `taviportal` (read-only).
**Staging was redeployed during the run** (bundle `index-PA6o3K2s.js` → `index-7qe5X0Gd.js`, between 12:50 and 13:30 local). Every bug below was reproduced on the new build by the automation, except where marked.

Specs: `docs/desk-activity-lifecycle/spec-desk-activity-lifecycle.md`, `docs/desk-ticket-replies/spec-desk-ticket-replies.md`. Missing lists: same folders. Scripts: `scripts/` (a*.js activities, r*.js replies, x1.js cross-department, c*.js cleanup). Raw screenshots: `evidence/raw/`.

## Totals
| Feature | Pass | Bug (fail) | Possible bug | Gap | Info | Not run / blocked |
|---|---|---|---|---|---|---|
| Activity Life Cycle | 47 | 7 | 1 | 5 | 3 | groups B13–B21, F5–F9, H3–H10 (part), I3–I8, J1–J8 (part), K, L2–L4, M3–M6, N, O1–O2, O4–O5, E2E |
| Ticket Replies | 45 | 1 | 4 | 5 | 3 | C2/G2 inbox, C8, C12, C13, E5–E7, F4, H2–H4, I4, I6–I8, K3–K4, L2–L5, N, O, E2E |

## Bugs
| ID | Case | Bug | Severity (proposed) | Build seen |
|---|---|---|---|---|
| A-B1 (NDC-2637) | ACT-E6 | Reschedule with "The call went unanswered — log a missed call" fails: "One or more fields in the payload are read-only." (the missed-call POST sends `approval_status`); call not moved, nothing logged | High | old + new |
| A-B2 (NDC-2638) | ACT-C1, B4 | A task saved without a status (the add form has no default) has no status and never appears in Open / My Open / Overdue views | High | old + new |
| A-B3 (NDC-2639) | ACT-D10 | Raw keys shown: priority "highest", call status "scheduled" / "missed", direction "outbound" (detail page, list, ticket tab) | Low | old + new |
| A-B4 (NDC-2640) | ACT-E8 | Completed call read-only in the UI but PATCH through the API changes it | Medium | old + new |
| A-B5 (NDC-2641) | ACT-D8, M2 | Completed Time is set by the browser: completing through the API leaves it empty, and PATCH can set any date | Medium | old + new |
| A-B6 (NDC-2642) | ACT-C8 | Call duration accepts any text ("abc", "-1", "99:99") | Low | old + new |
| A-B7 (NDC-2643) | ACT-O3 | Add-activity form fields (subject, ticket, owner, status pickers) and reminder radios have no accessible names | Low | old |
| A-B8 (possible) | ACT-A3 | Admin outside Customer Support can read and edit the activities of a CS ticket that is 404 for them | Medium | old + new |
| ~~R-B1~~ | RPL-B3 | Reply All did not show the ticket copied addresses — **fixed by the redeploy** (new build shows "Also copied on this ticket" + "Leave … off this reply"); test is now a regression check | — | old only |
| R-B2 (NDC-2644) | RPL-E1 | "Save draft" stores the draft only in the browser (localStorage `desk.composer.draft:<user>:<ticket>`); `drafts/mine` stays 404 | Medium | old + new |
| R-B3 (possible) | RPL-K5 | The author of a reply sent for review can approve it themselves (it is sent) | Medium | old + new |
| R-B4 (possible) | RPL-C11 | Two identical reply POSTs at the same moment send two emails | Low | new |
| R-B5 (possible) | RPL-C9b | Agent address accepted as Cc after the redeploy (refused at 12:50 with "That address belongs to an agent…"; NDC-1851 item 7 excludes agents) | Low | new |

## Regression checks (earlier tickets, all Done) — still fixed
NDC-1907 (ACT-H1), NDC-1803 (ACT-I2), NDC-1813 (ACT-E10), NDC-1332 (ACT-G4: pop-up 5 s after due), NDC-1906 (RPL-B9 + empty bodies refused), NDC-1838 (RPL-C7), NDC-2182 (RPL-L1), NDC-1888 not re-run (needs a second agent).

## Main passes (short)
- Activities: picklists, required fields, dates and subject (max 255) validated; status walk; Mark as Complete / Reopen Task (→ Not Started); Start / End Call with notes to the ticket as a private comment; missed, cancel, reopen; events complete / cancel / reopen and stay open after their time; 18 task views with correct membership; search; reminders (5 max, every bad value refused with a clear message, closed activity skipped); comments edit / delete; bulk Update dialog; delete by API.
- Replies: From / To / quote defaults; validation messages; HTML cleaning; Forward private; Bcc stored; Send and Close; "Send as private" refused for the customer with a clear message; comments private by default / public / edit / pin / delete; snippets rules and placeholders; templates; rating link placeholder; attachments; pin, headers, split rules; review submit / withdraw; department isolation (404).

## Info
- New build: composer has a Suggested articles panel ("The suggestions could not be loaded." — possible bug R-B6, not filed).
- ACT-H6: a ticket can be closed while it has open tasks (Zoho web does not block either).
- RPL-I2: the reply did not change the ticket status; the API-created ticket already had an owner.
- RPL-C3: a CC added in a reply is not added to the ticket's copied addresses.
- Mail platform: last 7 days 40 sent, 0 delivered (delivery events not coming back) — see gap Z6.
- Desk Agent cannot delete tickets (403) — expected for the profile; it blocks our own cleanup.

## Automation
Features `deskactivities` (ActivityApiTest 13 tests, ActivityUiTest 4) and `deskticketreplies` (ReplyApiTest 12, ReplyUiTest 4); suites `desk-activities-replies-api.xml` / `-ui.xml`. Last runs: API — all bug tests fail as expected, regression tests pass; UI — 4 pass, 4 bug tests fail (A-B1, A-B3, R-B1, R-B2). One JVM crash (machine out of memory) during the first API run; the unfinished tests were rerun.

## Not done / needs the user
- Inbox checks for mmohamed@anyware.software (reply delivery, rating link, placeholders, event invitation).
- QA tickets: 15 "QA ACT …" / "QA RPL …" tickets remain (agent cannot delete them). All 66 QA activities deleted (in the Recycle Bin).
- Tenant: no settings changed. Snippets created by QA were deleted.

## Plane (filed 26 Oct 2026 — assignees Mahmoud + Hegazy, module Desk, Sprint 13)
- Gap lists: NDC-2635 (Activity Life Cycle, Backlog) · NDC-2636 (Ticket Replies, Backlog)
- Bugs (state Bug, annotated TAVI-vs-Zoho image attached to each): A-B1 = NDC-2637 · A-B2 = NDC-2638 · A-B3 = NDC-2639 · A-B4 = NDC-2640 · A-B5 = NDC-2641 · A-B6 = NDC-2642 · A-B7 = NDC-2643 · R-B2 = NDC-2644
- Not filed: possible bugs A-B8, R-B3, R-B4, R-B5, R-B6 (listed in the gap tickets' notes); R-B1 fixed by the redeploy.
- Comments: NDC-1851 (PRD) and NDC-1865 (checklist) link the new items.
- Evidence: evidence/annotated/*-vs-zoho.png (scripts/make-evidence.js, spec-*.json, card-*.json).
