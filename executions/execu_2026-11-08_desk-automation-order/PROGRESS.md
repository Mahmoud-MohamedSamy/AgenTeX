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
