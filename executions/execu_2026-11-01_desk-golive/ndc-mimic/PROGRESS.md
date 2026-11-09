# NDC mimic on TAVI (NDC-Staging) — progress

Started 3 Nov 2026. User choices: core NDC flows (8 departments: Manual Invoice, NDC Finance, Financial approval, Accounting,
Quality Assurance, Client Complaints, Clients' Financial Investigations, FLY-WT Refund) + the 23 branch departments the
Share-Ticket workflows target; build on NDC-Staging with prefix "QA NDC " and KEEP it as the NDC reference setup.
Source of truth: `../ndc-zoho/ndc-core-build.json` (from the read-only NDC Zoho capture). Quality Assurance layout not fetched
(Zoho timeout) — still to do.

Tool: `../scripts/tavi-api.js` (API sign-in as owner, no browser; token cached in scratchpad). Call files `c*.json`, raw
responses in `created/`, logs `log-c*.txt`. Id registries: dept-ids.json, team-ids.json, status-map.json, field-map.json,
layout-ids.json, agents.json.

## Done
| Step | Result |
|---|---|
| 1 Departments + teams | 31 QA NDC departments (agents set), 32 teams |
| 2 Statuses | 37 QA NDC statuses added with NDC types (41 total) |
| 3 Fields | 87 QA NDC fields (39 pick lists incl. 185–188 values, decimal, currency, date...) |
| 4 Layouts | 7 department layouts assigned; 2 second layouts (ADM, NDC Finance TKT) saved unassigned |
| 5 Rules | 7 layout rules, 1 validation rule |

| 6 Blueprints | 6 (5 active + inactive Rejection Flow), 81 transitions, owners/required fields/after actions kept |
| 7 Workflows | 42 of 80 created; 38 not built (TAVI limit 50 rules per module, and one OwnerAssignment per rule) — wf-not-built.json, wf-notes.json |
| 8 Assignment | 7 rules (direct + round robin) — ar-notes.json |
| 9 SLAs | 9 policies with NDC targets and escalations |
| 10 Notifications | 240 department rule switches set as in NDC (8 departments) |
| 11 QA layout + 7 fields | done (94 QA NDC fields, 10 layouts) |

## Next
12 smoke test (create a ticket per department, check layout/rules/workflow/assignment/SLA/blueprint fire) · 13 comparison report (missing vs needs adjustment) · update NDC-2787 only after user review.

## Gaps / adjustments found so far
- G1 MISSING: one layout per department per module (LAYOUT_DEPARTMENT_TAKEN). NDC uses 2 in Accounting and NDC Finance
  (6 extra layouts org-wide).
- G2 MISSING: workflow rules limited to 50 per module (tenant-wide). NDC has 92 (82 in the core departments).
- A1 ADJUST: workflow rule names must be unique per module (Zoho: per department) — NDC reuses names across 4 departments.
- A2 ADJUST: one OwnerAssignment action per rule — Zoho assigns team + agent together (19 NDC rules).
- A3 ADJUST: workflow "owner = unassigned" field update has no TAVI action (4 NDC Finance rules); Zoho REASSIGN action has no TAVI action.
- A4 ADJUST: blueprint start state is implied by list order (no explicit start marker like Zoho).
- A5 ADJUST: assignment-rule criteria lack Is Overdue / Is Escalated / Is Response Overdue (NDC QA round robin uses them) and Layout.
- A6 ADJUST: trigger "create OR edit of field X" — TAVI SpecificFieldChanged (create behaviour to verify).
- A7 ADJUST: no team notification for "editing a comment" (1 NDC department uses it).
- Note: field label max 50 characters (NDC labels fit; only the QA prefix overflowed) — not a gap.
- OK: per-layout mandatory fields kept on the layout (enforcement still to test); big pick lists; decimal/currency/date types;
  status types; layout-rule actions show fields / show sections / require fields; validation rule.

## 3 Nov smoke test + report
Smoke tickets #890–#893 (kept). Layout rule + validation + share workflow + SLA + blueprint work; Close Ticket on create does not fire (A-3), status update skipped in blueprint (A-5); per-layout required not enforced via API (A-6) and assignment rules did not run on agent-created tickets (A-7) — both to confirm on screen.
Report: docs/ndc-zoho-desk-gap/ndc-on-tavi-mimic-report.md (M-17..M-21 missing, A-1..A-8 adjust). Nothing filed in Plane.
Note: the gap/adjustment ids above (G1, G2, A1–A7) are working labels; the report numbering (M-17..M-21, A-1..A-8) is the one to use.
