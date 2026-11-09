# Spec: Desk automation, alone, together and in order

Draft for review, 8 Nov 2026. Reference: Zoho Desk. Plan: `plan-desk-automation-order.html`. Gaps: `desk-automation-missing-list.md`.

## 0 How to run

- **Order:** Part A, then Part B, then Part C, then Group Z. Don't start a part until the one before it is done and its bugs are re-run alone.
- **Tags:** `[serial]` writes tenant settings, so run alone. `[zoho-live]` is also run on Zoho because the docs conflict or say nothing. `[wait]` depends on a real timer. `[mail]` needs a real inbox. `[rec]` records what happens when neither Zoho nor NDC-2275 decides.
- **Each row gets two results:** functional and visual (section 2).
- **Verdicts:** Pass, Fail, Inconclusive, Not run. A blocked row is Inconclusive, never Fail.

## 1 Preconditions

- **Tenant:** NDC-Staging. Tickets module `88e8ea44-1658-4df3-9930-d0902b91073d`.
- **Accounts:** owner, one admin, one supervisor, agents A1, A2, A3, and a Desk Agent profile. One sign-in per account per run.
- **Out of scope for now:** AI owner suggestion, AI workflow actions, mobile apps, SMS sending and instant messaging.
- **Test data:** prefix `QA AO `, department `QA AO Dept A` and `QA AO Dept B`, team `QA AO Team`, and a guard condition "Subject starts with QA AO " wherever the rule type allows it. Each object goes in `ledger.md`.
- **Baseline:** `reference/tavi-baseline-2026-11-08.json`. Final GET diff must show only agreed changes.
- **Inboxes:** `mahmoud.mmohamedsamy@gmail.com` for customer replies. Either that or `mmohamed@anyware.software` for notifications.
- **Zoho:** `techsolutionsegypt`, QA rules and tickets allowed, deleted after. Don't click header switches.
- **Checks before S5:**
  - Create one QA workflow rule to learn the real limit. The list API stops at 50.
  - Confirm `QA AS6 WF EO2`, `EO3`, `EO5` and `add skill` can't fire on `QA AO ` tickets. They have no department limit. If they can, stop and ask.
  - Don't change business hours, master switches or the Standard layout without asking.
- **Traps:**
  - Agents go offline after 10 idle minutes, so keep them present during round robin.
  - Staging drops connections, so a network error is a re-run, not a result.
  - Business-clock due times are provisional at entry, so compare settled values.
  - Replies from anyware.software don't fire rules.

## 2 Visual checks (apply to every screen and state a row touches)

| Id | Check | How |
|---|---|---|
| V-01 | Text is not clipped or cut off | Automatic: element size against content, then by eye |
| V-02 | Nothing overlaps; no sideways page scroll | Automatic: element boxes, page width |
| V-03 | No raw translation keys or placeholders such as `{{name}}` | Automatic: text scan |
| V-04 | No console errors or failed requests on load | Automatic |
| V-05 | Images and icons load | Automatic |
| V-06 | Shown value equals saved value after reload | Automatic: screen against API |
| V-07 | Dark theme: text readable, nothing stuck light | Capture, by eye. Known: NDC-2804 |
| V-08 | Arabic: right-to-left layout, translated labels, numbers and dates correct | Capture, by eye |
| V-09 | Phone width: usable, no cut-off actions | Capture, by eye |
| V-10 | Empty, loading, error and very long text states | Capture, by eye |
| V-11 | Focus visible, keyboard works, labels on controls | Automatic plus by eye |
| V-12 | Alignment, spacing and consistency against sibling screens, and Zoho where it matters | By eye |

A screen counts as clean only after a person-level look at V-07 to V-12. The report lists screens not reviewed.

## 3 Part A: each automation alone

Turn off interference: only the automation under test may act on the test department.

### A1–A3 Skills, Direct assignment, Round robin

Run `docs/desk-assignment-rules/spec-v2-assignment-rules-skills.md`, every row except D-15, D-16, D-17, E-15, G-06 and H-12, which move to Part B or C. Add NDC-2821 and Group Z retests.

Also: bugs NDC-2811..2814 and the department filter on the direct rule list.

### A4 Workflow

Run `docs/desk-workflow-rules/spec-desk-workflow-rules.md`, every row. First update rows that the build has overtaken (see gap re-check). Re-check B-1..B-9 (`executions/execu_2026-10-12_desk-workflow-rules/`), and the 50-rule list cap on the rules screen.

### A6 Blueprint

Run `docs/desk-blueprint/spec-desk-blueprint.md`, every row except Group L, which moves to Part B. Re-check bugs NDC-2755..2788 only for current state.

### A5 SLA

Run `docs/desk-sla-escalation/spec-desk-sla-escalation.md`, every row (`SL-01`..`SL-67`).

### A7 Notifications (new)

Rows run on `QA AO Dept A`. Changing a rule there is agreed; every other department stays untouched. Open gaps in NDC-2389 (Ready For Test) are retested here. SMS and instant messaging are skipped for now.

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| NT-01 | Open as manager, viewer, and no permission; screen and API | Manage, read-only, denied | |
| NT-02 | Department picker; no departments | Each department's own rules; stated message | |
| NT-03 | All 37 rules listed under Contact, CC, Agent, Department, Team, with default state | Compare with Zoho's 51; off by default in Zoho | [zoho-live] |
| NT-04 | Change takes effect at once; other departments unchanged | Instant; isolated | |
| NT-05 | Contact rules, each event on and off: received, reply, closed, comment added, edited, deleted | Mail only when on, to the requester | [mail] |
| NT-06 | CC rules, each event, with CC feature on and off | As Zoho (N-002) | [mail] [zoho-live] |
| NT-07 | Added to ticket as CC | Mail to new CC | [mail] |
| NT-08 | Agent rules: assigned, reply, comment events, mentioned, review requested | Right agent; on and off | [mail] |
| NT-09 | Agent activity rules: assigned, completed, mentioned, for call, task, event | Works for all three types | [mail] |
| NT-10 | Reply not delivered; rating received | Sent when on | [mail] |
| NT-11 | Department rules: created, moved, shared | All department agents; created only if not auto-assigned | [mail] |
| NT-12 | Team rules, each event | Every team member, once | [mail] |
| NT-13 | Private thread | No mail to contact | [mail] |
| NT-14 | Self-assignment | No notice | |
| NT-15 | Rule templates: choose, edit, new, default, deleted template | Binding works; invalid shown as "no longer valid" | [mail] |
| NT-16 | Placeholders in subject and body | Filled; no raw tokens | [mail] |
| NT-17 | Team template editable? | Docs conflict (C-16); compare | [zoho-live] |
| NT-18 | SMS switch with no gateway: only the message, no sending | Shows "No SMS gateway"; can't be turned on | |
| NT-19 | Assignment notification master switches | Agent and team notices stop and resume | [serial] |
| NT-20 | Bell: count, list, filters All, Unread, Flagged, @Mentions (NDC-2389), open item, read all | Count correct; opens the ticket | |
| NT-21 | Bell Settings opens the personal preferences page (NDC-2389 says it landed on Headquarters); per event and channel | Page opens; saved and obeyed. Who can override admin rules: record | [rec] |
| NT-22 | Admin notification policy, "Allow SMS for Desk" | Saved; effect recorded | [serial] [rec] |
| NT-23 | Fires on API, import, bulk close, macro change | Record. Docs conflict (C-17) | [rec] [zoho-live] |
| NT-24 | Close in bulk | Compare with N-004 | [zoho-live] |
| NT-25 | One notice per event, no duplicates | Single mail | [mail] |
| NT-26 | Collaboration tool notification settings | Only if a tool is connected, otherwise Inconclusive | |
| NT-27 | Audit log for rule changes | Logged | |
| NT-28 | Stale save, double click, permissions change mid-session | Correct message | |
| NT-29 | Security: script in template, other tenant's department ID | Escaped; refused | |
| NT-30 | Deactivated agent or team | No mail; no error | |

### A8 Macros (new)

| Id | Scenario | Expected | Tag |
|---|---|---|---|
| MC-01 | Open as manager, agent, direct URL, API | Stated denial without "Manage macros" | |
| MC-02 | Create: name empty, over the limit, description over the limit, no actions | Each stated error | |
| MC-03 | Each action kind alone: set field, status, priority, assign, private comment, resolution, send email, create task, move department | Runs and shows in history | [mail] |
| MC-04 | Up to 10 of an action, 11th | Refused | |
| MC-05 | Duplicate action; move with assign; move with status | Each stated error | |
| MC-06 | Reorder actions; move runs last | Runs in order; move last | |
| MC-07 | Who can use: all, agents, teams, roles | Only those see it, in single and mass apply | |
| MC-08 | Department scope and "all departments" | Offered only where it should be | |
| MC-09 | Inactive macro | Not offered | |
| MC-10 | Apply on ticket; apply twice | Works; record the second | [rec] |
| MC-11 | Apply to many tickets, 50 and 51, across departments | Compare with Zoho's cap of 50 | [zoho-live] |
| MC-12 | One action fails partway | Record what remains applied; message is honest | [rec] |
| MC-13 | Target gone: deleted template, agent, team, inactive department, deleted layout | Summary says so; prompt on edit | |
| MC-14 | Ticket in a blueprint, strict mode on and off | Compare M-041, M-042 | [zoho-live] |
| MC-15 | Edit, deactivate, delete; tickets keep results | As confirmation says | |
| MC-16 | History and audit | Names the macro and the agent | |
| MC-17 | Reassign flow lists macros | Count correct | |
| MC-18 | Security: script in name and comment; other tenant's IDs | Escaped; refused | |

## 4 Part B: pairs

All `[serial]`. Each runs both directions where that makes sense. Scenarios as in plan section 4.

| Id | Pair | Pass when |
|---|---|---|
| OR-01 | Skills › Round robin | Skilled agent assigned in the same event |
| OR-02 | Skills › Workflow | Workflow sees the skill |
| OR-03 | Workflow vs Skills `[zoho-live]` | Same as Zoho |
| OR-04, 05, 06 | Direct › Workflow | Condition sees owner; last change wins with history; alert goes to the direct owner |
| OR-07, 08 | Workflow › SLA | Target and policy use workflow's values |
| OR-09 | Direct › SLA | SLA uses final values |
| OR-10, 11 | Workflow › Round robin | No override; field unlocks the rule in the same event |
| OR-12 | Direct › Round robin | New department's rule assigns in the same event |
| OR-13, 14 `[zoho-live]` | SLA › Round robin | SLA first where provable; agent timer from assignment |
| OR-15 `[zoho-live]` | Round robin methods | First matching rule only |
| OR-16, 17 | Workflow, Round robin › Blueprint | Blueprint sees their results |
| OR-18 | SLA + Blueprint | Both run |
| OR-19, 20 `[zoho-live]` | › Notifications | Final owner only; team once |
| OR-21 | Later events | Each is a new event |
| OR-25 | A step fails | Later steps run; failure logged |
| OR-26 `[zoho-live]` | Loops | No endless loop |
| OR-28, 29, 30 | Skills › Direct, SLA, Blueprint | Sees the skill, or gap recorded |
| OR-31 | Direct › Blueprint | Blueprint sees owner and department |
| OR-32, 33, 34, 35 | Direct, Workflow, SLA, Blueprint › Notifications | One notice, final values |

Also from existing specs: assignment D-15, D-16, D-17, E-15, G-06, H-12, and Blueprint Group L.

## 5 Part C: whole order

| Id | Scenario | Pass when |
|---|---|---|
| OR-22 | One created ticket triggers all seven steps | History shows each step, each saw the last, final notice correct |
| OR-23 | Same from an update | Same; only update rules run |
| OR-24 | Screen, API, email, web form, chat; import with automation on and off | Same order; none when off |
| OR-27 | 100 tickets | Owner set within 5 seconds for 95 of 100 |
| E2E-1 | Customer emails, ticket routed, SLA starts, agent replies, customer replies, closes | Every automation correct, real mail |
| E2E-2 | Ticket breaches SLA, escalates, new owner, blueprint continues, notices | Correct chain |
| E2E-3 | Move department mid-way | Old automation stops; new runs |
| E2E-4 | Negative recovery: rule breaks mid-chain, admin fixes, reapply | Ticket recovers |

## 6 Group Z

One row per item in `desk-automation-missing-list.md`, except skipped items 2 and 8: 32 rows, numbered as in that list, each confirmed on screen in TAVI and against live Zoho where marked. Still missing gets an annotated image; built moves to a test row. Older specs' Group Z rows also run.

## 7 Automation split

From `reference/existing-automation-coverage.md`, by case-id match; nothing was run.

| Spec | Rows | Tagged in existing automation | Uncertain | Not covered |
|---|---|---|---|---|
| Assignment | 114 | 66 | 14 | 34 |
| Workflow | 237 | 107 | 9 | 121 |
| Blueprint | 195 | 77 | 19 | 99 |

- Existing tests can be reused, but "covered" doesn't mean they pass or check enough: assignment scripts have no asserts, and some Java rows only record output or only check that an option is offered.
- Assignment scripts become real tests in the new `deskautomationorder` feature.
- SLA, Notifications, Macros and Parts B and C are all new code. SLA has 67 rows, Notifications 30, Macros 18.

## 8 Traceability

| Requirement | Cases |
|---|---|
| EO-1 order | OR-01..OR-24, OR-28..OR-35 |
| EO-2 each step sees the last | OR-02, 04, 07, 08, 09, 11, 16, 17, 28..31 |
| EO-3 round robin won't override | OR-10, OR-12, MC-03 with OR-21 |
| EO-4 later steps may change owner | OR-05, OR-21, SL-23 |
| EO-5 final owner notified | OR-19, 20, 32..35, NT-14, NT-25 |
| EO-6 one method, first match | OR-15 |

## 9 Reporting

- Functional and visual results are separate. Screens not reviewed are listed.
- Annotated TAVI vs Zoho images for failed cases only. Anything inferred about Zoho says "not checked".
- Candidate bugs re-run alone. Check Plane first for an existing ticket.
- Final GET diff against the baseline, with the ledger. `QA AS6` data is left alone.
- Nothing goes to Plane or a shared page unless you say so. Tokens and passwords are never printed.
