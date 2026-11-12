---
name: desk-activities-replies-intake
description: "Desk Activity Life Cycle + Ticket Replies vs Zoho Desk (26 Oct 2026): docs, gap lists, 13 bug candidates, automation features, accounts, traps; filed NDC-2635..2644"
metadata:
  node_type: memory
  type: project
  originSessionId: 78e9ef04-c27b-42b4-8452-a5ad34c618c7
  modified: 2026-10-26T11:12:12.202Z
---

Intake + run 26 Oct 2026 (user asked: plan, missing list, spec, execute, automate; both features, Zoho KB + live org, replies only to our test mailbox). NDC-1865 checklist items "Activity Life Cycle" and "Ticketing Reply". Activities have no PRD (related NDC-1782, NDC-2008, NDC-1959); replies PRD = NDC-1851 (scheduled replies = NDC-2177).
- Docs: `docs/desk-activity-lifecycle/` and `docs/desk-ticket-replies/` (spec-*.md, *-missing-list.md = Group Z, reference/ build map + Zoho inventory). Run: `executions/execu_2026-10-26_desk-activities-replies/` (report.md, scripts a*/r*/x1/c*, evidence/raw).
- Gaps: activities 5 (department, delete on page, bulk delete, ticket activity count, activities API); replies 6 (send+status, ticket id in subject, KB suggestions, editor tools, draft autosave, read receipts).
- Bug candidates: A-B1 reschedule+missed log 422 read-only, A-B2 task without default status hidden from Open/Overdue, A-B3 raw keys, A-B4 completed call editable by API, A-B5 completed_time client-set, A-B6 duration free text, A-B7 a11y names, A-B8? cross-dept activity access; R-B1 Reply All hides ticket CC, R-B2 Save draft localStorage only, R-B3? self-approve review, R-B4? double POST, R-B5? agent as CC accepted after redeploy.
- Automation: features `deskactivities`, `deskticketreplies`; suites desk-activities-replies-api/-ui (UI needs -Dcredentials.file=.auth/extra-credentials.csv -Dcredentials.account=fedelav803@meinvr.com).
- Accounts: agent fedelav803 (Desk Agent, Customer Support, only our account with a mailbox dept; cannot delete tickets → 15 QA tickets left); admin mahmoud.mmohamedsamy (HR/Marketing/Sales, sees 0 tickets). Zoho Desk = row 1 of Zoho Desk Credentials.csv → portal taviportal (no activities, 2 tickets).
- Staging redeployed mid-run (index-PA6o3K2s → index-7qe5X0Gd).

**Why:** next steps (Plane filing, retests) reuse these ids and files.
**How to apply:** before filing, ask fields and check NDC-1782/2008/2177 overlap; failed-case evidence must be TAVI vs Zoho [[annotate-evidence-vs-zoho]]; never sign in as owner without asking. Related: [[selenium-automation-framework]], [[zoho-reference-capture]].

**Filed 26 Oct 2026** (user: gaps + confirmed bugs, assignees Mahmoud + Hegazy, Desk module, Sprint 13): gap lists NDC-2635 (activities) / NDC-2636 (replies), bugs A-B1..A-B7 = NDC-2637..2643, R-B2 = NDC-2644, each with a TAVI-vs-Zoho image (scripts/make-evidence.js). R-B1 was fixed by the redeploy (composer shows "Also copied on this ticket"); new build also added a Suggested articles panel ("could not be loaded"). Possible bugs A-B8, R-B3..R-B6 only in gap-ticket notes. QA tickets #500-#518 closed (agent cannot delete). Comments on NDC-1851 and NDC-1865.
