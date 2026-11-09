# NDC setup rebuilt on TAVI Desk: what works, what is missing, what needs adjusting

**Date:** 3 Nov 2026 · **Where:** NDC-Staging (company "Wonder Travel"), every object prefixed "QA NDC " and kept as the NDC reference setup.
**Source:** NDC's live Zoho Desk, read-only (setup capture of 2 Nov plus layouts, SLAs and blueprint actions read on 3 Nov).
**Scope (user's choice):** NDC's core flows: 8 departments (Manual Invoice, NDC Finance, Financial approval, Accounting, Quality Assurance,
Client Complaints, Clients' Financial Investigations, FLY-WT Refund) and the 23 branch departments their workflows share tickets into.
**TAVI build:** staging bundle `index-CNgvbeK9.js` (deployed 3 Nov 2026); everything built through the TAVI API as the NDC-Staging owner.

This report covers the features TAVI already has (Built / Partly in the go-live inventory) and NDC actually uses. The channel and AI gaps
(live chat, WhatsApp, AI, reports — M-01 to M-16 in `ndc-zoho-vs-tavi-missing.md`, NDC-2787) are not repeated here.

---

## 1. What was rebuilt

| NDC object | NDC (core scope) | Built on TAVI | Result |
|---|---|---|---|
| Departments | 8 core + 23 share targets | 31 "QA NDC" departments with agents | Done |
| Teams | 32 | 32 | Done |
| Ticket statuses | 41 (Open / On Hold / Closed types) | 37 added + 4 existing, same types | Done |
| Custom ticket fields | 94 used by the core layouts | 94 (39 pick lists up to 188 values, decimal, currency, date, date-time, email) | Done |
| Layouts | 10 (2 departments use 2 each) | 8 assigned + 2 saved unassigned | **Partly** (see M-17) |
| Layout rules | 7 | 7 (show fields, show sections, require fields) | Done |
| Validation rules | 1 (Reject needs a reason) | 1 | Done |
| Blueprints | 6 (5 active), 81 transitions | 6, 81 transitions, owners / required fields / after actions | Done |
| Workflow rules | 80 (82 minus 2 with no TAVI action) | **42** | **Partly** (see M-18, A-1, A-2) |
| Assignment rules | 3 direct + 3 round robin (7 targets) | 7 | Done, criteria trimmed (M-19) |
| SLA policies | 9 in use | 9 with NDC targets and escalations | Done |
| Notification rules | 240 switches over 8 departments | 240 | Done (1 not available, M-21) |

## 2. Smoke test (3 Nov, 5 tickets "QA NDC smoke …", #890–#893 kept as samples)

| Check | Result |
|---|---|
| Layout rule: Transaction Type = Ancillary requires Ancillary Type | **Works** — save refused: "QA NDC Ancillary Type is required" |
| Validation rule: Status = Reject without a reason | **Works** — refused: "Please add a clear rejection reason"; accepted with a reason |
| Workflow share by branch (QA, Related Branch = GDS B2B, Feedback ≠ Pass) | **Works** — ticket shared read-only to QA NDC GDS TL on create |
| SLA on Manual Invoice | **Works** — "Manual invoice SLA": response due 1 h, resolution 1 day |
| Blueprint on Manual Invoice | **Works** — ticket enters "2nd check" at Open with NDC's states |
| Workflow "Close Ticket" (Manual Invoice) on create | **Does not fire** — TAVI cannot say "on create OR when these fields change" (A-3) |
| Same rule on edit (Transaction Type → Void, Need invoice = No) | Fired, but **status stayed Open**: the update was skipped with no error while the ticket is in a blueprint (A-5) |
| Per-layout required fields (Manual Invoice has 9) | **Not enforced** on an API-created ticket (A-6, confirm on screen) |
| Direct assignment + round robin on Manual Invoice | **Did not run** — the creator stayed owner, no team set (A-7, confirm on screen) |

## 3. Missing in TAVI (new, from the rebuild)

| # | What NDC uses | What TAVI does | Impact |
|---|---|---|---|
| M-17 | **Two or more layouts per department** (one layout per department works: each QA NDC department has its own layout) (Accounting: Accounting + ADM; NDC Finance: NDC Finance + NDC Finance TKT; 6 extra layouts org-wide) | "A department can use only one layout of a module" (LAYOUT_DEPARTMENT_TAKEN) | P1 — agents cannot pick the request form; ADM and Top-up forms saved unassigned |
| M-18 | **92 workflow rules** (82 in the core departments) | "Module has reached the limit of 50 rules" — counted for the whole tenant | **P0** — 38 of NDC's core rules could not be created (list in `ndc-mimic/wf-not-built.json`) |
| M-19 | Round-robin targets for **Is Overdue, Is Escalated, Is Response Overdue**, and assignment by **Layout** | Not available as assignment-rule criteria | P1 — NDC's QA escalation routing cannot be copied |
| M-20 | Workflow field update **owner = unassigned** (NDC Finance "Ticket owner -1/-2", R1, R2) and the **REASSIGN** action | No workflow action can clear the owner or re-run assignment | P1 — top-up hand-over to a team pool breaks |
| M-21 | Team notification "editing a comment" | No such rule key | P2 |

## 4. Needs adjustment (TAVI has it, but not the way NDC uses it)

| # | NDC behaviour | TAVI behaviour | Adjustment |
|---|---|---|---|
| A-1 | Workflow names unique **per department** (NDC reuses "GDS B2B", "Airline Ops"… in 4 departments) | Unique per module | Allow the same name in different departments (we prefixed the department) |
| A-2 | One "Assign Ticket" action sets **team + agent** (19 NDC rules) | Only one OwnerAssignment action per rule | Allow team + agent in one assignment, or two assignment actions |
| A-3 | Trigger "**on create OR when field X changes**" (38 NDC core rules, e.g. QA share rules, Close Ticket) | Field-change trigger fires on edit only | Add "also on create" to the field-change trigger |
| A-4 | Blueprint start state marked explicitly | Start state = first state in the list; marking is refused | Explicit start state (or document the rule in the designer) |
| A-5 | Workflow sets Status = Closed (Manual Invoice) | Rule fires, update silently skipped while the ticket is in a blueprint (no error, no dispatch) | Either apply it or show why it was skipped; confirm Zoho's behaviour for NDC |
| A-6 | Mandatory fields per layout (Manual Invoice 9, ADM 18, NDC Finance TKT 15…) | Stored on the layout, not enforced on an API-created ticket | Enforce the department layout's required fields on every create path (confirm on screen) |
| A-7 | Direct assignment / round robin on tickets agents create (most NDC tickets are typed in by agents) | Rules did not run; creator stayed owner | Run assignment rules on agent-created tickets (confirm on screen) |
| A-9 | **Ticket statuses per department**: each NDC layout offers its own status list (Manual Invoice 8, ADM 10, NDC Finance TKT 6, Financial approval 13, Clients' Financial Investigations 13, FLY-WT Refund 8; Client Complaints, Accounting and NDC Finance only the basic 4) | One tenant-wide status list (41). A per-layout list can be saved on the layout (tested on QA NDC Manual Invoice), but a ticket with a status outside it is still accepted | Enforce the layout's status list on save and in the status picker (picker not yet checked on screen) |
| A-8 | Labels up to 50+ characters | Field labels capped at 50 | NDC's labels fit; only our prefix overflowed — no change needed |

## 5. Works as NDC (verified while building)
Custom statuses with types · large pick lists (185–188 values) · decimal / currency / date fields · department layouts with NDC sections ·
layout rules with show-section / require-field · validation rules · blueprints (81 transitions, team and ticket-owner transition owners,
required fields, field updates and notifications after a transition, inactive draft) · share-ticket workflow action · send-reply,
email, skill-reassign and field-update workflow actions · ticket-event triggers (customer reply, agent response, comment, rating,
private thread) · round robin with load / sequence / skills and team pools · SLA policies with response / resolution targets,
first-response-only and escalations that set priority · per-department notification rules.

## 6. Not tested yet
Email delivery of workflow replies and alerts · round-robin distribution across agents · SLA escalation timing · notification delivery ·
the same flows through the screens (A-6 and A-7 especially) · agent C visibility on QA NDC departments.

## 7. Where things are
- Rebuilt setup on NDC-Staging: search "QA NDC" in Departments, Teams, Layouts, Layout rules, Validation rules, Blueprints, Workflow rules,
  Assignment rules, SLA policies. Kept on purpose (user's choice).
- Build data and logs: `executions/execu_2026-11-01_desk-golive/ndc-mimic/` (PROGRESS.md, id registries, call files, `created/`).
- Mapping notes: `wf-notes.json` (workflows), `ar-notes.json` (assignment), `notif-missing.json`, `wf-not-built.json`.
- NDC email addresses were never copied: workflow replies and alerts go to the QA inbox only.
