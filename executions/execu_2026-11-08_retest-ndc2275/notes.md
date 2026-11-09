# NDC-2275 retest 8 Nov 2026
PARTIAL. Draft plane-draft.html/json, report.html, image screenshots/annotated/NDC-2275-retest-PARTIAL.png. Nothing posted, nothing cleaned.
Left live: rules + workflows + tickets named "QA RT15 2275 ..." (ledger.md), sign-in files out/owner.json a2.json a3.json.
Direct master switch stays OFF: set off 14:42:46 UTC by Mahmoud Mohamed, around the desk-automation-order baseline. Dept A prefs restored and identical to out/prefs-before.json.
Avoid while that run is active: mahmoud.mahamed1515, Test User 1, Customer Experience Specialists 2, Dev Team 2.

## Posted 9 Nov 2026
User approved "move it to bug with the comment and evidence". Comment + image posted from plane-draft.json with scripts/post-2275.js; state Ready For Test -> Bug. No cleanup done yet; GEN-13 decision still open.

## Cleanup 9 Nov 2026 (user approved)
- Deleted 201 tickets, 21 assignment rules, 3 workflows (all 204), 1 web form contact "Retest" qa.rt15.wf@example.com (204).
- Recycle Bin purged: 205 entries (ticket entries are labelled by the email, matched by record id).
- Verify: 0 tickets, 0 rules, 0 workflows, 0 bin entries. 9 ledger tickets were already 404 before cleanup.
- Sign-in files out/owner.json, a2.json, a3.json deleted. Direct master switch left OFF as found.
- Not touched: older QA tickets assigned by the backlog tests (e.g. #1345, belong to other runs).

## Zoho import comparison 9 Nov 2026 (user: "go ahead and compare with zoho import")
Zoho Desk techsolutionsegypt, dept Haytham Mohamed, Setup > Data Administration > Import > New Import.
- Steps: Upload Files, Module Mapping, Field Mapping, Review. Field Mapping: Create / Overwrite / Both, identifier (None / Ticket External Id), column -> field map (Owner is just a field). Review: summary table + Start Import / Cancel.
- No option anywhere about owner, assignment rules, workflows or automation (seen on every step).
- Stopped at Review; Start Import NOT clicked. Draft import IM 1475109000000491007 left in Zoho (not started). File evidence/zoho/Tickets.csv (2 rows, no owner column).
- Zoho help (importing-data-in-desk, faqs-working-on-tickets) says nothing on rules for imported tickets or owner when no owner column.
- Zoho dept Haytham Mohamed: no Round Robin and no Direct Assignment rules ("no rules created yet"; page also showed "Unable to process your request").
- Runtime behaviour (who owns imported tickets, do rules fire) NOT seen. Needs: create a rule in Zoho + Start Import, then delete -> ask user.
Screens: screenshots/zoho/z-import-*.png, z-rules-*.png

## Zoho import runtime test 9 Nov 2026 (user: "go ahead with the zoho import test on the test account")
Zoho Desk techsolutionsegypt (CEO account Fathy Mehanna), dept Haytham Mohamed. Only agent in dept = Fathy (also the importer).
- Created RR rule "QA RT15 2275 import test": Ticket Create, Subject contains "QA RT15 2275 zoho import", Sequential, agent Fathy.
- Control: New Ticket form (owner pre-filled with signed-in agent; set "Mark as Unassigned") -> #103 assigned. History: "Ticket was assigned through a Round Robin Rule / Rule Name QA RT15 2275 import test / Ticket Owner changed from Unassigned to Fathy Mehanna".
- Import IM 1475109000000491007 (Create, no owner column, 2 rows): Success 2 created -> #104, #105 both **Unassigned**; History only "New ticket created through import"; no RR entry. Still Unassigned ~3-4 min later.
- => Zoho: imported tickets do NOT go through round robin and do NOT default to the importer; they stay Unassigned. Wizard has no rule/automation option.
- TAVI comparison: no-owner rows go to importer (#1681-#1684), rules not run either way.
Cleanup Zoho: tickets #103-105 deleted + purged; contact QA Retest deleted + purged; RR rule deleted (list shows no RR rules again). Left: Import History rows 491007 (Success) and 486050 (Field Mapping, Waiting, nothing imported) - Zoho offers no delete. QA BP items from 1-2 Nov untouched in bin.
Screens: screenshots/zoho/z-rr-*.png, z-ctrl-*.png, z-import-8..15, z-imp-104/105-*.png, z-bin-*.png

## Decision 9 Nov 2026
GEN-13: user chose B, keep importer as owner of no-owner imported rows (differs from Zoho, which leaves them Unassigned). Not posted to Plane.

## I-12 Zoho test 9 Nov
Baseline Haytham Mohamed RR prefs: offline agents ON, dept threshold ON 40, agent threshold OFF, closure OFF, backlogs OFF.
Created Marketing tickets #106, #107 (owner Fathy, contact QA Retest I12 qa.rt15.i12@example.com). RR rule "QA RT15 I12 threshold" (Haytham, subject contains QA RT15 I12 test, Sequential, Fathy).
Results: #108 assigned at threshold 2 (Haytham 1 open + Marketing 2 open) -> Zoho counts only the rule dept. Control #109 Unassigned (Haytham 2 open). #108 set On Hold -> #110 assigned -> On Hold not counted.
Zoho cleanup I-12: threshold restored 40 (verified on reopen), rule deleted, contact QA Retest I12 + tickets #106-#110 deleted and purged. Bin = only QA BP items from 1-2 Nov.

## E-18 30-day rule 9 Nov (user: "try 1 and 2")
- Workaround 2 (import with old date): NOT possible. Import Map fields offers no Created Time / Customer Responded / closed / response fields (only Due Date among dates). customer_responded is a checkbox field. Wizard cleared with Start over.
- Workaround 1 (naturally aged ticket): #1 "Check-in" (created 7 Oct, 0 replies, Closed) reopened + moved (Desk move API) to QA AS6 Dept B unassigned; control "QA RT15 2275 E18 Check-in control" created today. Dept B: temp RR rule (subject contains Check-in, pool A1), offline allowed, threshold 1 so both wait (in_backlog true), then threshold off + Assign backlogs on (limit 10, oldest first).
  Control assigned to A1 at 11:00:36 by trigger backlog. #1 stayed in_backlog, unassigned, 11:00:18 -> 11:15:29 (~14 backlog runs), no skip entry in activity. => PASS (old ticket excluded), reason not shown in History.
- Restore: #1 moved back to dept 2a73bbc0, owner 97be04b6, Closed; record closed_time set back to 2026-10-12T12:43:13; Desk closed_at shows 9 Nov 11:15 (system field, can't be set). #1 History now has reopen/move/close entries from this test. Rule f598b64e + earlier 023d42c6 deleted; control tickets deleted + bin purged; Dept B prefs identical to before. owner.json deleted.
- Network outage ~11:01-11:15 UTC delayed the restore.

## 9 Nov: help-text comment POSTED on NDC-2275 (state Bug kept). I-12 TAVI rerun: Dept B threshold 7, A1 6 in DB/82 total -> #1758 backlog; threshold 83 -> #1759 A1. Restored + purged. Bug draft plane-draft-I12.html/json, not posted.

## 9 Nov: I-12 FILED as NDC-2824 (Medium, Bug, Assignment Rules, Desk module, Sprint 15, 3 assignees, relates NDC-2275 + NDC-1978, image attached). Read back OK.

## E-18 retest 2 (9 Nov 14:25-14:37 Cairo)
Same setup, screenshots. Control #1768 assigned to A1 by backlog run in <1 min; #1 stayed in backlog 10 min (~20 runs). Restored (#1 dept Marketing 2a73bbc0, owner, Closed, record closed_time 12 Oct); rule, control deleted + purged; Dept B prefs identical. Image screenshots/annotated/E18-30-day-rule-backlog-PASS.png.
Part B (old ticket + fresh customer reply -> should be assigned) needs an inbound email: inbound addresses customer-support@ / tech@ help-staging.anyware.software; replies only come in by email (direction inbound); #1 contact = mmohamed@anyware.software. Not done: needs user to send email.

## E-18 Part B, route 1 (9 Nov 14:50 Cairo)
#1 reopened + moved to Customer Support (7e1ac409), owner kept ndc-staging-owner. Agent reply sent from customer-support@help-staging.anyware.software to mmohamed@anyware.software, status Sent ("Reply queued for delivery"). Waiting for a reply from that mailbox. #1 currently OPEN in Customer Support (restore later: Marketing 2a73bbc0, owner O, Closed, closed_time 2026-10-12T12:43:13.2306828+00:00). Nothing posted to Plane.
E18c: user replied ~15:05 Cairo; by 13:17 UTC no inbound reply on #1, no new ticket, quarantine/spam/suppressions empty. Address customer-support@ shows verified, receiving true, receiving_health null.
E18c: user reply sent 13:30 UTC (Zoho Mail, Re: Check-in, to customer-support). Checks to 13:59 UTC: #1 still only outbound reply; no new ticket; quarantine/spam endpoints returned 500 at 13:55 (staging unstable), suppressions empty. Inbound email to customer-support@help-staging not arriving. Route 1 blocked.

## 9 Nov: #1 restored (Marketing, owner O, Closed, closed_time 12 Oct). Email bug drafted: plane-draft-mail.html/json, image MAIL-inbound-reply-not-received.png (user screenshots copied to screenshots/raw/mail-4, mail-5). Not posted.
