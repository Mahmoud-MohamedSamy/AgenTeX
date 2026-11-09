# NDC-2203 — DESK Workflow Missings · retest round 7 (27 Oct 2026)

Ticket uuid 2f7deb90-a42b-43ea-b910-41b4cb4d8114 · back in Ready For Test 27 Oct 10:22 UTC (after r5 PARTIAL → Bug on 26 Oct).
User (27 Oct): "once you finish you can retest NDC-2203 if you haven't retested it".
Developer comment 27 Oct 10:22 UTC (82cf7a79): fixed A4, D1 (Create rule from New Ticket form), Is Overdue in Create rules, History "by workflow rule <name>" + action names as words (EN/AR), Desk email template action saves without subject/body. Not a bug: On Edit on new ticket (D1e), untrusted replies don't start rules. Not testable: A5, B3, B4, B10, B13, B14. Known limit: skills actions still "by System".

Env: staging-desk.taviportal.com · NDC-Staging · Edge headless + API · mahmoud.mahamed1515 (Desk Administrator); fedelav803 (Desk Agent, team Customer Experience Specialists) to read team tickets.

## Fixed items
| Item | Result | Proof |
|---|---|---|
| A4 Private Thread direction | Editor offers "Incoming and outgoing" / "Incoming" / "Outgoing" (saved as any / incoming / outgoing). Forward from #592 to a Gmail address (not the contact): Outgoing + Both fired, Incoming did not. Incoming half WAITING for the user's reply from Gmail. | a4-private-thread-options.png, rules A4in/A4out/A4both |
| D1 Assign to team on Create | API ticket #605, form tickets #616/#617, agent-created ticket #618 with owner = agent: all team = Customer Experience Specialists, owner null at create; #618 then auto-assigned by the team's round robin ("sequence"). PASS | ag-d1 / ag-d1b outputs, d1-form-*.png |
| D1 Edit rule (unchanged) | #650: owner cleared, team set on edit. PASS | ag-d1t |
| Is Overdue in Create rules | due yesterday: "= true" fired, "= false" not; due +5 d: "= false" fired, "= true" not. PASS | #608–#611 |
| History by workflow rule | EN: "by workflow rule QA WF B07", "Workflow rule ran · Rule QA WF B07 · Triggered by A new ticket · Actions Share ticket"; same for Add comment (B01b), Mark as spam (B06), Reply sent. AR: "بواسطة قاعدة سير العمل QA WF B07", "تم تشغيل قاعدة سير عمل … الإجراءات مشاركة التذكرة". PASS | f4-history-b07*.png |
| Email action with Desk template | Rule with template, no subject/body → 201, saved subj/body empty; ran: agents_emailed 1, contact_emailed true (#612). Saved action same → 201; used in rule → contact_emailed true (#615). Team / Role recipients accepted. Without template still needs subject + body (400). System template "system.ticket.acknowledgement" is not a Desk template (400 for contact). PASS | r1/r2/r3 outputs |

## Developer claims checked
- On Edit rule on brand-new ticket: new ticket, 20 s, no fire; real edit → fired. Claim holds.
- Untrusted replies: by design (developer); A1 uses a trusted Gmail sender.

## Regression (items that passed in r5)
A2 fired on agent reply · A3 public-only: private comment no, public yes · D3 Any fired on 1 field; 4th field refused ("at most 3 fields") · D4 All: 2 of 3 no fire, 3 of 3 fired (D4all) · E1 Contact · Title Y/N ok, Account · Account Name Y/N ok (Account description rule had no data — account description was not stored on create) · E2 business hours yes / outside no / holiday no · E3 picker 82 fields, all 24 listed fields offered, Created By + Is Overdue ok · E4, E5, E5n, E6 Y/N ok · F1 saved comment ran · F2 HR ticket fired, CS not · F3 All 32 / Active 31 / Inactive 1 after deactivating QA WF A2 · B1, B2, B5, B6, B7, B8, B11, B12 done · B13 changed:false, B14 nobody_online (as r5) · B15 contact title set (with a contact).
B09 Run Custom Action: not re-run — no custom action / API source on staging any more (r5's source deleted); tracked under NDC-1989.

## Also seen (new)
1. Saving a ticket that a rule moves to a team the saver is not in answers 403 "Permission denied." (toast on the New Ticket form, stays on the form) although the ticket IS created / the edit IS saved (#616, #617 via form; #605, #650 via API). Risk: duplicates.
2. "Workflow rule ran" history row missing when the rule's condition uses Execution Time or Is Overdue (E2in, E3od, E3odT, E3odF): the comment says "by workflow rule …" and Execution History has the run, but no "Workflow rule ran" row. Rules on Contact / Created By / description conditions have the row.
3. History "Department changed" shows the raw department id (7e1ac409-…) instead of the name (EN and AR).

## Waiting
- A4 Incoming: user to reply from mahmoud.mmohamedsamy@gmail.com to "Fwd: QA WF A4 ticket" (#592).
- A1 Customer Reply: user to reply from mahmoud.mahamed1515@gmail.com to "QA WF A1 ticket" (#648).

## Investigation of "Also seen" (27 Oct, user: 1 investigate more, 2 investigate more, 3 file if it exists)
### 1. False "Permission denied." — general, not rule-specific
- Admin (mahmoud.mahamed1515) is not an agent of Customer Support; sees own + unassigned tickets only.
- No rule: API create with owner = another agent (#671) → 403, ticket created; API create with team, no owner (#672) → 403, created.
- New Ticket form, no rule, owner = Customer Experience Specialists 2 (#675) → toast "Permission denied.", form stays open, ticket created.
- Same form saved twice → 403 + 403 → two tickets #676, #677 (duplicates proven).
- Control: form without owner/team (#657) → 201, opens the ticket.
- Rule "Assign to team" on Create (sync action, team set in the create row) → 403 (#605, #616, #617, #658). Rule "Assign to specific user" (applied 0.5 s after create) → 201 (#673), creator silently loses access, no message.
- Edit: rule moves the ticket to a team on edit (#650) → 403 though saved.
- Conclusion: POST/PATCH answer 403 whenever the saved ticket is no longer visible to the saver; the write is committed.
### 2. Missing "Workflow rule ran" row — Create rules with computed "rule facts"
- Facts in the bundle: threadCount, commentCount, recentComment, recentCommentType, isOverdue, executionTime.
- Create rule, same action, only the condition differs (waited 45–60 s): no condition #651, description #652, Due Date < now #655, Status #668, Priority #669 → row written. isOverdue #653, executionTime #654, recentComment #661, description AND isOverdue #662, threadCount #666, commentCount #667 → rule Fired (Execution History, comment "by workflow rule …") but NO row.
- Edit rule with isOverdue (#665) → row written.
- Execution records identical between with/without row (no field explains it).
### 3. Raw department id — exists now (re-checked #657 EN + AR); move rows show names (#656). Filed as new bug (see new-bug.json).
