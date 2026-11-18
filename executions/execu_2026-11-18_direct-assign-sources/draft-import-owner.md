# Draft (not filed): Import | Ticket Owner from an import file is handled differently from Zoho: an empty or unknown owner gives the ticket to the importer, and an agent outside the department is accepted

Assignees: Mahmoud Mohamed, Ahmed Hegazy, Eslam Ahmed (eahmed) · State: Bug · Module: Desk · Cycle: Sprint 16 · Priority: Medium (proposed) · Label: (to pick, e.g. Tickets) · Attachment: IMP-import-owner-cases-vs-zoho.png

## Summary
When tickets are imported (Setup › Data Administration › Import, module Tickets), TAVI gives every row without a usable Ticket Owner to the user who runs the import. This covers no owner column, an empty cell, an unknown email and an agent's name. Zoho Desk leaves those tickets Unassigned. TAVI also accepts the email of an agent who is not in the ticket's department and makes that agent the owner. Zoho refuses that row with "The assignee doesn't belong to the department". Both products were checked live on 18 Nov 2026 with the same rows.

## Steps to Reproduce
1. Sign in to Desk as an admin and open Setup › Data Administration › Import, module Tickets.
2. Upload a CSV with Subject, Department (QA AO Dept B), Status, Priority, Email and a Ticket Owner column with these rows: empty owner; an unknown email (qa-rt22-nobody@example.com); an agent's name ("Test User 1"); the email of an agent of QA AO Dept B (Test User 1); the email of an agent who is not in QA AO Dept B (mahmoud.mahamed1515).
3. Upload a second CSV with the same columns but no Ticket Owner column.
4. Keep "Trigger automation and process management" off, map the fields and submit.
5. Open each imported ticket and look at Ticket Owner.

## Expected Result (Zoho Desk, live 18 Nov 2026)
- No owner column, empty cell, unknown email or a name: the ticket is created Unassigned (it goes to the unassigned queue for the department's assignment rules).
- Email of an agent of the department: that agent owns the ticket.
- Email of an agent who is not in the ticket's department: the row is not imported and the failed-rows file says "The assignee doesn't belong to the department".

## Actual Result (TAVI, 18 Nov 2026)
| Owner in the file | TAVI | Zoho |
|---|---|---|
| No Ticket Owner column | #5487 owner = the importer | Unassigned |
| Empty cell | #5482 owner = the importer | Unassigned |
| Unknown email | #5483 owner = the importer, no warning | Unassigned |
| Agent name instead of email | #5484 owner = the importer, no warning | Unassigned |
| Email of an agent of the department | #5485 owner = Test User 1 (same) | That agent |
| Email of an agent outside the department | #5486 imported, owner = mahmoud.mahamed1515, who is not an agent of QA AO Dept B | Row refused |

The Import › Assign step states the importer rule: "A row with no owner is assigned to you."

## Environment
staging-desk.taviportal.com, NDC-Staging, owner account (ndc-staging-owner) importing into QA AO Dept B, Edge, 18 Nov 2026. Zoho Desk test org TechEgySolutions, admin importing, 18 Nov 2026. Test data deleted after.
