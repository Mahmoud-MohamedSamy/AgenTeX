# Round 9 notes — retest of Mahmoud's Ready For Test tickets (29 Oct 2026)

Environment: staging-crm.taviportal.com, **tenant Anyware** (user's instruction 29 Oct: same environment, different tenant; credentials from
docs/Credentials/Tavi CRM Credentials - Anyware-Staging.xlsx). Owner `anyware-staging-owner@anyware.software` also belongs to
"Company (Sandbox: test)" — not used. Test users U1 cetow80696 (User @ team1), U2 setoroj338 (User @ team2), U3 yibih11717 (User @ agent x),
U4 yakika6222 (User @ agent z). Hierarchy mode role, Leads visibility hierarchy. Baseline: baseline-anyware.json.
Method: the Java automation is built around NDC-Staging ids/accounts, so every ticket is retested by API (scripts/multi.js + procs-r9.js)
and on screen (scripts/ui.js), following the automation's steps.

## Results

| # | Ticket | Priority | Verdict | Facts |
|---|---|---|---|---|
| 1 | NDC-2412 | urgent | FAIL | r9-2412*.out: Supervisor @team1 and Manager @team1 get 403 on U1 (User @team1) lead 6986f117, not listed; same after 60 s and fresh sign-in (/iam/me Manager @team1). Other OU / same rank / lower→higher hidden; own + owner 200. On NDC-Staging 27 Oct Manager same OU worked. |
| 2 | NDC-2701 | high | PASS | Manager @team2 → 403, not listed; Supervisor @team2 403; U2 list = own/ownerless leads only. Caveat: superiors currently see nothing (2412) — recheck after 2412 fix. |
| 3 | NDC-2294 | high | PARTIAL | r9-2294*.out — see below. 12/13 items work; item 3 Score trigger still missing. |
| 4 | NDC-2406 | high | BLOCKED | r9-2406*.out: integration enabled, on_crm_delete = delete; new CRM contact ffe47fd2 (QA RT 2406) never got a Desk partner — no link after ~12 min (168 links, newest 27 Oct), no Desk contact with its email. Cross-delete can't be run on Anyware. r8 FAIL (NDC-Staging) stands. Possible new issue: CRM→Desk contact sync not running on Anyware. |
| 5 | NDC-2630 | high | DECISION | r9-2630.out: owner (anyware.software) sendability can_send false, reason no_connection (honest); send → 422 MAIL_NO_CONNECTION with the reason; Mails / Sent empty; timeline has no EmailSent; draft kept for retry; compose shows "You can't send email yet: no provider is connected for anyware.software…" (2630-compose.png). The r8 path (connection present, provider fails at send time → timeline EmailSent) can't be reproduced on Anyware (only taviportal.com has a working connection). |
| 6 | NDC-613 | high | PASS | r9-613*.out: U1 with export GRANTED and view self/team/all DENIED → effective set = export only; list 403, export 403; Settings has no Login History link, no Export button; direct URL → "Access Denied — You don't have permission to view login history" (613-direct-url.png). Control: denies lifted → list 200, export 200 (23 rows, all U1's own). Overrides removed (none left). |

| 7 | NDC-2707 | medium | PASS | r9-2707.out: Tasks ×2 — not in blueprint while pending, approved → blueprint "low"; lead made by a blueprint createRecord after-action (L2 8266483e) — approved → rating blueprint "acquired"; control lead L1 same. |
| 8 | NDC-2708 | medium | PASS | r9-2708*.out: approver U1, 62/62 reads of records waiting for U1's approval → 200 (8 leads × 4 + 5 × 3 + 5 × 3), approval state 200. Observation: right after U1 approves, U1 gets 404 "Record not found" on that lead every time (5/5) — approver loses access once decided (hierarchy visibility); owner 200. |
| 9 | NDC-2709 | medium | PASS | r9-2709.out: 4/4 — held, review approved, edit at once 200, edit after 5 s 200; no REVIEW_LOCKED. |
| 10 | NDC-2705 | medium | PASS | Import (Standard Layout, review process channels manual/api/excel_import/workflow): automation ON → lead e8f03a7b held (pending in queue, hidden from list; rejected later by reject_all at deactivation); OFF → 2b773482 not held (as the option says); API control b052bbcd held. |
| 11 | NDC-2538 | medium | BLOCKED | Delivery can't be observed without a public request catcher (not used: no staging data on public hosts). Checked: editor text says every event is posted and signed (X-Anyware-Timestamp + X-Anyware-Signature v1=HMAC-SHA256 "{timestamp}.{body}"); webhook URL stored; internal URL http://127.0.0.1 refused 400; signing secret created on rotate (shown once, 43 chars), masked afterwards. |
| 12 | NDC-2706 | medium | DECISION | r9-2706*.out: 4/4 — On Edit workflow ran after Mass Update (marker set, execution logged), lead in blueprint. But neither Mass Update nor a normal PATCH of the reviewed field puts the lead back into review on Anyware (only creation is held), so the ticket's chain (mass update → held → approve → workflow) can't occur. |
| 13 | NDC-2703 | medium | PASS | Lock rules API: free text refused 400 INVALID_RECORD_LOCK (asks for filter criteria); rule {conditions:[first_name starts_with QA RT 2703 LK]} saved; matching lead edit by owner and U1 → 422 RECORD_LOCKED "This record is locked by the rule 'QA RT 2703 lock' and cannot be edited."; control lead 200; rule deleted. |
| 14 | NDC-492 | medium | PASS | Layout editor (Leads "Standard Layout"): Tab Order tick moves, "Layout saved successfully.", kept after reload; new-lead form on the 2-column "New Section": Top to Bottom → left column first then right; Left to Right → row by row. Restored to Left to Right (verified). |

### NDC-2294 item by item (Anyware, 29 Oct)
1. Import option "Trigger automation and process management" + help text (screen 2294-import-2.png) — PASS.
2. Manual approval now implemented (no longer "Coming soon"): import 1 row with it on → "0 added · 1 waiting for approval"; pending count 1, no lead; approve → lead 26c66d2e created, pending 0 — PASS.
3. Triggers: NoteAdded accepted ("On Note Added") and runs (note → rule Fired, Description set, lead 18606c76) — PASS for notes. Record Score: RecordScoreChanged / RecordScore / ScoreChanged → 400 "Unknown trigger kind"; the editor's "Score value" category is switched off ("Scoring rules land in Phase 5") — FAIL.
4. CreateMeeting (venue office) + ScheduleCall + RunCustomAction all Succeeded (meeting 001ee707, call e3697f47, custom action run 44934e4f) on lead 7aee5dce — PASS (r8: meeting 422).
5. Assign Owner by assignment rule: owner = rule user U1 (lead a1ef246c); ownerOnlyOnlineUsers / ownerNotifyByEmail / ownerTransferRelatedRecords stored (true) — PASS (r8: transfer not stored).
6. Review functions on submitted / approved / rejected / resubmitted stored; run: lead 08fbce13 entered review → RunCustomAction Succeeded; after approval → RunCustomAction Succeeded again — PASS.
7. Role / group approver modes everyone_parallel / everyone_sequential / anyone stored and read back (r8: null); users + everyone refused "Only a role or a group approver can ask everyone…" — PASS (stored). Not run: every role / org unit on this tenant includes real people.
8. Approval final action Call Function ("NDC agency profile"): after approval, RunCustomAction Succeeded (run c5b0d9de) on lead a95b04c3 — PASS (r8: no-op).
9. Blueprint after-actions on Leads (rating acquired → active): addTags (tag on lead), convertLead (lead converted, contact 31952102), customAction (Succeeded), createRecord (task 8bff6081, designer shape targetModuleKey + fields) — PASS. Observation: a createRecord with unknown keys (targetModuleId / fieldValues) is stored without a validation error and does nothing.
10. Per-process rejection reasons stored on the review process (EN/AR, order); org list unchanged — PASS.
11. Scheduled Field Update (120 s): Description set after ~150 s (lead e1c94bcc) — PASS.
12. Several conditions: cond1 / cond2 each run their own action (A → "QA RT cond1", B → "QA RT cond2"), no-match lead untouched; duplicate criteria refused ("part of another condition"), else not last refused, else stored as last — PASS. Else branch not run on an active rule (would match every new lead in the tenant).
13. "trigger": [] → no workflow run; control without it ran — PASS.

## Observations (not filed)
- Blueprint createRecord after-action with unknown keys saved without validation (does nothing at run time).
- Review process PATCH refuses read-only keys echoed from GET (id, moduleId) — the screen sends the right subset; API only.
- Leads layouts on Anyware: both "Standard" (AEX-01) and "Standard Layout" (QA RT item6, now) carry a review process — only one per layout.
- NDC-1950: the built-in User profile has no crm.page.my_requests.view — regular users can't open My Requests until a profile grants it.
- NDC-2414: the unscoped /iam/me/permissions still merges the Desk Administrator's metadata.* keys (view_all, modules.manage, mass_delete, change_owner); the CRM-scoped list and CRM record access are correct.
- NDC-2321: an assignment rule with the Api channel did not set the owner of a lead created through the API (import with the rule chosen works).
- Business Hours: choosing Workweek pre-selects all 7 days, so Save stays disabled until two days are removed; a Workweek save is refused while a shift falls outside the hours ("would invalidate existing shifts").
- NDC-2655: the setting general.company.business_hours is no longer defined; business hours live at /iam/tenant/business-hours.
- NDC-2657: no view-only profile permission yet (only iam.profile.manage) — optional part of the ticket.
