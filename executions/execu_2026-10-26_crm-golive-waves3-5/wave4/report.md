# CRM go-live — Wave 4: email, channels and reminders — report

26 Oct 2026 · staging-crm.taviportal.com · owner + test user 1 · Lane B of the parallel Gate 1 plan (../plan.html).
Case facts: `results.md`. Evidence: `evidence/annotated/` (approved TAVI-vs-Zoho layout), raw shots, API cards and Zoho captures in `evidence/raw/`.
Nothing went to Plane. No ticket of this wave was In Progress. No HTTP 429.

## Tickets
| Ticket | Verdict | Facts |
|---|---|---|
| NDC-1141 | Still fails | Gmail and Microsoft 365 can't be connected ("not configured on this server"); transactional SendGrid / SES "coming soon" |
| NDC-1488 | Still fails | Embedded (iframe) form works and creates the lead; hosted link, QR code and "Test your form" open nginx 404 |
| NDC-1479 | Partly | Providers and connections fine; the taviportal.com Zoho Mail connection can't send (missing org id) although it shows healthy |
| NDC-2496 | Partly | Compose with templates, signature, drafts and scheduled email work; sending fails (W4-B1) |
| NDC-1482 | Partly | All SMS screens and templates work; nothing can be sent (no sender ID, 0 credits) |
| NDC-1333 | Still fixed | Activity Reminders page has one scroll area |
| NDC-1493, 1494, 1495, 1496, 1497, 1498, 1944, 1949 | Blocked | Need a telephony integration; staging has none, and creating one switches telephony on for the tenant |

## New bug candidates (each re-checked a second way)
| ID | Sev. | Title |
|---|---|---|
| W4-B1 | High | A failed email send looks sent: screen "Sent", timeline "EmailSent", Mails tab "No emails yet", no notification; API status "failed" ("No Zoho account found … set the 'zoid' org id on the connection") |
| W4-B2 | High | Customer portal link is nginx 404 whether the portal is on or off |
| W4-B3 | High | Every notification call (list, unread count, preferences) answers 500 for every user, from ~09:50 UTC, still at 10:49; bell empty, My Notifications blank, reminders can't arrive |
| W4-B5 | Low | My Notifications shows raw event keys (mail.email_received, salesiq.*, crm.activity.reminder.*, crm.mass_delete.*) |
| W4-B6 | Low | A template placeholder that can't be filled (`{{company_name}}`) is saved and comes out blank in compose ("…at .") with no warning |

## Notes (no ticket proposed)
Spell-check answered 503 during compose · "+ Task" quick form sends the due time without a time zone (API tasks store UTC; reminder effect not checkable while notifications are down) · Call Logs totals stay "…" instead of 0 · web-form builder offers the "FieldPermissions" test layout first · one "You don't have access to CRM" page and one 502 page for the owner, both cleared on reload.

## Differences from Zoho (gap list)
No record fields, folders or usage stats in email templates · no personal signatures · calendar items can't be dragged to another day · no web-form A/B testing · fewer mailbox providers.

## Needed from the team
1. Set the Zoho org id on the taviportal.com mail connection, so sending can be retested.
2. Approve or set up one QA telephony integration (8 blocked tickets).
3. A sender ID and a few credits on staging to test SMS sending.
4. Recheck reminders once notifications work again.

## Evidence
NDC-1141, 1333, 1479, 1482, 1488, 2496 retest images; NDC-1493-1498-1944-1949 telephony blocked; W4-B1, B2, B3, B5, B6.

## Automation
New feature `crmchannels` (8 API tests, run once: 4 pass, 4 fail = app bugs NDC-1488, W4-B2, W4-B3, W4-B6). Suite `crm-wave4.xml`.

## Clean-up
All QA W4 web forms, portals, templates, drafts, leads and tasks deleted; 13 QA W4 bin items purged. Left: 2 archived QA SMS templates (archived templates can't be deleted). One "+ Task" QA task was already gone before clean-up (404, not in the bin; cause unknown). Test user 1 notification preferences never changed (only 500s). `after/diff.txt` matches the morning snapshot apart from the 2 archived SMS templates, Lane C's new modules in the web-form module list, and the notification outage. One saved capture held an auth token; it and all recorded requests were redacted.
