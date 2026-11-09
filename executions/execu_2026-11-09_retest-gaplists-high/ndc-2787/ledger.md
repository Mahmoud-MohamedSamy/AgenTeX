# NDC-2787 retest ledger (Lane A, 9 Nov 2026)

## Setup
- 9 Nov ~15:45: signed in ndc-staging-owner (creds index 7) ONCE → scratchpad laneA-ndc.json. Read-only checks only (API GET + UI views). One AI POST each for Summarize/Suggest triage (no data change; both 404).
- No writes to TAVI data. No Plane writes.

## Findings (API/UI, 9 Nov)
- Settings nav (a1): Channels = Email, Web Forms, Help Center, Community; Self Service = Help widgets. No Chat / IM / Phone / Social channel; no Gamescope, Marketplace, Attachments control, Data Subject Requests, remote support.
- Collaboration Tools (a2): Slack, Google Drive, Microsoft Teams, Google Chat. No Zoho Cliq.
- Data Retention (a2): auto-delete closed tickets / activities / contacts + legal holds. No anonymise / data subject request.
- Round Robin (a3): rules with Load Based, Skill Based, Sequential, Team Members targets. Ticket Access has an "Agent availability" tab (a11).
- Users (a3–a5): GET /iam/users returns exactly 200 rows (121 active + 79 invited) for page=2, pageSize=500, offset, cursor, search — paging params ignored. Desk Agents page lists 12 desk agents, paged client-side (Page 1 of 2).
- AI (a7/a8): ticket AI assist → Summarize ticket: POST /desk/tickets/{id}/ai/summary 404, "Something went wrong"; Suggest triage: POST …/ai/triage 404. Workflow Actions list has no AI action.
- Analytics (a8/a9): Desk → Analytics → Dashboards (Ticket Status, SLA, Overview, Customer Happiness built-in; Add Dashboard), Reports (My/Starred/Scheduled/Global/Static, Add Report), Advanced Analytics. /reporting/* APIs 200.
- Blueprint defects NDC-2754..2758, 2761..2764, 2774, 2775: all Done in Plane.
- Layout rules: NDC-2230, NDC-2231 Done; NDC-2535 (gap list) Backlog.
- /chat and /social pages (a12): "In Development" placeholders. /desk/tab-settings arrangement null.
- Ticket Access → Agent availability (a12): "Mark idle agents offline", idle after 1–120 min.
- Help Center → Languages (a13): English default + Arabic RTL; "Add a language", "Agents translate", "Machine translation" = Coming soon.
- Assignment criteria fields (a16/a17): 171 fields; is_overdue, sla_escalated present; no response-overdue boolean, no layout.
- Evidence built: evidence/annotated/01..06 (make-evidence-desk.js, configs evidence/c1..c6.json via scripts/mkcfg.js). Zoho panels reference NDC Zoho captures in execu_2026-11-01_desk-golive/ndc-zoho (git-ignored originals; the chosen pages show no staff names).

## Result
3 Built (M-06, M-07, M-09), 2 Partly (M-08, M-12), 10 Still missing (M-01, M-02, M-04, M-05, M-10, M-11, M-13, M-14, M-15, M-16). results.md, plane-draft.html.

## Cleanup
Nothing created in TAVI → nothing to delete. No Plane writes. Session file laneA-ndc.json kept in scratchpad.

## 9 Nov (main session)
- Posted NDC-2787 comment 06c4bb8b-d7f9-43af-905b-c3f69dea3492 + 6 images (01..06; 1st upload try timed out, retried, no duplicates).
- M-05 recheck (ndc-staging-owner, own sign-in main-ndc.json, GET only): 200 rows (121 active + 79 Invited), pageSize/page/status filters ignored, meta null; /iam/users/search|count|summary 405; dept agents all in list; 2 audit actors outside list are system ids. Draft m05-draft.html/json, NOT posted.
- POSTED NDC-2828 b5a6aece-b943-430c-88c6-d85e78b1946c (M-05 bug): Bug, High, 4 assignees, labels Teams & Agents + API & Platform, Desk, Sprint 15, relates NDC-2787, image 03 attached.
