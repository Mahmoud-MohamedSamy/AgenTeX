# NDC-2787 retest — 9 Nov 2026 (Lane A)

TAVI Desk staging, NDC-Staging tenant (ndc-staging-owner), read-only. Zoho side = NDC's own Zoho Desk captures from 2 Nov 2026 (no new NDC Zoho visit).

**Summary: 3 Built, 2 Partly built, 10 Still missing (of 15 items M-01, M-02, M-04 … M-16).**

| Item | What NDC needs | TAVI now (9 Nov) | Verdict | Evidence |
|---|---|---|---|---|
| M-01 Live chat | Chat channel (33 % of tickets) | Setup Channels = Email, Web Forms, Help Center, Community. /chat page says "In Development" | Still missing | 01 |
| M-02 WhatsApp / web IM | WhatsApp + FlyWT widget | No IM channel; /social "In Development"; workflow actions Reply/Notify via IM exist without a channel | Still missing | 01 |
| M-04 AI on tickets | Zia summary, sentiment, writing, workflow AI, field prediction | NEW AI assist panel (Summary, Triage suggestion) but POST …/ai/summary and …/ai/triage → 404 "Something went wrong"; no AI workflow action | Still missing | 02 |
| M-05 Agent scale | 478 active agents in pickers | GET /iam/users always returns the same 200 rows (121 active + 79 invited); page, pageSize, offset, cursor, search ignored; meta null | Still missing (bug still not filed) | 03 |
| M-06 Dashboards / reports | Overview, Request, SLA, TOPUP dashboards; 4 custom reports | Desk → Analytics now opens: Dashboards (Overview, SLA, Ticket Status, Customer Happiness built-in, Add Dashboard), Reports (My / Starred / Scheduled / Global / Static, Add Report), Advanced Analytics. On 2 Nov both redirected to Headquarters | Built (NDC's custom TOPUP / live-chat dashboards not rebuilt) | raw/analytics-Dashboards.png, raw/analytics-Reports.png |
| M-07 Blueprint approval chains | 5 blueprints, 81 transitions | Built; all listed defects NDC-2754..2758, 2761..2764, 2774, 2775 are Done in Plane | Built | Plane |
| M-08 Round-robin variants | Load (agents/teams), sequential, skill, idle → offline, overdue/escalated targets | RR rules with Load Based, Sequential, Skill Based, Team Members targets; Ticket Access → Agent availability "Mark idle agents offline" (1–120 min) is NEW; criteria have Is Overdue + SLA Escalated, but no "Is Response Overdue" or Layout (M-19); NDC-2275 still Bug | Partly built | raw/rr.png, raw/p-avail.png |
| M-09 Layout rules + validation | 10 layout rules, 1 validation | NDC-2230, NDC-2231 Done; layout rules + "Reject needs a reason" worked on the 3 Nov mimic; NDC-2535 (gap list) still Backlog | Built | Plane, mimic report |
| M-10 Attachment limits | 40 MB / 40 files, file-type control | No admin setting (size, count or type) | Still missing | 04 |
| M-11 Extensions | Related tickets by custom field, attendance, geolocation… | No marketplace; customer history and calendar exist; the 3 add-ons not found | Still missing (unchanged) | 01 |
| M-12 Help Center translation, Arabic | Auto-translation, ar-EG | Help Center English + Arabic (RTL) can be switched on; "Agents translate", "Machine translation", "Add a language" all "Coming soon"; no ticket Translate | Partly built | 05 |
| M-13 Gamescope | 4 trophies | No Gamescope | Still missing | 01 |
| M-14 Remote support | Zoho Assist + Lens | None | Still missing | 06 |
| M-15 Zoho Cliq | Cliq notifications | Collaboration Tools: Slack, Google Drive, Teams, Google Chat; no Cliq | Still missing | 06 |
| M-16 Anonymised contacts | Data subject requests | NEW Data Retention (auto-delete + legal holds); no anonymise / request flow | Still missing | 04 |

## Child / related tickets (Plane, 9 Nov)

| Ticket | Item | State |
|---|---|---|
| NDC-2791 Mark as Required on one layout → every layout | A-6 | Done (moved 6 Nov; was Bug on 4 Nov) |
| NDC-2792 Workflow rule limit | M-18 | Done |
| NDC-2793 Trigger on create + field change | A-3 | Done |
| NDC-2794 Team + agent in one rule | A-2 | In Progress (was Bug on 4 Nov) |
| NDC-2795 Same rule name in two departments | A-1 | Done |
| NDC-2796 Several layouts per department | M-17 | In Progress (was Bug on 4 Nov) |
| NDC-2797 Statuses per department and layout | A-9 | Done |
| NDC-2798 Team notification on comment edit | M-21 | Done |
| M-19 RR criteria Is Overdue / Escalated / Response Overdue / Layout | M-19 | Never filed (left out on purpose); now Is Overdue + SLA Escalated exist, Response Overdue + Layout do not |
| M-20 | M-20 | Dropped 3 Nov (not a gap) |
| NDC-2760 14 missing Zoho features | — | Backlog |
| NDC-2823 Select-all in ticket list | — | In Progress (linked to 2787) |

## Not checked
- Upload size (200 MB accepted on 2 Nov) — not re-uploaded.
- Agent picker behaviour with >200 users — tenant has 200 user rows; would need 200+ more users.
- Email delivery, SLA escalation timing, notification delivery (still open from 4 Nov).
