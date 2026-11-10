# NDC-1865 functional smoke, Lane H (10 Nov 2026)

NDC-Staging, account mahmoud.mahamed1515 (Desk Administrator). Test ticket #2484 "QA FT 1865 H reply check" (Tech, contact mmohamed@anyware.software). Emails went only to mmohamed@anyware.software, From Tech <tech@help-staging.anyware.software>.

| # | Feature | Verdict | What was proven | Evidence |
|---|---|---|---|---|
| 2 | Activity Life Cycle | Working | Task, call and event created on the ticket (201); task edited (subject, priority) and completed (status Completed, completed_time set); event deleted (204), then restored from the Recycle Bin. The ticket's ACTIVITY tab lists the task and call; Activities search shows both with status. | raw/a2-ticket-activity-tab.png, a3-activities-list.png |
| 8 | Notification rules | Working (trigger only) | Rules are a fixed per-department list of switches (37 for Tech), not user-created rules, so no throwaway rule could be added and none was edited. An enabled rule (contact comment added) fired: a public comment produced "Reply queued / Reply sent" in ticket history. The in-app notification centre lists notifications. | raw/n2-public-comment.png, n3-history.png, n4-bell.png |
| 10 | Data Administration | Partly checked | Recycle Bin: delete + restore + purge work (restore 200, record back 200); Audit Log records the restore. Import wizard works through Upload → Operation → Map fields (3 of 3 auto-mapped) → Assign, but the run was not reached: a second attempt was blocked by "You have an import in progress" (left by the first attempt; cleared with Start over). Export not run: it emails the exporter's own address, which is outside the approved one. Bulk Actions Log not checked (timebox). | raw/d4-import-upload.png, d5-import-map.png, d5-import-assign.png, d-err-assign.png |
| 11 | Collaboration | Working | Private ticket comment with @mention saves a mention chip (rt-mention agent id). Team Feeds: post to HR feed (201), mention list shows HR agents, post deleted (204). | raw/c6-mention-selected.png, c7-comment2-posted.png, f3-feed-posted.png, f5-post-deleted.png |
| 12 | Ticketing Reply | Working | Draft auto-saves (PUT drafts/mine within ~5 s) and is deleted on send; reply sent (201, "Sent"); scheduled reply created for +12 h (201) and discarded (DELETE 204, list empty); public and private comments; ticket closed (status Closed). | raw/r1-composer-ready.png, r2-after-send.png, s2-schedule-dialog.png, s3-after-schedule.png, s4-scheduled-menu.png |
| 13 | Email Templates | Working | Folder + template created; Insert template in a reply resolved {{ticket.number}}, {{ticket.subject}}, {{ticket.status}} (2484 / subject / Open); reply sent with it. The template's own subject was not applied (reply kept "Re: …"). | raw/t1-template-picker.png, t2-template-inserted.png, t4-template-sent.png |
| 14 | CRM ⇄ Desk | Working (create sync) | New Desk contact synced to CRM within seconds (crm_sync_status synced, CRM contact created, link record). Edit sync not checked (timebox). Deleting the Desk contact did not remove the CRM contact (removed separately). | API output in ledger |

Parked sync failures: the failures API returns 226 (the page shows 423). Top reasons: linked Desk record is in the Recycle Bin (64 contacts deletes + 64 contact imports + 29 accounts), CRM record was deleted (29 contacts, 6 accounts), contract missing required values (10 deal imports), Last Name missing in CRM (8), same email already linked to another contact (7 + 2), Desk contract deleted (3). Almost all come from test records deleted on one side.

Observations (not filed):
- Reply All on this ticket left To empty (first time) or put the contact in Cc with To empty (after our own reply). The contact had to be added to To by hand. The ticket was created by API, so this may differ for tickets that arrive by email.
- Inserting a template does not apply the template subject.
- Intermittent staging errors during the run: 503 on /desk/feeds/conversations and /settings/resolved, one "Failed to fetch dynamically imported module" page (new deploy), one sign-out, one network change.
- Side effect: creating the Tech ticket triggers the enabled "department ticket created" rule (in-app + email) for Tech agents; that mail is outside the approved address and could not be avoided.

Emails sent to mmohamed@anyware.software: reply 1, template reply, public-comment notification, and possibly the ticket-closed mail (rule on). Subjects start "Re: QA FT 1865 H reply check".
