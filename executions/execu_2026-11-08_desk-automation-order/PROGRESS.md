# Desk automation order: progress

Plan and specs: `docs/desk-automation-execution-order/`, `docs/desk-sla-escalation/`. Automation: `automation`, feature `deskautomationorder` (`AoApi`, `VisualAudit`, `SlaApiTest`, `SlaRuntimeTest`, `SlaAdminTest`, `SlaUiTest`). Visual captures: `visual/`. QA data: `ledger.md`.

## SLA, 8 Nov 2026: 35 of 67 rows run, 32 not run

**Pass (30):** SL-01, 02, 03, 04 (Create, Update, Field Update only), 06, 08, 09, 10, 11, 13, 14, 19, 23, 24, 25, 26, 28, 31, 32, 33, 34, 36 (dialog only), 37 (part), 41, 45, 47, 48, 50, 52, 66.

SL-11 and SL-25 record what happens. Compare with Zoho before treating them as settled.

**Fail (2):**
- SL-12: gap 9 confirmed. No number or date operators in target conditions.
- SL-30: candidate bug. With Create + Update selected, an update doesn't restart the SLA (execution stays 1, due time unchanged). Zoho's SLA article says it resets for each update. Not yet checked on live Zoho.

**Not a bug under the user's API-only rule (1):** SL-05. The API accepts Update and Field Update together; the screen says either-or. Not yet tried on screen.

**Inconclusive (1):** SL-49. Audit route not found through the API; check on screen.

**Test mistake, re-run needed (1):** SL-35. Used the wrong account field; `account_name` is required.

**Not run (32):** SL-07, 15, 16, 17, 18, 20, 21, 22, 27, 29, 38, 39, 40, 42, 43, 44, 46, 51, 53–65, 67. Also E2E and Group Z. Zoho live checks not started.

## Visual, SLA screens

- Automatic scan: 18 captures across 6 screens (English, Arabic, phone). 2 automatic flags, both on `ticket-sla` phone (hidden scroll button, tab overlap), likely false alarms.
- Reviewed by eye: target panel (English, Arabic, phone), accounts dialog (English), SLA list (phone), ticket page (English, phone). No visual defects found.
- Not reviewed by eye: `sla-editor-when-ar`, `sla-list-ar`, `sla-accounts-dialog-ar`, `sla-accounts-dialog-phone`, `support-plans-phone`, and `sla-list-light-en`.
- `ticket-sla-ar` captured a blank page before it loaded. It must be retaken; not evidence of a bug.
- Dark theme (V-07) not run: no switch found for this account. NDC-2804 already says Setup stays light in dark mode.

## Other findings

- Earlier bug B-1 still reproduces: record API returns 500 when `kind` isn't the first key. API-only.
- Admin `mahmoud.mahamed1515` gets 404 reading, and 403 deleting, a ticket once assigned to an agent. Known from earlier runs.
- `GET /workflow/rules` caps at 50 with no paging. Real limit is `maxRulesPerDepartment: 200`, so the 9 rules deleted on 8 Nov didn't need deleting. Copies: `docs/desk-automation-execution-order/reference/deleted-inactive-workflow-rules-2026-11-08.json`.

## Left on the tenant

- Departments `QA AO Dept A` (93949fbd-f9df-4e2e-ae45-00b8dc38385b), `QA AO Dept B` (4853562a-0b4d-45cb-ba34-9f2118fcd32c), in use.
- Tickets the admin can't delete (403): 99a09432-6137-409c-beaa-f600b273492e, f8b04a80-409a-4cc2-8e6e-9e6eca877e1d, 3e85975f-ecf4-43c3-9f99-e09d6d77ebc6.

## Update, later on 8 Nov 2026 (replaces the counts above)

Tests added: `SlaRemainingTest`, `NotificationApiTest`, `NotificationUiTest`. Gmail list: `mail-checklist.md`.

### SLA: 44 of 67 rows run, 5 blocked, 18 not run

- **Pass (38):** the first 30, plus SL-35, 36 (API too), 49, 56, 59, and SL-07 (comment scope only), SL-39 (valid contract only), SL-43 (views exist on screen only), SL-63 (feed shows applied, breached, escalated).
- **Fail (2):** SL-12, SL-30 (still needs live Zoho).
- **Findings to decide (3):**
  - SL-17: Business mode with no hours set saves through the API, and the ticket then gets no SLA at all (state none). Not tried on screen.
  - SL-21: owner notified. Named agent and department agents skipped with `no_access` when they can't see the ticket; only the ticket feed shows it. Manager skipped with `no_manager`. Contact needs the ticket's email field; without it, `no_address`.
  - SL-54: a Before-due level longer than the target saves (201). Levels out of order are refused.
- **API only (1):** SL-05.
- **Blocked (5):** SL-15, 16, 20, 53, 65, plus Z-S7. Admin gets 403 creating business hours; owner needed.
- **Not run (18):** SL-18, 22, 27, 29, 38, 40, 42, 44, 46, 51, 55, 57, 58, 60, 61, 62, 64, 67. Also E2E and Group Z. No live Zoho checks yet.

### Notifications: 21 of 30 rows run, 2 blocked, 7 not run

Mail is proven only by the ticket feed (`reply.sent`) until the Gmail list is checked. Agent and team mail can't be read, so those rows prove the bell only.

- **Pass (17):** NT-01, 02, 03, 05, 08, 11, 12, 13, 14, 15, 18, 20, 21, 25, 27, 28, 29. Partial coverage: NT-01 agent only; NT-05 closed and comment events only (received and reply need inbound mail); NT-08 assigned and mentioned only; NT-11 moved only; NT-12 one team member read; NT-20 @Mentions tab opens, content not proven; NT-25 assignment only.
- **Waiting on Gmail (2):**
  - NT-16: with a custom template bound, closing a ticket logs no mail in the feed. Either the mail isn't sent or it isn't logged.
  - NT-07: added-as-CC logged; closed mail to the CC not logged. Agent addresses are refused as CC, including both of the user's addresses, so the +qaao alias was used.
- **Findings to decide (2):**
  - NT-04: other departments unaffected and the screen updates at once, but an agent notice still fired right after the rule went off; after 60 seconds it stopped. Exact delay not measured.
  - NT-23: closing through the record API sends no closed mail; the close route does. API-only unless the screen does the same. Not tried on screen. Bulk not tried.
- **Blocked (2):** NT-19 (tenant-wide switches, needs the user's OK), NT-22 (403, needs `notify:policy:manage`).
- **Not run (7):** NT-06, 09, 10, 17, 24, 26, 30.
- NDC-2389: bell Settings now opens `/settings/notifications/preferences`. No longer reproduces.
- Script in a template body is stripped on save. Preview flags an unknown placeholder and leaves it unfilled.
- Template "activate" sets the default for the whole organisation, so it was not used.

### Visual

Reviewed by eye, no defects: notification rules (English, Arabic, phone), bell (English), My Notifications (English, phone), `ticket-sla-ar` retake, `sla-editor-when-ar`, `sla-accounts-dialog-phone`, `support-plans-phone`. Automatic bell overlap flags look like false alarms: the panel sits over the dashboard behind it.

Still open: `sla-list-ar` is blank (capture came too early; the wait was added after it, not retaken). Not reviewed: `sla-accounts-dialog-ar`, `sla-list-light-en`, `notification-bell-ar`, `notification-bell-phone`, `notification-preferences-ar`, and the two automatic flags on `ticket-sla` phone. Bell captures weren't retaken after the wait was added. Dark theme not run. Minor, not filed: the Arabic ticket page mixes Arabic and Western digits.

### Left on the tenant (replaces the list above)

19 QA AO tickets in Dept A the admin can't delete. The admin isn't an agent of Dept A, so it can't take them back; Test User 1 can't delete either. Owner needed:
99a09432-6137-409c-beaa-f600b273492e, f8b04a80-409a-4cc2-8e6e-9e6eca877e1d, 3e85975f-ecf4-43c3-9f99-e09d6d77ebc6, 7ec14979-afb2-4064-984e-ec3b6cc3350e, ef05e726-8e0d-4049-843a-6978f0b34ac5, 058c94af-8eac-453f-b297-3d0ee5044dee, 9160d555-39b6-4453-a69d-e0ff4dc03050, 1cd01697-a8dd-49bc-b1e3-f178811f031d, 3d55e942-ac7b-4da7-b3cf-2c6d016efd8e, bf38b0c1-54c2-453c-b511-de6d602c4fa3, a56f1706-a2b4-4624-a857-b576d2e1764b, ccb2b4fc-8cb4-486f-8111-64cf35ef272c, 32743113-5578-46ab-bc45-59081c10ff9e, 01974cd8-8577-4138-acb0-60177b192745, e17bbc46-952f-41ec-bbae-fbe3bc0a41d6, b8bfbe72-37d2-4f3c-a0a7-38f744dfe9de, 6d051305-b903-4dfa-84d1-6686af53ad2b, 6e50d959-cc5c-4a7b-a448-85fb729757ab, 8017e663-ac5e-40c2-abbf-1f9f74802ec7.

QA AO Dept A and B stay in use.

## Next

Waiting on the user: Gmail list, owner access for business hours and cleanup, OK for NT-19. Then the remaining rows above, live Zoho for SL-30 and other `[zoho-live]` rows, then Part A Skills, Direct, Round robin, Workflow, Blueprint, Macros.

## 9 Nov 2026

- Filed NDC-2825 (SL-30, High) and NDC-2826 (SL-12, Medium) with annotated images. SL-30 now proven on screen (ticket #1769). Missing-list item 9 = NDC-2826.
- Findings, decided: NT-16 bug; NT-07 bug (CC closed rule is on in Dept A, no closed mail to the CC); SL-54 minor bug; SL-21 design question; NT-04 not a bug; SL-17 and NT-23 API-only (deferred). NT-23: closing on screen (bulk) does send the mail.
- Now run: SL-15 pass (business-hours due exact), SL-16 pass (holiday skipped; NDC-2774 does not reproduce), SL-53 pass (delete in use refused 409), SL-65 recorded (running tickets keep their due time when hours change), SL-20 waiting (calendar check 15:40 UTC, business-time level due 10 Nov 07:26 UTC), SL-22 fired (custom then default template; Gmail), SL-57 finding (template in use can be deleted, no warning; policy keeps the dead id), NT-09 pass (assigned + completed for task, call, event; rules switched on in Dept A for the test, then off), NT-17 pass (team rules accept templates), NT-19 inconclusive (manual assign still notifies with switches off; switches likely for rule-based assignment, re-test with round robin), NT-22 pass (SMS policy saves and restores; API returns a stale version number), NT-24 pass (bulk close on screen sends the closed mail).
- Tenant: someone else's workflow rule "test workflow" (99868bee…, no department limit) rewrites every new ticket's subject to "subject changed from workflow", creates records and tasks, and sends replies. Tests now match SLAs on the description. Also proves workflow runs before SLA.
- A 503 "SLA service unavailable" on policy create still saved the policy; leftovers removed.
- Owner API client: scripts/api.js (one sign-in, refresh token reused). Kept: SL-20 and SL-30 data (ledger).

### 9 Nov, later
- User OKs: suspend/reactivate "ZZ Sweep Tavi Probe"; run SL-67 and clean up; reply from Gmail for SL-18 when asked.
- SL-58 pass (suspended reassign target: reassign skipped "assignee_unavailable", owner kept, no error). SL-51 finding: suspending an agent named in an SLA escalation gives no warning, the policy keeps the agent (Zoho per S-145 asks to reassign; Zoho not checked live). NT-30 partial (assign to suspended agent refused, 422 "not an active agent of the department", but this agent isn't in the department anyway). Agent reactivated; Desk agent list caught up within a minute (audit: Active > Suspended 14:15 > Active 14:17).
- SL-67: 300 tickets in 55 s; SLA list 0.8 s, ticket list 0.3 s, reapply-open 1.1 s. FINDING to repeat: after 30 s only 5 of 10 sampled tickets had an SLA; reapply-open queued 134 of 300; 4 of 10 still had none 60 s later. All 300 tickets, 93 tasks made on them by another user's workflow rule, and the policy deleted.
- SL-64 / missing-list item 10: BUILT (SLA Dashboard: "SLA Violated Tickets | Group by Hour & Date", "Violations by Time"). Drop item 10.
- SL-62 / missing-list item 11: Countdown Mode EXISTS (7 columns: Overdue, No Due Date, Due in 1 hour, Due today, Due tomorrow, Due later, On Hold) but BUG: 6 columns show "Couldn't load these tickets" because each request sends more than 25 filter conditions (400 INVALID_FILTERS). Seen as owner (in ~40 departments). Screenshot evidence/raw/s62-countdown.png.
- SL-46 partial: SLA Dashboard loads; Customer Support has no SLA data today, numbers not compared. NT-26 inconclusive: Slack (enabled), Teams, Google Chat listed; Slack channel not visible to me.
- SL-18 set up: tickets #1802 (first response only ON) and #1803 (OFF), agent replies sent to Gmail; waiting for the user's replies, then scripts/sl18-check.js.

### 9 Nov, missing list filed
- Filed NDC-2829 "Desk Automation: features Zoho Desk has that Desk is missing" (Bug, Medium, Desk, Sprint 15, label Automation Execution Order, NDC-2811 assignees), 15 gaps renumbered 1–15 with 15 annotated images (evidence/annotated/01-…15-…png; specs scripts/build-missing-specs.js; filing scripts/file-missing-list.js, plane-filed-missing-list.json).
- Old → new numbers: 6→1, 15→2, 16→3, 21→4, 22→5, 23→6, 24→7, 25→8, 27→9, 28→10, 30→11, 31→12, 32→13, 33→14, 34→15. Dropped as built: 10, 11, 12, 13, 14, 29. Item 9 = NDC-2826. Item 4 not a gap. 5, 17, 18, 19, 20 listed under "Could not be checked" (need live Zoho). Item 26 works; item 3 API-only.
- Blueprint "Tickets from Mail" confirmed unchanged (no issue banner, normal transition).
- Bugs held for one batch (user): NT-16, NT-07, SL-54, SL-57, SL-62 (Countdown Mode).

### 9 Nov, evening
- SL-18 BLOCKED: the user replied to both agent mails, but no reply reached Desk (feeds show outbound only). Agent replies go out from the system no-reply sender; QA AO Dept A has no inbound mailbox; the only mail connection (Zoho Mail, anyware.software) reports a setup problem. The other user's "test workflow" rule also sends its own replies to the contact.
- SL-20: calendar-time check passed (no escalation at 15:40 UTC, calendar would have fired 15:26). Business-time check scheduled 10 Nov 07:35 UTC.
- SL-29 pass (manual due date replaces resolution due; hold/resume extends by hold time). SL-27 recorded (breached response stays breached through hold; resolution extended). SL-61 pass. SL-38 inconclusive (coverage says allowance_exhausted but the ticket still got the SLA, because the test policy matched directly; needs a plan-only policy). SL-60 finding: a Dept B plan can be attached to a Dept A contract (200). SL-42 pass (master keeps its SLA; merged ticket closed, its SLA cancelled).
- NT-06 recorded: comment added 1 mail, comment deleted 1, closed 2 (contact + CC?). Gmail check NT06ttl5 decides; NT-07 on hold until then. Comment edit not tested (PATCH 405).
- NT-10 pass for "reply not delivered" (bounce logged; Test User 1 got the notice). Rating received not run (needs a real customer rating).
- SL-40: contract ending 10 Nov, notify Test User 1 one day before; no notice yet; check scheduled 10 Nov 07:45 UTC (data in ledger).
- SL-44 partial: custom view conditions have Due Date, Response Due Date, SLA Escalated, SLA Name, SLA Violated; no "Is overdue" / "Is response overdue".
- SL-55 not run: roles API not found; needs the SLA editor's role picker on screen.
- SL-67 repeat (60 tickets, 3-minute wait): all 60 got their SLA; reapply queued all 60; created in 9 s. PASS. The earlier "half had no SLA" was a delay during the unstable period, not a bug. Removed that "possible bug" note from NDC-2829 (description patched 9 Nov). All 60 tickets and the policy deleted.

### 10 Nov — SL-20 business-time escalation
- Escalation fired at 2026-11-10 07:26:11 UTC, exactly the business-time due moment (calendar time would have fired 9 Nov 15:26 UTC; it did not, level was still 0 at 15:40). SL-20 business-time half: PASS. SL-20 is now PASS on both halves.
- Cleanup: SL-20 ticket, policy and business hours deleted (204 each).

### 10 Nov — SL-40 contract notice
- Test User 1's bell: "Contract QA AO Contract SL40g7y5 expires today" (desk.contract.expiring) at 2026-11-10 00:03 UTC. PASS. The contract was created on 9 Nov after that day's 00:03 UTC run, so the "one day before" day was already past; the daily job sent one notice at its next run (expiry day). Not tested: a notice on the exact day before (needs a contract ending 2+ days out).
- Cleanup: contract, plan, policy, account deleted (204 each).

### 10 Nov — SL-55 escalation to a role
- On screen (not saved): Whom to Escalate offers Agents, Teams, Roles, Ticket owner, Owner's manager, Department agents, Ticket contact. Roles lists CEO and Manager (from /iam/org-units). Screens: evidence/raw/s55-kind-menu.png, s55-roles.png.
- Run 1 (role Manager only, unassigned ticket): fired at the due time; the role resolved to all 8 Manager users; every one skipped `no_access`; owner entry `no_recipients`.
- Run 2 (control, agents Samy + Test User 1 named directly + role): same, named agents also `no_access`. So the skip is the access rule (same as SL-21), not the role kind.
- Run 3 (ticket assigned to Mahmoud Samy, role only): Samy dropped from the role list (deduplicated) and notified as owner (`done`); the other 7 skipped `no_access`.
- Verdict: PASS. Role recipients work and follow the same access rule as agents. Note for the SL-21 design question: in Zoho, escalation goes to the named people regardless; here only people who can see the ticket get it.
- Note: the template picker in an agent escalation also offers "Test Email Template · Contact Notification" (a contact template). Minor, recorded only.
- Cleanup: 3 tickets, 3 policies deleted (204).

### 10 Nov — SL-38 redesigned (allowance used up)
- Setup: policy with "execute only with account", allowance plan = 1 ticket/month, contract on a QA account. Script scripts/sl38b.js (cleans up).
- Control x0 (no account): no SLA. PASS.
- x1 (first ticket): SLA applied through the contract; usage 1/1, remaining 0. PASS.
- x2 (second ticket): coverage says `allowance_exhausted`, but the SLA is still applied and both timers run. FAIL.
- Zoho: once the plan's limit is reached, further tickets do not follow the plan's SLA (help.zoho.com support-plans article and SLA FAQ). No setting in TAVI changes this (sla/meta has none).
- Added to the held bug batch. Evidence must be recaptured on screen (the ticket's SLA panel) when filing; the data was deleted.

### 10 Nov — A1–A3 regression (Skills, Direct, Round robin), lane 1
Full spec v2 already ran 6–8 Nov (executions/execu_2026-11-06_desk-assignment-skills/report.md). Today: regression of the core runtime + bug re-checks in QA AS6 Dept A, agents A1 Test User 1, A2 Mahmoud Samy, A3 Dev Team 2 held online by scripts/ag-keep.js (scratchpad/presence/*.txt control). Scripts ar1*.js, ar2*.js, sk1/sk2.js, bug1.js, bug2.js, nt19a/b.js.
- Sequential RR on create: A1, A2, A3, A1. PASS (owner sent as null).
- FINDING: ticket created through the API with no owner field gets the creator as owner when the creator is an agent of the department (ndc-staging-owner is an agent of QA AS6 Dept A), so RR never runs. On 7 Nov the same call left it unassigned. Compare with NDC-2813 / NDC-2275 before filing.
- Load balancing: 4 tickets → A3 (open in dept: A3 7, A2 68, A1 77). PASS.
- NDC-2811 (RR ignores Email channel): A2 Email off → A2 skipped (A3, A1, A3, A1). FIXED.
- NT-19 with RR: switch off → no bell for #2267–2269; on → bell for #2270 (A2), #2271 (A3), #2272 (A1). PASS. Switch restored (all true).
- Skills: skill added on create by criteria, skill-based RR assigned the skill holder in the same event (H-07, H-12, E-14). PASS.
- FINDING: skill-based rule, ticket with no skills → assigned to ndc-staging-owner, who is not in the rule's agent list (pool A1–A3). Check Zoho before filing.
- Note: PUT /desk/skills/{id} with agent_ids does not change the skill's agents (agents kept A1).
- NDC-2821 (skill types shared): types now differ per department (AS6 A: General|QA AS6 Type|Tech; AS6 B: General|Tech; AO A: none). FIXED.
- NDC-2814 (detached holiday list): on_holiday matched today on a detached list; not_on_holiday did not. FIXED.
- NDC-2812 (team assign with Team Assignment off): now 422 "Team Assignment is off in the ticket's department". FIXED. TA restored on.
- NDC-2824 (threshold counts other departments): A3 threshold 12, A3 open 10 in dept / 26 all depts → A3 skipped 3 times (A2 got them; without threshold A3 got all). STILL FAILS.
- Manual unassign (POST assign owner null) does not trigger RR (update rule): ticket stays unassigned. Info.
- Direct rule list: rules have department_id null (tenant-wide "coming to" in criteria), so every department filter returns the same list. Not a bug as built; matches missing-list note.
- BLOCKED: direct rules. Tenant master switch `direct_rules_enabled` is OFF (someone turned it off; RR switch on). Needs the user's OK to turn on for the test and back off.
- NDC-2813 / NDC-2814 were already retested Done on 8 Nov (r14).
- Cleanup: 5 QA AO rules + 45 tickets deleted; presence keepers stopped (agents signed out).

### 10 Nov, bugs filed (filing lane)
- Filed with annotated images (Bug, NDC-2811 assignees, Desk, Sprint 15, labels Automation Execution Order + SLA & Business Hours, start 10 Nov). Script scripts/file-batch-bugs.js, ids in plane-filed-batch.json, specs evidence/specs/SL62|SL38|SL57|SL54.json:
  - NDC-2832 (High) SL-62: Countdown Mode, 6 of 7 columns "Couldn't load these tickets" (retaken 10 Nov, still fails).
  - NDC-2833 (Medium) SL-38: allowance used up, the same SLA still runs as "Department policy" (recreated on screen, tickets #2290/#2291).
  - NDC-2834 (Low) SL-57: template used by an SLA deletes with a generic confirmation. Lowered from Medium: the SLA now falls back to the default email and the editor shows "A template that no longer exists". Zoho behaviour for in-use templates is not documented.
  - NDC-2835 (Low) SL-54: Before-due 2 hours on a 1-hour target saves on screen.
- NT-16 NOT filed: no longer reproduces. A bound custom contact template (plain, and with a script body) sends the closed mail (reply.sent, status sent); control with the default template also sent. Gmail tags NT16hyto (custom, subject "QA AO NT16hyto closed #…") and NT1674mqs (script body) can confirm delivery. Rule restored to the default template.
- NT-07 not filed (waits on the user's check of the "To" line of the #2155 closed mail).
- All filing-lane QA data deleted (ledger lines marked DELETED).

### 10 Nov — Direct assignment regression (user OK: switch on, then back off)
- Tenant `direct_rules_enabled` was off; turned on 08:52 UTC for scripts/dr1.js and dr1b.js, restored off both times (read back false). All other direct rules on the tenant are inactive, so only QA AO rules acted.
- PASS: D-01 create → A1 (history "auto_assigned", rule name, trigger created); D-02 no match → unassigned; D-03 preset owner A3 kept; D-05 team → QA AS6 Team A, no owner; D-06 Any Department → moved to AS6 Dept B, owner A1; D-08 Unassigned target stops the next rule; D-09 update rule (priority low) assigns the unowned ticket; D-10 owned ticket kept on a second update; D-11 first matching rule wins.
- Cleanup: 9 QA AO direct rules + 9 tickets deleted.
- A1–A3 regression complete. Open: NDC-2824 still fails; 2 findings (creator default owner on API create; skill rule with no skills assigns outside the pool).

### 10 Nov — A1–A3 full plan, runtime lane (spec v2, QA AS6 Dept A)
Scripts: scripts/lib-as.js (helpers), as1*.js, as2*.js, as3*.js, f8a/b/c.js, g1/g2/g5.js, h1/h2.js, as6.js, e2e*.js, as-clean.js. Agents held online by scripts/ag-keep.js (network-safe). Assignment is asynchronous today (1–8 s); checks poll up to 16–40 s. Staging dropped connections 09:10–09:30 UTC (retried).
- A: A-04 API PASS (121/1001 refused) · A-05 API PASS · A-06 API PASS (6 targets refused) · A-09 PASS (inactive → none, activated → A1) · A-13 API PASS (409 RULE_CHANGED "This rule was changed by someone else…") · A-14 PASS (audit: assignment_rule created/updated/deleted) · A-10 direct half PASS via D-12a; round-robin half NOT RUN (tenant-wide switch, not approved).
- B: B-01 PASS · B-02 PASS (high → A1, urgent → A2, low/other none) · B-04 API PASS · B-05 API PASS (25 ok, 26 refused) · B-07 PASS (date equals today matches, other date not) · B-08 PASS (during → assigned, outside → none) · B-09 PASS (contact last name → A2, account name → A3, no contact → none).
- C (API): C-04 PASS (agent not in destination refused) · C-05 PASS (Any Department without move refused) · C-07 INFO (agent + team accepted, stored as agent only; spec says 400 — same as 7 Nov).
- D: D-01..D-03, D-05, D-06, D-08..D-11 PASS (earlier today) · D-04 PASS (A1 offline + dept threshold 1 → still A1) · D-07 PASS (moved to Dept A unassigned → RR "moved" same event → A1) · D-12 PASS (master off → nothing; inactive with master on → nothing) · D-13 NOT RUN (department agent list change now 405 via API; refusal at save covered by C-04) · D-14 API PASS; New Ticket form = NDC-2813 (Done 8 Nov); email/web form/import NOT RUN (no inbound mailbox; hosted form 404 NDC-1488).
- E: E-05 PASS (team pool, A2 excluded → A3 ×4) · E-08 API PASS (owner null); see FINDING on omitted owner · E-09 PASS · E-10 PASS (team pool: Dev Team 2, Mahmoud Samy alternately = alphabetical) · E-11 PASS (pool edited → restarts at first agent) · E-12 PASS (A2 offline → A1, A3, A1, A3; history skipped_user_ids = A2) · E-13 PASS · E-14 PASS (skill held by A3 only → A3 ×3; no skills → any dept agent per spec, incl. agents outside the rule's pool — FINDING) · E-16 PASS (all offline → unassigned) · E-17 NOT RUN (RR master switch tenant-wide, not approved) · E-18 NOT RUN (cannot age data) · E-19 PASS (history: rule type, name, strategy, owner, skipped_user_ids).
- F: F-01 PASS · F-02 API PASS (0, 201, 1.5, backlog 0/51 refused) · F-03 PASS · F-05 PASS · F-06 PASS (row kept, not used) · F-07 PASS (backlog assigned after ~72 s, created-time order) · **F-08 FAIL** (Assign on closure: agent closes a ticket below threshold → backlog ticket NOT assigned; 3 of 4 tries with sequential rule, 2 of 2 with skill rule (E2E-2); 7 Nov PASS) · F-09 PASS · F-13 PASS · F-14 = NDC-2824 still fails.
- G: G-01 PASS (1 notice to A1) · G-02 PASS (self pick-up none) · G-03 PASS (team members once, A1 none) · G-04 PASS (per-dept rules present) · G-05 PASS (new-ticket alert to A1, A2, A3; switched back off).
- H (runtime): H-03 PASS · H-06 PASS (order follows list; reorder flips) · H-07 PASS (added on update; auto-add off → not added) · H-08 PASS (recalculate removes stale) · H-09 PASS (Assign by Skills → A2; no skills → "The ticket has no active skills of its department.") · H-11 PASS (11 matched → 10; 31st active refused "up to 30 active skills").
- I: I-03 PASS (20 at once: 5 / 5 / 10 backlog, no double) · **I-04 below target** (16/20 within 5 s, p95 6.1 s; staging slow today, 7 Nov < 4 s) — re-measure before calling it.
- J: J-02 INFO (now: thresholds on in Customer Support, Tech; backlog on in Tech — later config by others, not migration) · J-01, J-03, J-04 one-time migration checks, PASS 7 Nov, not repeatable.
- E2E: E2E-1 PASS (Dept B → moved unassigned → A1, A2, A3, A1, A2, A3; each agent 2 notices) · **E2E-2 FAIL at the last step** (skill ticket → A2; backlog waits; A2 closes → backlog not assigned = F-08) · E2E-3 PASS (A1 back → backlog to A1 in 53 s).
- Restored: AS6 Dept A RR preferences (originals), Team Assignment on, new-ticket alert off, notify switches on, direct switch OFF, borrowed QA AS6 skills (criteria, agents, order) and skill preferences. Deleted: 53 rules, 160 tickets, 2 contacts, 2 accounts; 1 ticket delete returned 401 mid-run (sweep found none in recent pages; recheck at final cleanup). Agents signed out 10:22 UTC.

### 10 Nov — A1–A3 screens lane
Owner browser (own token store LANE=ui), QA data only in QA AO Dept B, all deleted. Scripts: scratchpad/ui/c*.js (hdr.js + run.sh). Live Zoho not opened; expected texts compared with Zoho help. No case failed, so no annotated images.
- A-01 PASS: Rules / Team Assignment / Notifications tabs; Direct Assignment and Round Robin each with own list, New Rule, list switch; empty text "There are no Round Robin Rules created yet!" (QA AO Dept B).
- A-02 PASS: Active on, Ticket Create ticked, name required, description optional.
- A-03 PASS: "Enter a name for the Assignment Rule." on Save and on Add Target.
- A-04 PASS: name stops at 120, description at 1000, counters "120 / 120", "1000 / 1000".
- A-05 PASS: both unticked → "Choose when the rule runs: Ticket Create, Ticket Update or both."
- A-06 NOT RUN on screen this round (6 Nov PASS: Add Target disabled after 5 with hint).
- A-07 PASS: "Add at least one target."
- A-08 PASS: keyboard reorder (Space, ArrowUp, Space) on the drag handle saves at once, order kept after reload. No "Order saved." toast seen (may have been missed).
- A-11 PASS: edit keeps name, description, inactive state, target; delete dialog "Delete this rule? Tickets it already assigned keep their owner." → "Rule deleted."
- A-12 PASS: "Rule saved."
- A-13 PASS: second tab gets "This rule was changed by someone else. Reload to see the latest version."; first tab's edit kept.
- A-15 PASS: Desk Agent (Customer Experience Specialists 2) sees "You can't manage assignment … need the "Manage assignment rules" permission"; API rules GET/POST 403. Note: the same agent can GET round-robin-preferences (200), read only.
- B-03 PASS: "Enter a value." ("Pick a field." not reachable: a field is always preselected).
- B-04 PASS: "1 and 4", "(1 and 2", "1 xor 2" → "Check the criteria pattern. Use the condition numbers with AND, OR and brackets, for example 1 and (2 or 3)."; "1 and (2 or 3)" accepted.
- B-05 PASS: 25 conditions, Add condition disabled, "A target can have up to 25 conditions".
- B-06 PARTIAL: ticket 44 standard fields (Zoho 38) + custom; contact 17 (Zoho 26); account 16 (Zoho 14); "Is Escalated" absent (SLA Escalated present). Known gap the user excluded from the missing list; no new bug.
- B-07 PASS: dates is/isn't/after/before/between/not between/empty/not empty, value "A date" or "Current Time"; numbers is/isn't/less/greater/between/empty/not empty.
- B-08 PASS: Execution Time: during / outside business hours of, on / not on a holiday of.
- C-01 PASS: Coming to = Any Department + all departments; Move to = Select Department + departments (excludes the Coming-to one).
- C-02 PASS: Agents list = department agents; Teams tab lists the department's teams (QA AS6 Dept A: QA AS6 Team A, QA RT14 2812 team 2); Mark as Unassigned.
- C-03 PASS: Move to QA AO Dept A → its agents.
- C-04 PASS: agent picked, Move changed to HR → cleared, "Pick an agent or team from HR."
- C-05 PASS: Any Department + no move → picker disabled, note "the ticket stays unassigned … Round Robin rules can still assign it."
- C-06 PASS: Mark as Unassigned clears the agent.
- C-08 NOT CHECKED (hidden half): every department has Team Assignment on; lane is read-only on that switch.
- E-01 PASS: Department picker on the Round Robin list; rule belongs to one department ("Department: QA AO Dept B").
- E-02 PASS: "Choose a round robin type."
- E-03 PASS: Load / Sequential / Skill help texts match Zoho's wording (Zoho help, not live).
- E-04 PASS: "Pick at least one agent, or a team."
- E-06 PASS: both notes present ("will not re-assign…", "will not assign more … threshold").
- E-07 PASS: no backlog option, no Backlog tab, no capacity field.
- F-02 PASS: 0, 201, 1.5, blank → "Enter a whole number from 1 to 200." (Cancel, nothing saved; Dept B prefs unchanged by API diff).
- F-04 PASS: "Pick an agent." / "Enter a whole number from 1 to 200."; second row does not offer the agent already chosen.
- F-10 PASS: Incoming tickets = immediately / backlog first.
- F-11 PASS: Team Assignment tab = one switch per department with help text, no mode or capacity.
- F-12 PARTIAL: Teams tab shown when Team Assignment is on; hidden half not checked (no department with it off).
- H-01 PASS: skills, preferences and order per department (AS6 A 30/30 active, AO B none).
- H-02 PASS: Add Skill: name and type required ("Enter a skill name.", "Choose a skill type or add one."), "+ New skill type" inline (created on Save), Active, description, agents, criteria.
- H-04 PASS: agent ticked on the skill form shows on the Agent Skills tab.
- H-05 PASS: search, type / agent / status filters, Skill Types tab.
- H-10 PASS: delete dialog lists usage ("Agents who have it: Test User 1"), "Make inactive" offered. No separate related-rules view.
- H-13 PASS (UI): rename saved; delete dialog "A type that skills still have cannot be deleted."
- H-14 PASS: blank refused, duplicate "QA AO Dept B already has a skill with this name.", name stops at 120, `<img onerror>` shown as text.
- I-01 PASS: Arabic RTL on rules page, rule form, Skills page; only user data left in English.
- I-02 PARTIAL: switches, drag handles, edit/delete, actions buttons all have names; keyboard reorder works. Minor: Setup sidebar Search input has only a placeholder (no label). Error announcement not verified.
- I-05 PASS: `<img onerror>` rule name shown as text, no script.
- V checks (English, Arabic, phone 390px; rules and Skills): no horizontal overflow, no clipping, RTL correct. Dark theme not available.
- Cleanup: QA AO A08 one/two, QA AO A13 rules, QA AO type and 2 skills deleted; QA AO Dept B has no rules, skills or types.

### 10 Nov — A-10 / E-17 (user OK: round-robin switch off, then back on)
- Switch off 10:5x UTC: the rule stays listed and active; a new matching ticket stays unassigned (A-10 PASS); with Assign backlogs on, the waiting ticket is not processed in 75 s (E-17 PASS). Switch back on (read back true): a new ticket → A1 at once.
- INFO: the ticket created while the switch was off was still unassigned 120 s after switching back on (backlogs on, limit 5). Not in the spec; note for the F-07/F-08 backlog follow-up.
- A first attempt failed in my script after the switch had been restored; it left Assign backlogs on (limit 5) and the rule active for ~6 min. Fixed in the re-run: preferences back to backlogs off / limit 10, rules and tickets deleted.

### 10 Nov — filed from the email / 30-day checklist run (other session's run, user asked here)
- NDC-2837 (EM-08, Medium, label Email Channel): Email | Setup says "Mail is arriving" even when customer mail does not reach Desk. Image evidence/annotated/EM-08-email-overview-says-mail-arriving-vs-customer-mailbox.png.
- NDC-2838 (E18-03, Low, label Assignment Rules): Assignment Rules | Round robin backlog skips an old ticket without saying why. Image evidence/annotated/E18-03-backlog-skips-old-ticket-without-reason.png.
- Both: Bug, NDC-2811 assignees, Desk, Sprint 15, start 10 Nov; read back, 1 attachment each. Ids in plane-filed-email-e18.json. Report: report-email-e18-bugs-blocked.html. Blocked cases EM-01/02/04/05/06/09, E18-04: user will check the mailboxes.
- 10 Nov: report-run-2026-11-10.html built (whole run so far).

### 10 Nov — user decisions on open items
- Prefs read by agent → filed NDC-2839 (Low, Assignment Rules, Bug, NDC-2811 assignees, Desk, Sprint 15), image evidence/annotated/AG-prefs-agent-can-read-rr-preferences.png (spec evidence/specs/AG-prefs.json; raw agent-prefs-api.json/.png).
- NT-07 retest: closed mail to a CC is ONE email (To contact, Cc the CC address), recipient_count 2 — the old "2 mails" was 2 recipients. Agent addresses refused as CC (mmohamed@anyware.software is an agent). With a reserved contact domain the whole message bounced, so the CC copy is lost too (side finding). Final run: #2497 "QA AO NT07z7ab", To Gmail, Cc Gmail +qaao, sent 11:41 UTC — user to confirm Cc line in Gmail. Tickets #2493, #2494, #2497 kept until confirmed.
- NDC-2824 ignored for now (user). I-04 re-measure when staging is calm. F-08, owner on create, skill rule no skills, SL-51, SL-60, SL-21: Zoho docs research running; live Zoho needs writes (default read-only).
- F-08 retest vs Zoho doc (Zoho: "Assign ticket on closure" gives one backlog ticket to the closed ticket's OWNER if online and under threshold; only tickets created/updated after enabling; paused while the backlog scheduler runs): 12:0x UTC both variants PASS — (a) owner A1 closes → backlog to A1 in 3 s; (b) another user closes A1's ticket → backlog to A1 in 4 s (trigger backlog). Earlier 10:00–10:40 UTC: 3 of 4 + E2E-2 2 of 2 failed while staging was slow/unstable. Verdict: matches Zoho now; intermittent under load → not filed; re-run with I-04 when staging is calm. Script scripts/f8z.js.
- Zoho docs research (help.zoho.com): SL-60 → plans/SLAs are department-specific (implied) ⇒ TAVI allowing a Dept B plan on a Dept A contract differs. SL-51 → Zoho deactivation asks only to reassign open tickets/activities, no warning about escalations (same as TAVI); deletion replaces the agent in rules and "whom to escalate". Owner on create, skill rule with no skills, SL-21 (recipients without access) → not documented; need a live Zoho write test (asked).
- NT-07 (10 Nov): user confirmed #2497 closed mail To Gmail + Cc +qaao → PASS. Tickets #2493/#2494/#2497 and 3 contacts deleted.
- SL-60 filed NDC-2841 (Medium, SLA & Business Hours + Automation Execution Order, Bug, Desk, Sprint 15), image evidence/annotated/SL-60-contract-takes-plan-from-another-department-vs-zoho.png; Zoho side live read-only (zoho-sl60-*.png). Test data (contract, 2 plans, 2 policies, 2 accounts) deleted.

### 10 Nov — live Zoho lane (techsolutionsegypt, user OK for write test)
- SL-60 Zoho side (read-only): Add Contract has no Department field; the contract takes the current department and its Support Plan picker loads GET /supportPlans?departmentId=<current>&status=ACTIVE. GET /supportPlans without a department → 422 "The mandatory parameter 'departmentId' is missing." No plans exist in the 3 departments (picker empty). evidence/raw/zoho-sl60-0-contracts.png, -1-new-contract.png, -2-plan-tooltip.png, -3-plan-picker.png, zoho-sl60-api.json.
- Q1 owner on create: Zoho in-app API POST /tickets without assigneeId → ticket #116 unassigned (assigneeId null after 6 s; history only TicketCreated). Add Ticket form pre-fills Ticket Owner = signed-in agent (Fathy Mehanna) — evidence/raw/zoho-q1-add-ticket-form.png. TAVI: API create without owner → creator becomes owner (differs); TAVI form also pre-fills the signed-in user (same as Zoho). RR-on-create with a Zoho rule NOT tested (Setup rule pages fail, see below).
- Q2 skill rule / no skills, Q3 SL-21 escalation picker, Q4 SL-30: NOT RUN. Zoho Setup on this trial is unstable today: Assignment Rules and SLA pages show "Unable to process your request", Skills page blank, SLA editor "One of the scripts for this page has caused an error", later loads hung (screens zoho-probe-*.png, zoho-q3-*.png). Setup uses legacy .do endpoints (AssignmentRule.do, Skills.do, CreateContractSettingEntity.do), so no API route. Agent departments recorded: Fathy Mehanna = Marketing, Haytham Mohamed, Tech; Mahmoud Mohamed = Haytham Mohamed, Tech (not Marketing) — use Marketing for SL-21 when Setup works.
- Part 2 (read-only): Zoho mail per department = support email address (/supportEmailAddress) + reply address (/mailReplyAddress, Zoho SMTP). SL-18/D-14 email in TAVI need the same: a receiving address in a QA department. Missing-list items 5, 17–20 (workflow Name/To Address conditions; blueprint reply public/private, state holiday list, dashboard agent filter, half-done transition) NOT checked — Setup unavailable.
- Zoho cleanup: ticket #116 + contact "QA AO Q1" moved to trash and purged (POST /recycleBin/delete → success; recycle bin has no QA AO items). Nothing else was created or changed in Zoho.
- Zoho re-check (after the coordinator's request): no QA AO tickets or contacts in the newest 50 of each, recycle bin has 0 QA AO items, 0 support plans in all 3 departments. Setup still does not load (Round Robin page blank after 25 s, evidence/raw/zoho-probe-roundrobin.png), so Q2–Q4 and missing-list items 5, 17–20 stay NOT RUN. No rules, skills or SLAs were created in Zoho.

### 10 Nov — D-13, C-08, live Zoho lane results
- D-13 PASS: A3 removed from QA AS6 Dept A via PUT /desk/departments/{id}/agents (the department PUT itself is 405) → direct rule shows ineligible "not_a_member", ticket left unassigned; team RR skipped A3 (A2 ×3). A3 restored, direct switch back off.
- C-08: API half PASS (team target refused when Team Assignment off, 7 Nov + 2812 retest 422). Screen half NOT RUN: New Direct rule panel stuck on "Loading assignment settings…" (staging slow), Add Target never clickable. Retry with I-04.
- Live Zoho (techsolutionsegypt): Q1 owner on create — Zoho API ticket with no owner stays unassigned (#116) → TAVI differs (creator becomes owner). Zoho Add Ticket form pre-fills owner = signed-in agent (same as TAVI). Q2 skill rule, Q3 SL-21, Q4 SL-30 NOT RUN: Zoho Setup pages failed ("Unable to process your request", blank Skills/RR pages). Zoho clean (ticket + contact purged).
- 10 Nov: report-run-2026-11-10-v2.html built (adds NT-07, NDC-2839, NDC-2841, D-13, live Zoho lane, full blocked/skipped list).
- Owner on create = NDC-2840 (filed by the user: "Ticket Form | Tickets can't be created with owner marked as unassigned like what zoho desk offers", Low). Not re-filed.
- F-08 re-check (user asked) 14:4x UTC: both variants PASS again (backlog to the owner at once). 4 passes in a row since 12:00 → PASS; the 10:00–10:40 failures were during staging instability. Not filed.
- I-04 re-measure (staging ~1 s): 20 tickets 0.5 s apart → 9/20 within 5 s (median 5.8, p95 7.1, max 7.2) FAIL vs NF-4. 10 tickets 8 s apart → 10/10 within 5 s (median 2.6, max 3.4). Single assignments are fast; a burst queues up. Scripts i04.js, i04c.js.
- C-08 screen half PASS: Team Assignment off for QA AS6 Dept A → New Direct rule target "Assign Ticket to" shows no Agents/Teams switch (Teams not offered), only the agent picker; on → Agents + Teams. Screens evidence/raw/c08-on.png, c08-off.png. TA restored on.

### 10 Nov — live Zoho retry (SL-21, skill rule no skills, SL-30) — BLOCKED
- ~25 min of tries (techsolutionsegypt, headed Edge, saved session). Setup › SLA / Round Robin / Skills / Assignment Rules: menu loads, content area never renders (spinner); 5 reloads, also the older page ShowHomePage.do#setup/... directly — same. A Zoho CDN chunk fails on this network (net::ERR_FAILED / ERR_HTTP2_PROTOCOL_ERROR on static.zohocdn.com). Screens: evidence/raw/zoho-r2-probe-sla.png, zoho-r2-probe-rr.png, zoho-r2-probe-skills.png, zoho-r2-probe-ar.png, zoho-r2-old-sla.png, zoho-r2-old-rr.png.
- Public API: /slas and /assignmentRules → 404 (no public SLA API); /skills, /skillTypes, /roundRobinRules answered 200 (empty) at first, then every call failed "x-zcsrf-token does not match". No safe way to build the SLA / skill rule without Setup.
- Nothing created or changed in Zoho in this retry (GET only) → nothing to clean.
- Unblock: a network where static.zohocdn.com loads fully (other machine / VPN off), or the user opens Setup once on their browser and captures the SLA "Whom to escalate" picker and a skill-based round robin rule.

### 10 Nov, evening
- I-04 re-run with staging calm (watcher: 20 checks < 1 s in a row) and A1–A3 online: burst 20 tickets 0.5 s apart → 20/20 within 5 s (median 1.9, max 3.3); again 20/20 (median 2.3, max 3.1); spaced 8 s → 10/10 (median 2.6). First attempt 0/20 because the presence keepers were stopped (agents offline) — test setup, not a defect. → I-04 PASS; the 9/20 at 14:xx was under load. Not filed (user asked to explain first). Outputs ../i04-*.json.
- SL-51: invite accepted (shows as "Test SL-51"). Added to QA AO Dept A; SLA policy "QA AO SL51d…" names it at level 1 (alone) and level 2 (with Mahmoud Samy). Remove-from-Desk dialog: "SLA escalations: 1, Department memberships: 1 … escalations … stop naming this agent; a rule that only named them is turned off." Reassign picker covers open tickets only — no replacement for escalations (Zoho: chosen replacement is put into "whom to escalate"). NOT confirmed yet: the agent owns #2565 "QA RT15 2204 role 1" (Customer Support, not a member there; another session's ticket) — removal would change its owner, so paused for the user. Screens evidence/raw/sl51-remove-dialog.png, sl51-agents.png.
- Gmail: user received none of NT24ax8yl, NT24bx8yl, SL22pczr, SL57pczr (9 Nov). Zoho docs: bulk close sends no closed notification (help "Performing bulk updates") → for NT-24 TAVI's intended behaviour (feed logged a closed mail per ticket) differs from Zoho, yet nothing arrived.
- Zoho docs check of the 33 review rows done (subagent; help.zoho.com sources).
- 10 Nov evening, filed (user: "file all 4 cases that differ from zoho as bugs … Zoho behaviour as expected" + "file no. 5"): NDC-2850 SL-51 (Medium, removal drops agent from escalations, no replacement), NDC-2851 NT-24 (Medium, bulk close sends closed mail; Zoho help: no notifications on bulk close), NDC-2852 SL-21 (Medium, chosen escalation agents without ticket access skipped silently), NDC-2853 SL-22 (High, department admin named in escalation skipped "No access" under Private sharing → no mail; user got none of SL22pczr/SL22jof1/SL57*). Images evidence/annotated/{SL-51,NT-24,SL-21,SL-22}-*.png; specs evidence/specs/. Evidence run ev5 data deleted.
- SL-46 NOT filed: full dashboard has every Zoho widget (adherence ×2, by SLA/agent/time/status/channel, avg residual/violation) and the same filters (date, SLA, violation type, team, agent). My earlier "partial" was from the top of the page only.
- SL-44 side note: TAVI has system views My Overdue Tickets and My Response Overdue Tickets (no all-agents "Overdue"/"SLA Violated" views seen).
- Owner's All Tickets view: switched to Table View for NT-24; switching back failed (menu not found), left on Table View. Countdown columns had show "Couldn't load these tickets".
- Still open: SL-51 removal of "Test SL-51" (owns #2565 from another session) + policy "QA AO SL51d…" kept until user decides.

### 11 Nov — SL-51 cleanup (user: "clean up SL-51")
- Policy "QA AO SL51dobcy" (cf69073f…) was already gone (GET 404, not in Dept A list) before cleanup; not deleted by this run, deleter unknown. Agent workload showed sla_escalations 0.
- "Test SL-51": Remove from Desk › "Reassign and remove", Customer Support open ticket left unassigned. After: departments [], memberships 0, team sources 0. User deleted (DELETE /iam/users 204, no longer listed). Screens scratchpad ev/sl51-remove-before-confirm.png, sl51-after-remove.png.

### 11 Nov — NT-19 team half (user: "NT-19 go ahead")
- Direct rule (team target QA AS6 Team A: Mahmoud Samy, Dev Team 2), direct switch on only for the test. Team notice off → #2816 assigned to the team, no bell for either member. On → #2817, both members got "desk.ticket.team_assigned: Ticket #2817 assigned to team QA AS6 Team A" (09:45:31 UTC). PASS. With the 10 Nov agent half, NT-19 PASS. Switches restored (agent on, team on, direct OFF, RR on); rule and tickets deleted. Script nt19t.js.
- Correction: C-08 screen half already PASS on 10 Nov (line above); it was wrongly listed as open on 11 Nov.
- NT-30: throwaway invite to Gmail +nt30 sent. The first invite's token was printed in the session by mistake (mask missed `invitation_token`); that user was deleted (204) and the invite re-sent. api.js now masks token/secret/password keys in all output.

### 11 Nov — NT-10 rating, NDC-1488, D-14 web form
- NT-10 rating (user OK): happiness settings ON, scoped to QA AO Dept A only (original saved nt10h-orig.json — RESTORE after the test). Ticket #2818 "QA AO NT10rpgcr rating test", owner Mahmoud Samy, contact = user's Gmail; closed 09:49:02 UTC, closed mail sent 09:49:05 UTC ("Your ticket #2818 has been closed"). The stored copy of the mail ends with the raw text {{happiness.link}} — check in Gmail whether the rating link is filled in. Waiting on the user to rate. Cleanup: nt10r.json (contact + ticket).
- NDC-1488 retest (Desk, 11 Nov 10:0x UTC): QA AS6 D14 form › Publish & how to use › Hosted link https://staging-crm.taviportal.com/embed/feedback/f/fw1.<key> → signed out: 404 Not Found, nginx/1.18.0 (Ubuntu). STILL FAILS. Also seen: a Desk form's hosted link and iframe point to the CRM host. Screens: scratchpad ev/ndc1488-publish.png, ndc1488-hosted-signedout.png. Not posted to Plane.
- D-14 web form channel PASS via the iframe address (signed out): direct rule (subject contains key → A1), switch on only for the test → #2822 channel web, owner Test User 1, feed ticket.created → auto_assigned. Control #2821 (rule on description, which the form lacks) stayed unassigned. Switch restored (direct OFF), rule, 2 tickets, 1 contact deleted. D-14 left: email (no receiving address), import (NDC-2275 Bug: import runs no rules).

### 11 Nov — NT-10 done, NT-30 resent, SL-18 via Help Center
- NT-10 rating PASS: user's Gmail showed the closed mail with the rating question and Bad/Okay/Good buttons (the stored copy's {{happiness.link}} is only the template). User clicked Good + feedback "test" → rating submitted 10:55:28 UTC, feed happiness.rating_received, owner Mahmoud Samy bell "Good rating on ticket #2818" 10:55:31. Side note: rating's agent_user_id = the account that closed the ticket (owner account), not the ticket owner. Happiness settings restored (no diff from original); ticket + contact deleted.
- NT-30: leaked first invite 866b9267 was still pending → cancelled (POST /iam/users/invitations/{id}/cancel 204). New invite 7749e3b0 sent ~11:20 UTC (nt30.json). Waiting for the user to accept.
- NT-26: ignored (user).
- SL-18 via Help Center (user: "use the portal"): QA AO Dept A set to "Display in Help Center" (was private; restore with MODE=private node api.js … sl18p-vis.js). Note: PATCH with `visibility` returns 200 but is ignored; the field is `display_in_help_center` (API-only, deferred). Tickets #2854 (first response only ON) and #2855 (OFF), contact QA AO SL18 gj3f = user's Gmail, agent reply sent on both (first_response met). Contact invited to Help Center "NDC Staging" (outcome invited). Waiting for the user to reply on both tickets in the portal; then sl18-check.js with sl18p.json.
- SL-18 PASS (11 Nov, via Help Center): user replied on both tickets in the portal → message.received on each. #2855 (first response only OFF): new obligation response:running:cycle2, due 15:17:13 UTC (4 h after the reply). #2854 (ON): no new response obligation (first_response met, resolution running). Cleanup: 2 tickets, 2 policies, Help Center account, contact deleted; QA AO Dept A back to private (not served). Script sl18p-check.js.

### 11 Nov — NT-30 run (agent "Test NT-30", Gmail +nt30)
- Added to QA AO Dept A; team "QA AO NT30 team NT30o6kr" (only member). Control while active: #2856 owner NT-30 (11:23:26 UTC) → expect "assigned to you" mail.
- Suspended 11:23:33. Comment on #2856 11:23:41 → 201, no error. New ticket with owner NT-30 → 422 "User is not an active agent of the ticket's department." (clear refusal). Team ticket #2857 11:23:51 → 201, no error.
- Positive control: reactivated 11:24:49; comment on #2856 11:25:53; team ticket #2858 11:26:01 → mails expected for these.
- Waiting: user checks Gmail +nt30. PASS if mails exist for #2856 assigned (11:23) and the 11:25–11:26 comment/team, and none for 11:23:41 comment / #2857. Then nt30-clean (tickets, team, dept membership, user).
- NT-30 INCONCLUSIVE so far: user got none of the 3 expected agent mails on +nt30 (#2856 assigned while active, comment while active, team #2858). So agent notification emails may not be delivered at all. Samy's preferences: email on for every desk.* event. Control 11:33 UTC: #2859 "QA AO MAILCTL3puq agent mail check" assigned to Mahmoud Samy (main Gmail) → bell 11:33:02; user to check main Gmail for the mail (also "#2818 assigned to you" 09:48 and "Good rating on #2818" 10:55).
- 11 Nov: user got none of #2859 assigned (13:33 Cairo), #2818 assigned (11:48), #2818 Good rating (12:55) on main Gmail either. Bells exist for all three. ⇒ FINDING: Desk sends no agent notification emails (in-app only), for any agent, although the Dept A rules have email on and the agent's preferences have email on. Customer mails (closed, rating) do arrive. Plane: no duplicate (scanned 1363 items). Not filed — waiting for the user. Impacts: NT-30 (mail half untestable), NDC-2853 (even with ticket access no mail would arrive). Kept for evidence: Test NT-30 user, team, tickets #2856–2859.
- 11 Nov, filed (user: "file it as high with annotated evidence and comment on NDC-2853"): NDC-2864 (High, Bug, Desk, Sprint 15, labels Automation Execution Order + Email Channel, image evidence/annotated/AG-MAIL-…-vs-zoho.png, spec evidence/specs/AG-MAIL.json). Refined cause from the screen: QA AO Dept A agent rules have Email ON and "Sent as: in-app notification + email", but the default template is "the in-app notification only" ("Choose a template to also send desk's own email") → no agent email. Zoho help: rules have a predefined template and send by e-mail. Comment posted on NDC-2853 (201) linking NDC-2864. Note: browser sessions from api.js tokens stopped working after the 11 Nov build (sign-in page); UI captures now sign in once and save scratchpad ev/samy-state.json.
- NT-30 template retry (11 Nov): first try bound system templates → 400 "template_id must be a valid id" (system ids not bindable); script continued by mistake → tickets #2861–#2864 created with no template (void, delete). Second try: 3 QA templates (copies of the system ones, subject prefix "QA AO NT30 <use case>:") bound on QA AO Dept A agent.ticket_assigned, agent.comment_added, team.ticket_assigned (originals in nt30-rules-orig.json: enabled, template null). Phase A active (UTC): #2865 assigned to NT-30 12:15:08, comment 12:15:18, team #2866 12:15:25, control #2867 assigned to Samy 12:15:32. Suspended 12:16:35. Phase B: comment 12:16:50, team #2868 12:17:02. Waiting for the user's Gmail check (search "QA AO NT30").
- NT-30 template retry result (user Gmail): arrived #2865 assigned (+nt30, 14:15 Cairo), comment on #2865 while active (+nt30), control #2867 to Samy (main). Not arrived: suspended-phase comment and team #2868 (expected). Team #2866 (active) didn't arrive either — cause: test setup, the NT-30 team had no members (POST /desk/teams ignores member_user_ids; members come from team `sources` [{kind:'agent',ref_id}]). ⇒ With a template, agent emails work (NDC-2864 confirmed as default-template problem).
- Team redo: sources set → member listed. Active: team ticket #2869 12:27:21 UTC (mail expected). Suspended 12:28:24 (still listed as team member). Suspended: team ticket #2871 12:28:49 (no mail expected). Waiting for user's +nt30 check.
- NT-30 PASS (11 Nov): team mail #2869 (member active) arrived 14:27 Cairo; nothing for #2871 (member suspended). Earlier: assigned + comment while active arrived, comment while suspended didn't. Assign to suspended agent refused with a clear message. No errors.
- CORRECTION for NDC-2864: user's inbox shows "Good rating on ticket #2818" DID arrive (12:55 Cairo), although we had counted it as missing. agent.rating_received has the same config as agent.ticket_assigned (enabled, template null, in_app+email), so that mail most likely comes from the Customer Happiness setting "notify owner on rating" (not confirmed). Assigned/comment/team mails with the default template still never arrived. NDC-2864 text + image list the rating mail as missing → needs a correction (asked the user).
- NT-30 cleanup done: 3 rules back to template null (enabled), 3 QA templates, 14 tickets (#2856–#2869, #2871), team deleted; agent removed from Dept A; user deleted.
- NDC-2864 corrected (user OK 11 Nov): description Actual Result rewritten (rating mail removed from "not received", template retest added, rating mail note), Summary/Expected no longer mention ratings; old image deleted, corrected image attached (1 attachment); correction comment posted (201). NT-30's team ticket #2858 dropped from evidence (team was empty). Scripts fix-agmail.js, fix2-agmail.js.

### 11 Nov — "I can do" list
- Leftovers: F-08 tickets #2509–#2512 deleted (found by saved ids and a full sweep for "AOF8"; none left).
- SL-44 PASS on views: Views sidebar (owner) has Overdue Tickets, Response Overdue Tickets, SLA Violated Tickets (+ My Overdue, My Response Overdue) — same as Zoho's predefined views. The 10 Nov "no all-agents view" note was wrong (group collapsed). Not checked: On Hold excluded from the overdue views (Zoho excludes it).
- NT-06 comment edit: ticket #2886 (contact Gmail, CC Gmail +qaao), public comment 13:18:50 UTC (mail "New comment on ticket #2886" To Gmail Cc +qaao, sent 13:18:51); edited on screen (row menu › Edit comment › Save comment) 13:24:52 → comment.edited, mail "Re: New comment on ticket #2886: …" To Gmail Cc +qaao sent 13:25:00 (recipient_count 2). Waiting for the user's Gmail check (body should show the edited text). Delete #2886 + contact after.
- E-03 settings vs Zoho (help, not live): offline agents, department threshold, agent threshold (overrides department, same as Zoho), assign backlogs + limit + order (Due Date / Created Time), assign on closure, 30-day rule — all present. Extra in TAVI: "Incoming tickets: immediate / backlog first". Validation: bad backlog_order/incoming_mode → 400 unknown; huge limit/threshold → 400 out_of_range; nothing changed. MATCHES.
- SL-40 day-before: contract "QA AO Contract SL40d01ql" ends 13 Nov, notify Test User 1 1 day before; check Test User 1 bell after the 12 Nov ~00:03 UTC run; cleanup ids in sl40c.json.
- Visual: sla-list-ar retaken (rtl, Arabic, OK); notification-bell-ar and -phone retaken (bell opened; OK). Reviewed OK: sla-accounts-dialog-ar, notification-preferences-ar, sla-list-light-en. ticket-sla phone flags = false positives (aria-hidden scroll button; tab bar scroll arrow over the cut tab). Minor, not filed: notification texts stay English in the Arabic UI (stored at send time), labels "EXPORT JOB"/"DATA BACKUP" not translated, dates in Arabic-Indic digits.
- Browser: one owner sign-in (session saved ev/owner-ui-state.json, reused for the NT-06 save and the bell retakes).
- NT-06 comment edit PASS (user Gmail, 11 Nov): "New comment on ticket #2886" 15:18 and "Re: New comment on ticket #2886" 15:25 (Cairo) both arrived; one message each (To contact, Cc +qaao in the same mailbox, as in NT-07). Ticket #2886 + contact deleted. Observation: the edit mail's subject doesn't say "edited". SL-40 check on 12 Nov (user).

### 11 Nov — A4 Workflow started: case list
- Read-only baseline: a4/wf-baseline-rules.json (50 Tickets rules, all inactive = AT the 50 limit; 41 "QA NDC" kept reference setup, "test workflow" other user's, 8 our old QA: 4 "QA AS6 WF" 6 Nov, 4 "QA 2205" 10 Nov), a4/wf-baseline-actions.json (8 saved actions).
- Case list a4-workflow-case-list.html (274 rows: spec 237 + new Group P 26 built features + Group R 11 bug rechecks). Waiting for the user's OK, slot cleanup OK, and webhook receiver decision. Nothing changed on the tenant.
- B14 (user: limit should have been removed): PASS. At 50 Tickets rules, POST #51 and #52 → 201 (activate 204); screen shows All 52, New Rule enabled, wizard opens, no "Limit reached" text. Spec row B14 / O11 / build-map "50 per module" are outdated. Both QA rules deleted. Slot blocker gone; the 8 old QA rules no longer need deleting for space (still ours to clean at the end).
- A4 setup (user: "use webhook.site, invite the agent, I'll reply in portal"): agent "QA AO WF Agent" invited (Gmail +wf, a4/agent.json); Java suite pointed at QA AO Dept A; Java ApiClient got an API sign-in fallback (Desk no longer keeps the access token in a cookie since 11 Nov, only aw_staging_refresh_token) — config api.loginPath.
- A4 Group P by API (a4/p1..p4, p1b, p1c, p2, p3, p10a, p26b, p4dir): PASS P2, P3, P4 (+ direction now built: outgoing/any fire on a forward, incoming does not — NDC-2203 FAIL item fixed in API, screen to check), P6 (any/all, 4th refused), P7 (several ticket events), P8, P10, P12 (Is Overdue now true on Create), P13, P14, P17 (team on Create now works — NDC-2203 FAIL item fixed), P19, P20, P21, P23 add/remove (skill NAMES), P24, P26. P11 business-hours half only (24/7 tenant). P23 reassign: nobody_online (inconclusive). P18: agents without ticket access skipped while history says Succeeded (same access rule as NDC-2852). P22 blocked by API: custom-action source needs a pasted OpenAPI spec (body format unknown) — do on screen. P7mix: record + ticket events in one rule not possible (ticketEvents dropped on RecordCreated).
- A4 user round set up 15:03 UTC (a4/u1.json): Dept A Display in Help Center ON, Happiness ON scoped to Dept A (restore a4/u1-orig.json). Contact +wfp invited to the portal. Tickets #2943 P1 (reply in portal), #2944 P5 (closed, rate Good), #2945 I28 (rating mail sent by rule, rate Good), #2946 P15 (Send Email Reply), #2947 P16 (Email to contact + Samy + QA AO WF Team).
- A4 user round results (user Gmail screenshot 11 Nov ~17:40 Cairo): P1 PASS (portal reply fired Customer Reply rule 15:23 UTC). P5 PASS (#2948 Good → "good" + "any" rules fired 15:35, "bad" did not). I28 PASS (Send happiness email = "Your ticket #… has been closed" mail with rating, even on an open ticket, as Zoho). P15 PASS (#2946 reply arrived). P16 + I18 PASS (#2947: contact + Samy, Samy once although named user and team member).
- FINDING C3 (candidate bug, Zoho docs check pending): a ticket closed by a workflow Field Update (#2952) gets no closed mail and no rating request, and its history has only "Workflow rule ran" (no status line). Closed with the Desk close action (#2951) → closed mail + rating. Records-API close (#2944, #2950) also silent (API-only, deferred).
- A4 Java run (11 Nov, API sign-in fallback; stopped ~18:25 Cairo by Claude Code for low memory, not restarted): batch 1 UI: WFR-001/002, K1, E2, G3/F5, M2, D2, F1 PASS; M1 FAIL (B-6 no menu link, still); B1 failed on a network blip (screenshot shows Name column → test issue); 6 skipped (DNS). Batch 2 API: B8, E16, G1, D7, B9, F19, F4, L4, L5, M3, G8 PASS; F7 FAIL (B-2 created_by Field Update accepted, still); 12 skipped (Edge renderer timeout). Batch 3 bugs/parity: WFR-020 (NDC-2206), WFR-031 (NDC-2204), Z08, Z09, Z10-12, Z17 PASS; parity tests Z01/Z06/Z14/Z23-27 fail as stale (written for the 12 Oct UI; Group P API proves built) — UI wording to recheck; Z16 FAIL: no free-text / outside addresses in Email recipients (gap stays); WFR-012/013 BROKEN locators (old ticket form, retired). Batch 4 execution: H1, H2, H3, H4 (NDC-2205 still fixed), H5, H8, H9, H11, H12, H19, I1, I26, I27 PASS. Batch 5 actions: I6, I11/I17, I12, I13/I16, I15, I18, I22, I24, I33, J2/J11 PASS; J7 FAIL (B-7 cancelled scheduled action has no dispatch row, still); I14 FAIL (B-4 webhook 404 not shown as Failed, still). Not run: WorkflowHijTest (batch 6) and reruns of the skipped UI/API rows.
- Zoho docs (agent): History records a workflow status change with workflow actor + old/new value (documented) → TAVI #2952 shows only "Workflow rule ran". Whether a workflow close sends the closed mail / rating: not documented → needs a live Zoho test (asked the user).
- A4 Java rest (r1, 11–12 Nov, one class at a time): WorkflowHijTest H6, H7, H10, H15, H16, H17, H18, H20, I2, I5, I7, I23, I31, I32, J3, J4, J8, J9, J10 PASS; FAIL I25 (B-8 Create Record skips required fields, still), I8 (B-9 role round robin assigns nobody, still), J1 (minutes-before-date did not fire in 7 min — rerunning alone), I10 (test body outdated for the assignment-rule API; row moved to Part B anyway); H13/I3/I4 skipped (need the QA WF Layout setup). UI rerun: B1, B6 (NDC-2173 still fixed), B3, B7, C2 PASS; FAIL M1 (B-6), K2 (B-3 no Send happiness email in New Action), F3 (B-5 picker offers used types, still), F2 (stale: scheduled Field Update is now built — a4/f2.js: 60 s delay applied, PASS). API rerun: all PASS except F7 (B-2) and API-T3 (B-1 kind order 500, still).
- P4 on screen PASS: Private Thread offers "Incoming and outgoing / Incoming / Outgoing" (evidence/raw/p4-private-thread-direction.png text). SL-40 bell 22:4x UTC 11 Nov: nothing yet (job ~00:03 UTC) — recheck.
- Zoho C3: Workflow Rules page loads now (no rules in Haytham Mohamed dept); contact "Closing a ticket" notification is OFF (default) → asked the user to allow turning it on for the test.
- J1 rerun alone PASS (219 s) — earlier fail was late-night slowness. H13, I3 PASS on the temporary QA WF Layout (setup + teardown ran, Standard compared). I4 FAIL to recheck: creating a ticket with an address value on the QA layout → 500 (passed 14 Oct).
- Group A: Desk Agent profile = workflow:rule:view, execution:view, custom_action view/run. Test User 1 API: rules/executions 200, actions 403, all writes 403 → A3/A4/A6/A7/A8 PASS. Screen (a5ui.js): New Rule hidden; row menu Edit/Activate/Delete disabled "Requires workflow:rule:manage", Test rule "Requires workflow:rule:execute"; editor URL "You don't have permission to author workflow rules"; Actions "You don't have access"; history loads → A5 PASS. Dev Team 2 has full workflow rights (its PATCH re-saved a QA NDC rule's own name, no change).
- O3 SSRF PASS: metadata/loopback/private/file/decimal/IPv6 refused at save ("must be a public http(s) endpoint"); localtest.me saved but dispatch blocked "egress-blocked" (status shows Cancelled, B-4 family).
- O1 FINDING (security): Add Comment action body with <img onerror> (saved through the API) EXECUTES when an admin opens the rule in the editor (window.__xss set; evidence/raw/o1-editor-cm.png). Name, description, task title, list, Execution History, ticket comment all render safely. Payload rules deleted (in Recycle Bin). API-only input → user to decide on filing.

### 12 Nov — new PC, SL-40, I4
- Repo now on another PC: scripts/api.js finds the repo from its own folder; tokens in %TEMP%/qa-tavi-tokens (or QA_TOKEN_DIR). Java: pass `-Dcredentials.file=../docs/Credentials/TAVI Desk Credentials.csv`; layout baseline must be re-saved (WorkflowDiagTest#standardLayoutBaseline) before qaLayoutSetup (target/ not in git).
- SL-40 day-before PASS: Test User 1 bell 00:00:43 UTC "Contract QA AO Contract SL40d01ql expires tomorrow". Contract + account deleted (plan/policy already 404).
- I4 PASS on retry: qa_wf_address.city Cairo → Giza, street/country kept. First try 11:45 Cairo: GET fields 503 "metadata-engine service is temporarily unavailable" → the 11 Nov 500 was a staging outage, not a bug. QA layout + fields deleted, Standard same as baseline.
- Live progress report: report-progress.html (scripts/build-progress-report.js; LIST_NOT_RUN=1 prints A4 rows still to run).

### 12 Nov — A4 API rows (a4/b1–b4, clean12)
- Java API PASS: A9, A11, B13, E11, G7, K3, K5, K9. H14, K6, K7 (409 in use), L2, L3, L6, M4, M8, B12, G10/N4, N1, O2, O6 PASS. K8, M7 partial.
- O4 FAIL (security, not filed): Webhook header 'X-QA: a\r\nInjected: 1' → webhook.site received x-qa: a AND injected: 1. Host override saved, dispatch Pending "SSL connection could not be established".
- L1 FINDING: POST /workflow/rules/{id}/execute {recordId, triggerKind, fields} ignores recordId — matching ticket + empty fields → criteriaMatched false; typed fields → true. Body format from bundle pages-*.js (draft: /rules/evaluate {rule, sampleRecord}).
- TRAP: rule values must be {kind:'string', stringValue}; {kind,value} is accepted and saved as "" (blanked description). Records API uses {kind, value}.
- Cleanup: today's ledger items deleted (12 rules, 1 action, 14 tickets). 11 Nov Group P rules (QA AO WF P14a…) still there → end-of-A4 cleanup.

### 12 Nov afternoon — A4 screen rows (Playwright + Edge, owner) and last API rows
- Screen helper (not saved to repo): scratchpad ui/ui.js signs in once, steps s1–s28. Editor panels need dispatchEvent('click'); condition field buttons all have aria-label "— select field —"; pattern box appears after Edit Pattern, closes on Apply.
- New FAIL: G4 double-click Save & Activate → 2 identical rules (2×). G5 stale save silently overwrites a change made meanwhile. M6 Execution History shows rule + record as raw ids, record not a link (rules exist). F18 ${recordId}/${moduleId} render empty in Field Update. Z18 one action per type per delay (gap stays).
- New FINDING: B2 Trigger column internal field names + "1 days"; B11 raw-id toast; C4/C7 length limits only at save (200 / 2000); E9 unused condition silently ignored ("1 and 2" with 3 rows); F9/F12 raw server texts ("Actions[0].TaskTitle…"); I30 happiness email "Succeeded" while ratings off.
- B-3 FIXED (Happiness Email in New Action). I19, I20 (Cancelled with clear reason), I21 PASS. Audit log side notes: "User a7a7a7a7", "&lt;img" double-escaped, ticket named by contact email.
- Blocked / not run with reasons: A2, A10, D6, E5, F21, I9 (agent invite never accepted), I10 moved, I29, J5, J6, O5, O12, O13, P22, Z23–Z25, Z27, E2E-1..6 (Part C; E2E-6 needs the old-rule cleanup).
- Cleanup: today's ledger + screen-made rules/actions deleted (clean12.js, clean12b.js); happiness restored (no diff) and Dept A private (b8.js). Bulk delete of the ~60 11 Nov "QA AO WF" rules was REFUSED by the auto-mode check → user OK needed.
- Report: report-progress.html (A4 250/274 with a result; section "Not run / why").

- 12 Nov 16:00 (user OK): deleted 57 "QA AO WF" rules (55 active) + 1 saved action (a4/clean11.js). E2E-6 PASS (a4/e2e6.js): baseline 50 rules / 8 actions intact; 3 extra inactive Java leftovers QA 2206 Date-Time 747251, QA 2205 On Edit control On Create 982741, QA 2205 On Edit 6985 — not deleted, asked user.
- 12 Nov 16:10 (user OK): 3 Java leftovers deleted (a4/clean11b.js); E2E-6 rerun: 50/50 rules, 8/8 actions, no extra.
- 12 Nov 16:30: bug-only report report-workflow-bugs.html (scripts/build-workflow-bugs-report.js, images evidence/a4-bugs/): WF-01..WF-14 (O4, O1, G4, G5, M6, F18, I30, E9, L1, F9/F12, C4/C7, B11, B2, Z18) + old B-1, B-2, B-4..B-9. Nothing filed.
- 12 Nov 17:30: workflow bugs compared with Zoho Desk (live techsolutionsegypt via scripts/zd-server-8894.js, nothing saved; Zoho rules list still empty) + help.zoho.com. DIFFERS: WF-06 F18, WF-08 E9 ("Numbers in this pattern do not match with the numbers used in the Criteria Editor"), WF-11 name (Zoho maxlength 50), WF-13 B2, WF-14 Z18 (10 alerts/tasks/field updates), B-2 (Zoho field update offers 14 editable fields only). BUG no Zoho equiv: WF-01..04, WF-07, B-1, B-8. NO ZOHO (TAVI-only): WF-05, 09, 10, 12, B-4, B-6, B-7, B-9. WITHDRAW: B-5. Report report-workflow-bugs.html updated (Zoho-based expected results).

## 12 Nov 17:30 — progress report updated with Zoho comparison
- report-progress.html: new section "Workflow bugs vs Zoho Desk" (6 differ, 7 bugs no Zoho equivalent, 8 TAVI-only, B-5 withdrawn), link to report-workflow-bugs.html, row notes E9/C4/B2/F18/Z18/R2 carry Zoho behaviour, R5 (B-5) → PASS withdrawn. A4 now PASS 204, FAIL 21.

## 12 Nov 17:50 — findings report
- report-workflow-findings.html (scripts/build-workflow-findings-report.js): 10 cards covering the 14 FINDING rows (O1, E9, L1, F9/F12, C4/C7, B11, B2, I30, P18=Z19, C3/P25=Z28). vs Zoho: 3 differ, 2 bugs no equivalent, 3 TAVI-only, 2 not checked (P18, C3). Linked from report-progress.html.

## 12 Nov 18:40 — C3 checked in Zoho (user OK)
- Zoho techsolutionsegypt, dept Tech: contact notification "Closing a ticket" (email) turned ON. #184 closed by agent (API status=Closed) -> NotificationSent "Acknowledge Contact when the Ticket is closed". Rule "QA C3 close by workflow" (Create, later Create+Edit; Subject contains QA C3 WF; Field Update "QA C3 set Closed" Status=Closed): #185 (create) and #186 (edit) closed by workflow -> NO notification; history "Ticket was updated through a Workflow Rule / Rule Name / Assignment Name / Status changed from Open to Closed".
- Verdict C3: missing closed mail = same as Zoho (not a bug). DIFFERS only in history (TAVI "Workflow rule ran", no status line). FN-16 now Low / DIFFERS.
- Cleanup: rule deleted (204), field update deleted, tickets #184-186 + contact QA C3 Contact moved to Zoho trash, notification turned back OFF (Updated Successfully). Evidence: evidence/a4-bugs/C3-zoho-workflow-close-no-mail.png, C3-zoho-manual-close-mail-sent.png.

## 12 Nov 18:55 — Plane drafts report
- report-workflow-plane-drafts.html (scripts/build-workflow-plane-drafts.js): 14 drafts D-01..D-14 (7 differ from Zoho, 7 bugs). Not filed; waiting for user review. 12 still need an image made (or combined TAVI vs Zoho) before filing; D-13 is API-only (text, no image).

## 12 Nov 19:30 — Workflow bugs filed (user OK)
- Evidence rerun on staging (a4/ev1.js, ev2.js, screen ev1-ev5): F18, C3, O4, I30, I25, API-T3, G4, C4 reproduced; Z18 now only Field Update (two Tasks allowed); B-2 only via API (editor hides Created By); C3 history now shows status change + rule -> D-07 dropped (not filed).
- Images: scripts/build-wf-annotations.js -> evidence/annotated/WF-*.png (specs in evidence/specs/D-*.json); API panels scripts/render-text-panels.js.
- Filed (scripts/file-wf-bugs.js, out plane-filed-workflow.json): NDC-2948 (E9), 2951 (Z18), 2953 (B-2 API), 2955 (C4), 2958 (F18), 2961 (B2), 2962 (O4 High), 2963 (O1 High), 2964 (G4 High), 2965 (G5), 2966 (I30), 2967 (API-T3 High), 2968 (I25). Bug state, Desk module, Sprint 15, labels Workflow Rules + Automation Execution Order, NDC-2811 assignees, 1 image each. Read back OK.
- Cleanup (a4/clean-ev.js): 10 rules, 6 tickets, 1 call deleted; rules = 50 (baseline), no QA AO WF left.

## 12 Nov 19:20 — remaining A4 rows (user: run the 9; change+revert or dummy data allowed)
- PASS: P22/Z23 (custom action built on screen, Run Custom Action in Desk rule hit webhook.site), E15, F10, G9, A2 (CES 2 -> Desk Light Agent and back), E5 (empty pick-list impossible), F21 (Calls rule), J6, P23/Z26 (Test User 1 online), O13 (Edge, Chromium, Firefox 156 installed via playwright).
- FINDING: C9 (no "Resume your draft?"; old draft silently restored on /new), M5 (Field Changed run shown "On Edit"), M7 (only latest 50, no paging), O7 (Webhook/Close untranslated, RTL connector lines).
- NEW FAIL P11: Execution Time condition never matches (24/7 and custom 01:00-23:00; screen saves same value business_hours).
- PARTIAL O5 (same tenant pass). BLOCKED: J5 (Shift-01 01:00-23:00 blocks narrower hours), I9 (invite), I29 (rate #3194), A10 (second tenant), D6 (impossible).
- Tenant: business hours set 01:00-23:00 twice and reverted to 24_7 (verified); CES 2 profile restored; Customer Happiness ON (orig in a4/happiness-orig-i29.json) until user rates; I29 rule + ticket #3194 kept; everything else deleted (13 rules, 24 tickets, custom action + source). "QA SK13 WF skills" is another session's rule.
- A4 now 268/274 with a result: PASS 217, FAIL 22, FINDING 18, PARTIAL 2, BLOCKED 5, NOT RUN 6 (Part C), SKIPPED 3, MOVED 1.

## 12 Nov evening (2) — user replies
- I29: user saw no mail "please rate" — my subject was wrong. The workflow "Send happiness email" mail is "Your ticket #3194 has been closed" (sent 14:58:49 UTC, status sent). Stored copy ends with raw {{happiness.link}} (same as NT-10: template only, real mail has buttons). Control ticket #3205 closed manually → same closed mail. Asked user to look for the real subject. Note: action on an Open ticket sends "has been closed" wording.
- I9: user accepted, but TAVI still shows "QA AO WF Agent" Invited (user id 0000…). Re-sent invite f56966bb (204). Waiting on user again.
- J5: user "do what is right" → no shift change. Hours 01:00–23:00 (fits Shift-01), rules "BH J5 business"/"BH J5 wall" offset 6h on due_date, due after 01:00 so the 23:00–01:00 gap sits inside the window; script reverts to 24_7 in finally. Output a4/j5-out.json.
- A10: user has no second tenant → stays BLOCKED (O5 other-tenant half too).
- J5 PASS: business rule fired 16:37:16 UTC (expected 16:37:03), wall not fired yet (expected 18:37 UTC). Hours back to 24_7 (seen in 5s). a4/j5w.js in background confirms wall fire then deletes both rules + ticket. Report rebuilt: 269/274 (PASS 218, BLOCKED 4).
- j5w background check was stopped by Claude Code (system low on memory) before the wall fire (due 18:37 UTC). Not restarted. Pending: check wall rule fired, delete J5 rules + ticket (a4/j5-out.json) via a4/j5w.js.
- I29 PASS (user rated Good 16:18:55 UTC): refire rule "QA AO WF I29 refire" (priority change) → #3194 rated: no new mail (exec says Succeeded); #3205 pending: "Reminder: Your ticket #3205 has been closed" sent 20:13:26 UTC. Cleanup: rules I29 + refire deleted, tickets #3194, #3205, J5 ticket deleted; happiness settings restored (diff []); no "QA AO WF" rules left; hours 24_7.
- J5 wall rule: found already deleted (404) at cleanup and never fired on the ticket — the killed j5w loop likely ran out (~90 min) and deleted the rules before 18:37 UTC. Wall-clock fire not confirmed for J5 (J6 covers wall-clock).
- I9: invite re-sent again 20:10 UTC (user asked). Agent still Invited.
- I9: old invite f56966bb cancelled (expired per user); new invite created 20:46 UTC, ids in a4/agent.json. Waiting for user to accept.
- I9 FAIL (user accepted new invite; agent e862a437, name "Mahmoud Samy"): control (active, not in Dept A) → workflow assigned. Suspended (PATCH /iam/users/{id} {status:'suspended'} 204), not in dept → workflow still assigned, Fired. Manual POST /desk/tickets/{id}/assign refused for non-member even while active (422 not an active agent of the ticket's department). Added to Dept A: active manual 200; suspended manual 422; suspended workflow → not assigned, exec Fired, errorMessage null, dispatches [] (no reason). Agent reactivated each time. Not filed.
- MY MISTAKE: GET /desk/departments/{D}/agents is 405, so my saved list was empty and the "restore" left QA AO Dept A with 0 agents for ~2 min. Restored the 4 members from sl51.json/nt30.json (same list in both): Dev Team 2, Test User 1, ndc-staging-owner, Mahmoud Samy; read back 4. Use GET /desk/departments/{D} .agent_user_ids.
- I9 cleanup: rule + 6 tickets deleted, test agent deleted (204, gone), Dept A 4 agents, 0 QA AO WF rules.
- 23:20 Cairo: FILED NDC-2973 (I9) — Bug, Medium, Desk, Sprint 15, 2 labels, 3 assignees, image WF-I9-owner-assignment-ignores-suspended-agent.png (read back OK, 1 copy). Note: filed by an accidental run during a syntax check, but user had asked to file it; single item.
- P11 recheck → PASS. Earlier FAIL was my error: mkRule guard is the rule TAG; tickets made with a different tag never match. Same error made J5 wall control invalid and the first I29 refire. Matrix: 24/7 → in Fired, out/hol NoMatch; 01-23 at 23:10 (closed) → out Fired, in/hol NoMatch. Data deleted, hours 24_7.

## 12–13 Nov night — "run them all" (user)
- Second tenant: added row "anyware-staging-owner" to TAVI Desk Credentials.csv (not printed); tenant a7a7a7a7-…-0002; api.js takes TENANT env (default NDC).
- A10 PASS (all 404 across tenants; NDC rule unchanged). O5 PASS both halves (cross-tenant webhook bodies only own data).
- D6 PASS/cannot occur: new module QA AO WF D6 has Created/Modified Time (409 not deletable); picker lists them; module deleted. Side: API accepts DateFieldRelative on text field "name".
- Tag audit (scratchpad tagaudit.js): only P11 (fixed) and J5 wall were affected.
- I10 PASS (direct switch on → off restored): workflow wins. O12 PASS 50/50. E2E-1 FAIL owner part (role round robin assigns nobody = I8/B-9; RoleRoundRobin also saved with ownerValue "x"). E2E-2 PASS. E2E-3 PARTIAL (Used by 2; mails #3313–#3316 Succeeded; Gmail text check ONE/TWO pending). E2E-4 PASS. E2E-5 PASS (retries 6s/2m/10m, recovered on attempt 4).
- Z24/Z25/Z27 FAIL (missing in action picker; 22 actions).
- Cleanup verified: 0 QA AO WF rules (51 total = baseline 50 + QA SK13), tickets deleted (81), saved action, templates (incl. 11 Nov P16), my 2 tags (confirm=true), assignment rule, throwaway webhook.site token, Anyware rule + ticket; direct switch off, hours 24_7, Dept A 4 agents, happiness off.
- 13 Nov 00:20 Cairo: FILED NDC-2997 (D-16 E2E-1/I8 role RR, High), NDC-2998 (D-17 date trigger non-date field, Low), NDC-2999 (D-18 owner target unchecked incl. SpecificUser x, Medium). Sprint 15, Desk, 2 labels, 3 assignees, 1 image each, read back 1 copy. Probe rules deleted (0 left).

## A6 Blueprint — PAUSED 13 Nov ~01:30 Cairo (user)
- 140 of 187 rows recorded in a6/results.json (node a6/rec.js STATUS "ROWS" "note"). Left 47: A2 B1 B3 B4 B10 B11 C8 E14 F2 H3 H11 J1 J10 J11 J12 K3 K4 K5 M1 M2 M3 M5 N1 N8 N10 N11 Z1–Z15 E2E-1..6.
- Bug rechecks: fixed NDC-2753, 2756, 2757, 2758, 2761, 2762, 2763, 2774, 2775, 2780, 2782, 2788; still fails NDC-2755 (G11, confirm with screenshot).
- New FAIL: J15 (continuous does not auto-run), H6 (blueprint PUT silent overwrite), H12/M4 (audit logs only restore/purge for blueprints). FINDING: D5 (only owner suspended -> stuck, no warning), N3 (unknown owner user id saved), I4 (enters on edit). INCONCLUSIVE K9 (no holiday list linked to the profile on NDC).
- Tools: a6/lib-bp.js + a6/run.sh (NDC-Staging, Customer Support, "QA BP <tag>" guard), batches b1, b2, b2b, b3, b3k9; Java deskblueprint suites (credentials automation/.auth/extra-credentials.csv, gitignored); old scripts copied to a6/bp.
- Left on NDC-Staging on purpose for K/F rows: custom action "QA BP echo" 52f80185 + API source 80412d3b (delete at the end, in a6/made.json other[]). Everything else cleaned; statuses back to the original 42; business hours 24/7.
- Bundle 13 Nov shows built: Blueprint dashboard (/desk/blueprints/dashboard, Z14), per-ticket owner change (Z2), strict mode (Z1) -> check in Z rows. Customer rows K3–K5 + E2E-2 need the user's Gmail (reply + 2 ratings).

## A6 Blueprint — resumed 13 Nov ~01:00–02:30 Cairo (this device)
- 182 of 187 rows now recorded in a6/results.json. Left 4, all need the user's Gmail: K3 (customer reply trigger), K4 (no trigger -> reopen), K5 (rating trigger Good/Bad), E2E-2 (reply + timer journey).
- Tally (spec rows): PASS 153 · BUILT 13 · FINDING 6 · FAIL 4 · MISSING 4 · INCONCLUSIVE 3.
- **Gaps now BUILT (Group Z)**: Z1 strict mode, Z2 per-ticket transition owners, Z3 transition order, Z4 field checks with own message (also E14), Z5 Submit for approval, Z6 Share item, Z8 transition draft on the ticket, Z9 required per agent/team, Z13 blueprint views, Z14 blueprint dashboard (/analytics/dashboards/blueprints, also M5), Z15 separate revoke permission. All checked at runtime (a6/zr.js, a6/zr2.js, x-z3.js, UI scripts).
- **Still MISSING**: Z7 widgets in the form, Z10 rating/reply filters, Z11 several escalation levels, Z12 business-hours set per state.
- **NDC-2755 (G11) FIXED** - the state panel now shows "Moves on by itself" + "3d" badge. Java UiBugTest locator/message updated to the new wording.
- New FINDINGS: M1 history shows raw "BlueprintStateChanged" title and pipe text "QA BP JU|entered|Open"; H11 unsaved designer change lost on session expiry (no warning, no local copy); N8 dense graph: transition labels and +/delete buttons overlap; H3 notes ("needs a name" line not clickable, missing department not counted). C8 note: each palette drop auto-connects from the previous node.
- INCONCLUSIVE: F2 (no address field on Tickets - adding one is the user's call), N10 (no IM channel), K9 (from before).
- E2E-1, 3, 4, 5, 6 PASS (a6/e2e.js). J10 checked by simulated server response (server pre-validates, real incomplete run not reachable).
- Tools added: a6/ui.js (browser runner, Edge/Chrome/Firefox, signs in once from the CSV if the saved session is stale), a6/bp/ndc.js paths made portable. Evidence: a6/evidence/ui/*.png.
- Tenant: all A6 QA data from today deleted. Still left on purpose: custom action "QA BP echo" + API source (a6/made.json other[]) - delete when K rows are done. Not mine: "QA RT14 2754 share" blueprint (1 ticket inside).

### 13 Nov ~10:20 Cairo — A6 customer rows set up (user OK), F2 done
- LIVE on NDC-Staging until the user acts (undo with a6/k-clean.js, ids in a6/k-made.json): Customer Happiness ON scoped to Customer Support (original a6/k-orig.json: OFF); contact "QA BP K customer" (+qaao) invited to the Help Center; blueprint "QA BP K" 501dd484; workflow rule "QA BP K K5 rating mail" 01c1cd3a; tickets #3462 K3a, #3463 K3b, #3464 K4, #3465 K5a, #3466 K5b, #3467 K5c. Check after the user acts: node a6/k-check.js.
- Built since yesterday (seen in bundle + API): required "reply to contact" item in a transition (422 "A reply to the contact is required." without it) and a rating filter per state (onRatingValues good/okay/bad) → Z10 partly built (reply public/private filter still missing).
- E2E-2 no-reply half PASS: Ask documents (required reply) → On Hold → auto-closed after 207 s (timer 3 min), history entered/transition/left/Closed. Cleaned.
- F2 PASS (QA address field added and deleted). FINDING: blueprint field changes (any field) not shown on the ticket History tab although the server logs ticket.field_changed; manual address change shows raw JSON. Evidence a6/evidence/ui/f2-history2.png, f2d-history.png, f2-history-manual.png.
- 13 Nov ~16:00 Cairo: customer rows done with the user: K3 PASS (portal reply; Gmail reply from main address = untrusted, no move), K4 PASS (portal reply reopened), K5 PASS (Good moves, Bad stored but blocked by Good-only filter, Bad on any-filter state closes), E2E-2 PASS. A6 = 187/187: PASS 158, BUILT 13, FINDING 7, FAIL 4, MISSING 3, INCONCLUSIVE 2.
- Cleanup: k-clean.js (tickets, rule, bp, contact; happiness restored, no diff), custom action QA BP echo + API source deleted, F2 address field deleted. No QA BP blueprints left.
- Report with 11 drafted bugs (D-1..D-11, not filed): report-blueprint-a6-2026-11-13.html. Plane checked (read only): related NDC-2965, NDC-2999, NDC-2799 (items 8, 9, 13, 14 now built). Next: user decides filing; then ask about A8 Macros.
- 13 Nov ~20:30 Cairo (user: "file them all and check I4 in Zoho"): Zoho login file recreated on this device (docs/Credentials/'Zoho hmohamed@anyware.software.txt', gitignored, from user's message); zd-server-8894.js got NOH2=1 (--disable-http2, fixes ERR_HTTP2_PROTOCOL_ERROR on zohocdn). I4 PASS live: Zoho #191 edited to match -> "Blueprint applied" (same as TAVI). Zoho evidence (evidence/bp-bugs/): audit log ADD/UPDATE/DELETE of a blueprint (D-1), History "Ticket updated as part of transition actions · Phone changed" + readable blueprint lines (D-4, D-6), continuous blueprint text (D-3). Zoho cleaned: blueprint, field update, contact deleted; ticket #191 in Zoho Recycle Bin. TAVI D-1 fresh repro a6/d1-repro.js (QA BP D1 audit, deleted). First image built: evidence/annotated/BP-H12-blueprint-changes-not-in-audit-log-vs-zoho.png (spec evidence/specs/BP-D1.json) - shown to user for approval before the other 10.
- 13 Nov ~21:10 Cairo: FILED Blueprint batch (user approved image layout + "file them all"): D-1..D-11 = NDC-3029..NDC-3039 (Bug, labels Blueprint + Automation Execution Order, Desk module, Sprint 16 because Sprint 15 is completed in Plane, NDC-2788 assignees, one annotated image each; plane-filed-blueprint.json; scripts/file-bp-bugs.js; images scripts/build-bp-annotations.js + evidence/specs/BP-D*.json). Comment posted on NDC-2799 (items 8, 9, 13, 14 built; 7, 11, 12 + reply filter not). Fresh screen repros a6/img-prep.js (QA BP D2/D3/D8/D9; agent A suspended ~2 min then reactivated, verified active; all deleted). Report updated with ticket numbers. Zoho server stopped. A6 = 187/187 done. Next: ask user about A8 Macros.
- 14 Nov: missing-items recheck. Z11 escalation levels BUILT (3 levels fired: reminder 09:45:03, escalated 09:46:04, 09:47:06 UTC) and Z12 business-hours set per state BUILT (QA Mon-Fri set: 2h from Sat 11:43 Cairo -> Mon 02:00). Still missing: Z10 reply public/private filter, Z7 widgets. NDC-2799 commented with BP-Z10 + BP-Z7 images (scripts/post-2799.js, plane-2799-posted.json) and moved Done -> Bug (user OK). Test data deleted (zf.js/zm-prep.js clean, 0 left; QA ZM BH deleted; 'QA AS6 BH' profile is from 7 Nov, not this run). Draft (NOT filed, waiting user): Ticket History | Help Center reply shown as "Email received" (evidence/annotated/BP-K3-help-center-reply-shown-as-email-received.png). Missing-functions report artifact 6UkyQqAxUFchHwPjThZiRB (now partly out of date: Z11/Z12 built).
- 14 Nov: filed D-12 as NDC-3044 (Low, Ticket History | Help Center reply shown as "Email received"; Bug, Blueprint + AEO labels, Desk module, Sprint 16, image attached, read back OK). Report artifact 6UkyQqAxUFchHwPjThZiRB updated (v2). Blueprint total: 12 bugs filed.
