# Round 2 · Wave 4 — email, web forms, channels, reminders (27 Oct 2026)

Build index-De3hTVb3.js, staging-crm.taviportal.com. Accounts: owner, plus test user 1 (notifications only, read-only). Zoho org943261092 was used read-only, with the round 1 captures reused. Nothing was sent to Plane.

## Counts
- Tickets retested: 11. 4 pass (NDC-2631, 2632, 2633, 2634), 1 Done ticket still holds (NDC-1333), 5 partly (NDC-2630, 1141, 1479, 2496, 1482), 1 still fails (NDC-1488).
- New candidates: 1 (R2W4-C1, Medium).
- Automation: suite crm-wave4-r2, 9 tests, 7 pass. webFormHostedLink fails (NDC-1488). webFormSpamTrapRefused passed with the old body; the new browser body has not been run.
- Annotated images: 12, in `evidence/annotated/`.

## Per ticket
| Ticket | Plane state | Verdict | Detail | Evidence |
|---|---|---|---|---|
| NDC-1488 | Bug | STILL FAILS | The hosted link (`/embed/feedback/f/{key}`) gives nginx 404. The QR code and "Test your form" use the same link. The embedded form works: lead created with all values, source web_form, owner set. | NDC-1488-retest.png |
| NDC-2630 | RFT | PARTLY FIXED | Compose now shows a red banner and a toast with the reason, and the email list shows `failed` with last_error. The timeline still logs `EmailSent` for the failed email. | NDC-2630-retest.png |
| NDC-2631 | RFT | PASS | `{{company_name}}` gives 422 MAIL_TEMPLATE_UNKNOWN_PLACEHOLDER and lists the 5 allowed placeholders. | NDC-2631-retest.png |
| NDC-2632 | RFT | PASS | List, unread count and preferences all return 200 for the owner and test user 1. Reminder notifications arrive. | NDC-2632-retest.png |
| NDC-2633 | RFT | PASS | Signals page shows readable names, no raw keys. | NDC-2633-retest.png |
| NDC-2634 | RFT | PASS | Portal on: the link opens the sign-in page. Portal off: "This portal is not available". | NDC-2634-retest.png |
| NDC-1141 | Bug | STILL FAILS (clearer) | Gmail and M365 are marked UNAVAILABLE and can't be picked. SendGrid/SES show "coming soon". | NDC-1141-retest.png |
| NDC-1479 | Backlog | PARTLY | Connections are Active and health is ok. The page says "You can send as ndc-staging-owner@taviportal.com", but sending fails because the Zoho org id (zoid) is missing. | NDC-1479-retest.png |
| NDC-2496 | Backlog | PARTLY | Compose, the Introduction template and the signature work. Drafts and scheduled send pass (Java). Send fails (same cause as NDC-1479). | NDC-2496-retest.png |
| NDC-1482 | Backlog | PARTLY | All SMS screens work. 0 credits and no sender ID, so nothing was sent. | NDC-1482-retest.png |
| NDC-1333 | Done | PASS | Activity Reminders settings page has one scroll area. | NDC-1333-retest.png |

## Per feature
| Feature | Verdict | Note |
|---|---|---|
| M01 email connections | PARTLY | 3 connections listed, Active, health ok. Gmail/M365 unavailable (expected). Nothing changed. |
| M02 send from record | FAIL (send) / PASS (compose) | taviportal.com: the send fails (no zoid). anyware.software: not testable with the owner, because compose has no sender choice and an @anyware.software sender is needed (that is Lane A's CRM Admin A). Thread and tracking can't be checked without a sent email. Attachments: the compose button is present, but no file was sent. |
| C14 templates | PASS, with a gap | Placeholder check works. No template folders. A template created with access "everyone" shows "ONLY ME" (minor observation). |
| M04 SMS / WhatsApp | Screens PASS, sending BLOCKED | Nothing sent. Telephony skipped by the user. |
| M06 web forms | PARTLY | Builder and embed work; the submit creates a lead with values, source and owner. Hosted link, QR and "Test your form" give 404 (NDC-1488). Spam trap ignored (R2W4-C1). The same email creates a second lead (duplicates setting null; observation). The captcha form shows Cloudflare Turnstile; the acknowledgement mail (needs captcha) was not checked. |
| M07 portals | PASS | No invites sent. |
| M09 notifications + Signals | PASS | |
| M10 activity reminders | PASS | `before` arrived at 14:11 for a task due 14:16. The task created 8 min ahead got only `at` and `overdue` (observation). |
| M11 calendar | PARTLY | Day, week and month views render. Drag not tested. |

## Candidate
**R2W4-C1 (Medium), web form spam trap ignored.** If the hidden "Leave this field empty" field is filled, the submission still becomes a lead when it is sent the way the embedded form sends it (`page_origin: null`). Seen 5 times: 3 browser submissions (QA R2W4 Spam, Spam 2, Spam 3) and 2 API calls (HPA, HPB). With `page_origin` set, the trap is honoured. Evidence: `R2W4-C1-spam-trap-vs-zoho.png`. Zoho side not checked live.

## Delivery visibility
No email was delivered. The one send to mahmoud.mmohamedsamy@gmail.com failed with a visible error. The web-form acknowledgement mail was not triggered. Nothing was sent to mmohamed@anyware.software. No SMS or WhatsApp sent, no invites.

## Not done
- **Drag in the calendar:** not tested; time went to the email and spam checks.
- **anyware.software send:** needs an @anyware.software sender (Lane A's account).
- **Thread, tracking and attachment delivery:** nothing could be sent.
- **Acknowledgement mail:** needs a solved captcha.
- **Zoho notifications and reminders:** not checked live.
- **webFormSpamTrapRefused rerun with the browser body:** skipped to avoid a 4th owner sign-in. It is expected to fail, which is R2W4-C1.
- **Telephony and Google Sheets:** skipped as instructed.

## Cleanup
- Deleted by exact id (all 204): 8 leads, 2 tasks, 1 template, 2 web forms, 1 portal (`after/b12.json`).
- Purged 15 items from the recycle bin: those 14, plus the Java run's form. Status 200, and no QA R2W4 items left (`after/b14.json`).
- Drafts endpoint returned 405 (no QA drafts listed). The Java test removes its own drafts.
- Diff of the 29 GETs (`after/snapshot.json` vs `baseline/snapshot.json`): all identical except `/telephony/calls/summary`, whose rolling 7-day date window moved (all counts are still 0).
- Test user 1 was read-only, so no preferences were changed.

## Automation (automation-r2w4/)
- New: `src/test/java/qa/features/crmchannels/R2W4ChannelsTest.java` (webFormSpamTrapRefused, reminderBeforeDelivered, unknownPlaceholderRefused).
- New: `src/test/resources/suites/crm-wave4-r2.xml`.
- Changed: `src/test/java/qa/features/crmchannels/ChannelsApiTest.java`. Only group tags were added: NDC-2631, NDC-2634, NDC-2632.
- Line endings: all 3 files are CRLF, the same as the main repo copy, so merging needs no conversion.
