# DRAFT — not filed

**Title:** SLA | No SLA starts on new tickets: matching SLA policies are ignored when a ticket is created

**Module:** Desk · **Label:** SLA & Business Hours · **Suggested priority:** High (blocks retest of NDC-3136)

## Summary
On 23 Nov 2026 no new ticket on NDC-Staging gets an SLA, whichever policy should apply. The ticket's SLA panel says "No SLA applies to this ticket" and `GET /desk/tickets/{id}/sla` returns `state: none, policy: null`, even when an active policy with trigger "On create" matches the ticket. "Reapply SLA" answers 200 but nothing changes. The same steps started an SLA on 19 Nov 2026 (status-type test, QA SLA policy in Customer Support).

## Steps to Reproduce
1. Desk › Setup › SLA: in a department, create an active SLA policy with trigger **On create** and one target, criteria *Subject contains "QA RT26 sla"*, response 1 h, resolution 4 h, calendar hours.
2. Create a ticket in that department whose subject contains "QA RT26 sla" (ticket page form or `POST /modules/{tickets}/records`).
3. Open the ticket's SLA panel, or call `GET /desk/tickets/{id}/sla`, after 10 s, 1 min and 1 hour.
4. Optional: `POST /desk/tickets/{id}/sla/reapply` and read the SLA again.

## Expected Result
The matching policy applies when the ticket is created: first-response and resolution targets start running.

## Actual Result
SLA state stays `none`, policy `null`, no obligations. This happened for every ticket and policy tried:

| Ticket | How created | Department | Policy that should apply | SLA after |
|---|---|---|---|---|
| #7140, #7144 | API | QA RT26 VO Dept | QA RT26 SLA (subject contains "QA RT26 sla") | none after ~55 min |
| #7157 | Ticket form (Standard layout) | QA RT26 VO Dept | QA RT26 SLA | none after 60 s |
| #7145 | API | QA AO Dept A | QA AO SL40d01ql (description contains "SL40d01ql") | none after ~55 min |
| #7146 | API | QA NDC Accounting | QA NDC Priority based SLAs (priority high) | none after ~55 min |

- Reapply on #7140: 200, still `none`.
- Of the 40 most recent tickets on the tenant (anyone's), none has an SLA.

## Environment
staging-desk.taviportal.com, NDC-Staging, Edge + API, owner account (ndc-staging-owner), 23 Nov 2026 08:28–09:27 UTC.

## Evidence
To attach: the API card with the table above, plus the SLA panel on #7157 ("No SLA applies to this ticket").

## Note
- The test data is still in place for the developer: policy "QA RT26 SLA" (ff68b8b4) and tickets #7140–#7146 and #7157. It will be cleaned up after the round.
- Blocks the retest of NDC-3136.

## Recheck (23 Nov, afternoon)
Policy "QA RT26 SLA" is shown as Active in Setup › Automation › SLA & Escalation (Department = QA RT26 VO Dept, Execute on: Ticket Create, Ticket Update). New tickets #7225 "QA RT26 sla A" (no contact) and "QA RT26 sla A2 with contact" (contact set) → SLA panel "No SLA applies to this ticket" after 60 s. Screenshot: 3136-A-sla.png.
