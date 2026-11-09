# Spec: Desk SLA and escalation

Draft for review, 8 Nov 2026. Reference: Zoho Desk. Part of the Desk automation order test (`docs/desk-automation-execution-order/spec-desk-automation-order.md`, Part A5).

Sources: NDC-1971 (feature, two lines, no requirements list), NDC-2266 (gaps), NDC-2267 (user stories), bugs NDC-2215, NDC-2216, NDC-2272, NDC-2774. Zoho facts: `docs/desk-automation-execution-order/reference/zoho-docs-inventory-sla-notifications-macros.md` (`S-nnn`, conflicts `C-n`). Earlier run: 14 Oct 2026, results summarised only in NDC-2266.

## 0 How to run

- Run groups in order. Groups C to H create tickets and wait for real timers, so use the shortest valid targets.
- **Tags:** `[serial]` writes shared settings, so run alone. `[zoho-live]` also runs on Zoho, because the docs conflict or say nothing. `[wait]` depends on a real timer. `[mail]` needs a real inbox. `[rec]` records what happens when nothing decides the expected result.
- **Two results per row:** functional, and visual (`V-01`..`V-12` in the master spec, section 2).
- **Verdicts:** Pass, Fail, Inconclusive, Not run. A blocked row is Inconclusive.

## 1 Preconditions

- **Tenant:** NDC-Staging, admin account, plus accounts with "View SLAs" only, and a Desk Agent.
- **Test data:** department `QA AO Dept A`, policies and tickets prefixed `QA AO `. All logged in `ledger.md`.
- **Business hours:** use a QA set. `QA AS6 BH` exists. Don't change `Default` without asking.
- **Inboxes:** `mahmoud.mmohamedsamy@gmail.com` for customer replies. Either that or `mmohamed@anyware.software` for escalation mail.
- **Leave alone:** the 10 active `QA NDC` and other policies in their departments. Baseline: `tavi-baseline-2026-11-08.json`.
- **Can't be fully deleted:** NDC-2215 said a plan attached to a contract stays "in use". It's marked Done; SL-59 confirms it before plans are created.
- **Traps:** business-clock due times are provisional at entry, so compare settled values. Staging drops connections, so a network error is a re-run.

## 2 Surface and contract

**Screens**
- `/settings/automation/sla`: list by department, Active and Inactive tabs, drag to reorder, row actions Edit, Accounts, Reapply to open tickets, Delete.
- Editor with steps When and Targets. Add Target panel with conditions, times, hours and escalations.
- `/settings/automation/support-plans`.
- Ticket page SLA display, account SLA coverage card, contract support plan card.

**API**
- `/desk/sla/meta`, `/desk/sla/policies`, `/desk/sla/support-plans`, `/desk/sla/escalation-templates`, `/desk/sla/contracts/{id}/plan`, `/desk/tickets/{id}/sla`, `/desk/tickets/{id}/sla/reapply`.

**Permissions**
- "View SLAs", "Manage SLAs".

**Limits from `/desk/sla/meta` (8 Nov)**

| Item | Value | Zoho |
|---|---|---|
| Response levels | 2 | 2 |
| Resolution levels | 4 | 4 |
| Targets | 50 | 10 |
| Conditions | 25 | Not documented |
| Watched fields | 3 | Not documented |
| Name length | 120 | Not documented |
| Allowance days | 366 | Not documented |
| Units | minutes, hours, days | Same |
| Plan types | unlimited, allowance | Screen: Unlimited, Ticket-based |
| Plan cycles | weekly, monthly, quarterly, yearly | Screen: same four |
| Operators | 9 text-style | Also number and date operators (gap) |

## A Access and list

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-01 | Open SLA Policies as admin, as "View SLAs" only, as agent, by direct URL and API | Manage / read-only / denied, on both screen and API | |
| SL-02 | No department, empty department, Active and Inactive tabs | Stated messages shown | |
| SL-52 | "View SLAs" user: all write buttons disabled, stated reason shown; "Manage SLAs" required on the API too | Read-only; API refuses writes | |

## B Policy: when it runs

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-03 | Create: name empty, 120 and 121 characters, special characters, duplicate | Limit enforced; compare with Zoho on duplicate | [zoho-live] |
| SL-04 | Each trigger alone: Create, Update, Field Update, Customer Reply, Agent Response, Private Thread, Comment | SLA applies only on that trigger | [serial] [mail] |
| SL-05 | Ticket Update and Field Update together | Refused as either-or | |
| SL-06 | Field Update: 1–3 watched fields, 4th, Any and All | Limit 3; Any and All behave | |
| SL-07 | Comment scope and thread scope options | Only the chosen scope fires | |
| SL-08 | "Calculate resolution from created time" | Resolution counted from created time | |
| SL-09 | "Execute only with an Account" with and without account | Applies only with account | |

## C Targets, times and hours

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-10 | Target: up to 50, 51st; conditions up to 25, 26th | Limits enforced | |
| SL-11 | Target with no conditions, several matching | Match rule shown on screen holds; record which target wins | [rec] [zoho-live] |
| SL-12 | Each operator on the field types offered; number and date fields | Works; missing operators logged as gap 9 | |
| SL-13 | Response only, resolution only, neither | Saves as stated; "neither" refused | |
| SL-14 | Units minutes, hours, days; zero, negative, huge | Invalid refused | |
| SL-15 | Calendar hours against each business-hours set | Due time exact, checked against S-076 to S-078 | [serial] |
| SL-16 | Holiday in the business-hours set | Due time skips it. Re-check NDC-2774 | [serial] |
| SL-17 | Hours not configured | Warning shown; counts around the clock | |
| SL-18 | First response only on and off | Later customer messages do or don't restart response | [mail] |
| SL-53 | Target with a deleted business-hours set: delete the set while a target uses it (NDC-2216) | Blocked or warned; due time not computed on a deleted set | [serial] |
| SL-54 | Escalate before due longer than the target; level timings out of order | Refused or clear message; record | [rec] |

## D Escalations

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-19 | Escalation timing before, on time, after, with each level up to 2 response and 4 resolution | Each fires once at the right time; the limit holds | [wait] |
| SL-20 | Escalate based on business hours | Offset counts business time | [wait] |
| SL-21 | Each recipient kind: agents, teams, roles, ticket owner, owner's manager, department agents, ticket contact | Right people get the mail. Contact only at or after due | [wait] [mail] |
| SL-22 | Agent Notification Template per level; default template | Chosen template used; tokens filled | [mail] |
| SL-23 | Action: reassign to agent, to team; set priority | Applied and shown in history | [wait] |
| SL-24 | Closed ticket; ticket answered in time | No escalation | [wait] |
| SL-25 | Status set to Escalated, `Is Escalated`, and what clears them | Record, compare with Zoho | [rec] [zoho-live] |
| SL-55 | Role recipient: every active member of the role gets the mail (NDC-2267 story 1) | All active members, nobody else | [wait] [mail] |
| SL-56 | Contact recipient on Before due | Not offered, "Only at or after the due time" | |
| SL-57 | Template later deleted (NDC-2267 story 2) | Clear message; default email used | [wait] [mail] |
| SL-58 | Deactivated agent or deleted team as recipient or reassign target | No crash; stated behaviour; compare S-145 | [wait] |

## E On Hold and resets

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-26 | Put On Hold, resume by status, workflow, customer reply | Timer freezes, due hidden, no escalation; new due = old + held | [wait] [mail] |
| SL-27 | Return an overdue ticket from On Hold | Docs conflict (C-10); compare | [zoho-live] |
| SL-28 | Close from On Hold | Follows S-088 | |
| SL-29 | Manual due date change, then hold and resume | Follows S-086 | [zoho-live] |
| SL-30 | Reset on reapply by trigger; reset for each selected trigger | Times reset; next response counts as first | |
| SL-31 | "Reapply to open tickets": active and inactive policy | Count correct; inactive refused. Re-check NDC-2272 | [serial] |

## F Changes after the fact

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-32 | Edit a policy with running tickets | Running tickets keep their targets, as the screen says | |
| SL-33 | Deactivate, delete with tickets, delete when a support plan grants it | Stated warnings; plan blocks delete | |
| SL-34 | Reorder policies; two match | First in list wins; order survives reload | |

## G Precedence, plans and contracts

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-35 | Precedence: contract, then account, then general | "Process stops there" holds, even when the contract SLA's criteria are the only match | [zoho-live] |
| SL-36 | Account association: add, remove, one per department | As screen states | |
| SL-37 | Support plan: unlimited, allowance, each cycle; locks; discontinue; delete when in use | Follows S-043 to S-051 | [serial] |
| SL-38 | Allowance used up | Falls back as the screen states; Zoho applies no SLA until renewal | [zoho-live] |
| SL-39 | Contract: dates past, future, none; expired; other department's plan | Each reason on the coverage card is correct | |
| SL-40 | Contract expiry alert | Gap 14 or works | |
| SL-59 | Remove a plan from a contract; delete contract then plan then policy (NDC-2215) | All allowed once unused | [serial] |
| SL-60 | Plan or policy in another department linked to a contract | Coverage card reason correct; not applied | |
| SL-61 | Change the plan on a contract with running tickets | New terms from now on, as screen states | |

## H Move, merge and split

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-41 | Move department | Old SLA gone; new department's applies. Docs conflict (C-12) | [zoho-live] |
| SL-42 | Merge and split | Follows S-107, S-108 | [zoho-live] |

## I Where results appear

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-43 | Overdue and Response Overdue views; On Hold leaves them | From NDC-2266 "could not be checked" | |
| SL-44 | "Is overdue", "Is response overdue" in custom views, reports, automation | Usable; ignores On Hold | |
| SL-45 | Ticket counts as resolved only when Closed | Holds | |
| SL-46 | SLA dashboards, filters and values against known tickets | Numbers match. Check the v1 and v2 duplicate | |
| SL-47 | Ticket page SLA display, list column, countdown | Correct values; gap 11 | |
| SL-62 | Countdown view, if present (NDC-2267 story 3): columns, live move, On Hold column, more than 7 columns | Each criterion, or gap confirmed | |
| SL-63 | Ticket history records SLA applied, escalated, overdue, with policy and level | Compare S-031, S-033 | [wait] |
| SL-64 | "Violations by hour of day" widget (NDC-2266) | Present, or gap confirmed | |

## J Save, audit and security

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| SL-48 | Stale two-tab save; double submit; session expiry | "Someone else saved" shown; one policy created | |
| SL-49 | Audit log for create, edit, delete, reorder | All logged | |
| SL-50 | Security: script in name and description, other tenant's ID, agent calling write API | Escaped; refused | |
| SL-51 | Agent removed from recipients or deactivated | Reassign flow lists SLA escalations. Compare S-145 | |
| SL-65 | Business-hours change while a ticket runs; time zone differs from agent | Record whether running tickets change | [rec] [serial] |
| SL-66 | Reapply on a ticket from the ticket page, `/desk/tickets/{id}/sla/reapply` | Works, or is refused with a reason | |
| SL-67 | Hundreds of open tickets: reapply and list load | Stays usable; record timing | [serial] |

## E2E journeys

| Id | Journey | Pass when |
|---|---|---|
| SLA-E2E-1 | Customer emails, policy applies, agent answers in time, closes | No escalation; dashboard counts it as met |
| SLA-E2E-2 | Ticket misses response, then resolution: both levels fire, reassign, new owner replies | Mails, owner, priority and history all correct |
| SLA-E2E-3 | Ticket goes On Hold, customer replies, then breaches | Timer and mails follow S-085 |
| SLA-E2E-4 | Account on a contract with an allowance: use it up, next ticket falls back | Right policy each time; card shows usage |
| SLA-E2E-5 | Ticket moves department mid-timer | Old timer stops; new policy runs |
| SLA-E2E-6 | Negative recovery: wrong policy applied, admin fixes and reapplies | Ticket ends on the right targets |

## Group Z: gaps

| Id | Gap | How to test | Expected from Zoho |
|---|---|---|---|
| Z-S1 | Number and date operators in target conditions | Open a target's conditions on a number and a date field | Less than, greater than, between, is before, is after (S-011) |
| Z-S2 | Violations by hour of day | SL-64 | Widget present (NDC-2266; not in the docs we read, so confirm live) |
| Z-S3 | Countdown view | SL-62 | Up to 7 columns plus On Hold (S-120) |
| Z-S4 | Response Overdue and SLA Violated views | Open ticket views | Predefined views (S-116) |
| Z-S5 | SLA static report, Agent Performance metrics | Open Reports | S-129, S-132 |
| Z-S6 | Contract expiry alert | SL-40 | S-065 |
| Z-S7 | Business-hours block past midnight | Try saving one | Compare live Zoho |

## Traceability

| Source | Cases |
|---|---|
| NDC-1971 targets per tier | SL-10..18, SL-35..40 |
| NDC-1971 escalation on breach | SL-19..25, SL-55..58 |
| NDC-2266 not-tested checks (a) to (d) | SL-43, SL-44, SL-45, SL-64 |
| NDC-2267 stories 1, 2, 3 | SL-21, SL-55; SL-22, SL-57; SL-62 |
| NDC-2215, NDC-2216, NDC-2272, NDC-2774 | SL-59; SL-53; SL-31; SL-16 |
| Zoho conflicts C-10, C-12 | SL-27; SL-41 |

## Reporting

- Functional and visual results are separate.
- Annotated TAVI vs Zoho images for failed cases only; anything inferred about Zoho says "not checked".
- Final GET diff against the baseline, and ledger emptied.
- Nothing goes to Plane or a shared page unless you say so.
