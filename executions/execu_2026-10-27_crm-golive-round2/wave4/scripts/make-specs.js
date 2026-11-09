// Writes the API fact cards (card-*.json) and the annotated-image specs (spec-*.json) for round 2 Wave 4, from the logged facts.
const fs = require('fs'), path = require('path');
const D = __dirname;
const ENV = 'staging-crm.taviportal.com, build of 27 Oct (owner; public pages not signed in) vs Zoho CRM org943261092 (read-only, captured 26 Oct)';
const DATE = '27 Oct 2026';
const card = (out, title, lines) => fs.writeFileSync(path.join(D, 'card-' + out.replace('.png', '') + '.json'), JSON.stringify({ out, title, lines }, null, 1));
const spec = (o) => fs.writeFileSync(path.join(D, 'spec-' + o.out.replace('.png', '') + '.json'), JSON.stringify(Object.assign({ env: ENV, date: DATE }, o), null, 1));
const full = (img, w, h, caption, boxes, crop) => ({ img, w, h, caption, crop: crop || [0, 0, w, h], boxes: boxes || [] });

// ---- cards (facts from after/*.json and auto-run logs) ----
card('api-c1-spam-trap.png', 'TAVI public web form — the hidden spam-trap field ("Leave this field empty"), 27 Oct 2026', [
  ['Embedded form, browser, trap filled ("i am a bot")      -> "Thank you…"  lead QA R2W4 Spam created', 'bad'],
  ['Embedded form, browser, trap filled ("http://spam.example") -> lead QA R2W4 Spam 2 created', 'bad'],
  ['Embedded form, browser, trap filled ("bot")             -> lead QA R2W4 Spam 3 created', 'bad'],
  ['Request the form sends: POST /web-forms/public/{key}/submissions', 'info'],
  ['   {"values":{…}, "page_origin":null, "elapsed_ms":4496, "visitor_id":…, "honeypot":"bot"}', 'info'],
  ['Same body by API, trap "bot" (with and without elapsed_ms) -> 200, leads QA R2W4 HPA / HPB created', 'bad'],
  ['Control: page_origin set to the site, trap filled        -> 200 "submitted", NO lead', 'ok'],
  ['Normal submission, trap empty                             -> lead created (expected)', 'ok']
]);
card('api-2630-failed-send.png', 'TAVI — one test email from QA lead "QA R2W4 mail 16188" to mahmoud.mmohamedsamy@gmail.com, 27 Oct 2026', [
  ['POST /emails -> 422; compose shows red "The email wasn\'t sent: No Zoho account found for sender …" + error toast', 'ok'],
  ['GET /mail/records/leads/{id}/emails -> status "failed", last_error names the missing Zoho org id (zoid), can_resend true', 'ok'],
  ['GET /timeline/records/leads/{id}/feed -> [EmailSent, RecordCreated]   (a failed email is still logged as sent)', 'bad'],
  ['Settings › Email still says "You can send as ndc-staging-owner@taviportal.com through Zoho Mail"', 'bad'],
  ['Delivery to mahmoud.mmohamedsamy@gmail.com: not received (the send failed)', 'info']
]);
card('api-2631-placeholder.png', 'TAVI API — email template with a placeholder that can\'t be filled, 27 Oct 2026', [
  ['POST /mail/templates  body "…at {{company_name}}."  -> 422 MAIL_TEMPLATE_UNKNOWN_PLACEHOLDER', 'ok'],
  ['message: "These placeholders can\'t be filled when composing: {{company_name}}.', 'ok'],
  ['          Use one of: {{recipient_email}}, {{recipient_name}}, {{sender_email}}, {{sender_name}}, {{today}}."', 'ok'],
  ['POST /mail/templates  body with {{recipient_name}} and {{today}} -> 201 (control)', 'ok'],
  ['Automated: ChannelsApiTest#unknownPlaceholderNotSilent and R2W4ChannelsTest#unknownPlaceholderRefused pass', 'ok']
]);
card('api-2632-notifications.png', 'TAVI API — notification endpoints, 27 Oct 2026 (owner and test user 1)', [
  ['owner   GET /notifications?limit=5        -> 200', 'ok'],
  ['owner   GET /notifications/unread-count   -> 200 (283 unread)', 'ok'],
  ['owner   GET /notifications/preferences/me -> 200', 'ok'],
  ['user 1  GET /notifications?limit=5 / unread-count / preferences/me -> 200 / 200 / 200', 'ok'],
  ['Reminders now arrive: QA task 2 "before" at 14:11, QA task 1 "at" 14:00 and "overdue" 14:02 (UTC)', 'ok'],
  ['Automated: ChannelsApiTest#notificationsAnswer and R2W4ChannelsTest#reminderBeforeDelivered pass', 'ok']
]);
['api-c1-spam-trap.png', 'api-2630-failed-send.png', 'api-2631-placeholder.png', 'api-2632-notifications.png'].forEach(() => 0);

// ---- specs ----
spec({ out: 'R2W4-C1-spam-trap-vs-zoho.png', ticket: 'R2W4-C1', verdict: 'FAIL', label: 'NEW CANDIDATE', title: 'Web Forms | a submission with the hidden spam-trap field filled is still turned into a lead',
  panels: [full('api-c1-spam-trap.png', 1600, 560, 'TAVI — the embedded form and the same request by API: the trap value is sent, the lead is created anyway.', [{ b: [0, 70, 1600, 220], n: 1 }, { b: [0, 300, 1600, 370], n: 2 }]),
    full('z-webforms.png', 1600, 950, 'Zoho — Setup › Webforms (read-only). Zoho forms use a CAPTCHA and spam settings; submitting a Zoho form was not done.', [], [257, 66, 1327, 520])],
  rows: [['1', 'Submission with the hidden "Leave this field empty" field filled', 'Not checked live (would need a saved Zoho form)', '3 browser submissions with the trap filled all became leads (QA R2W4 Spam, Spam 2, Spam 3)', 'FAIL'],
    ['2', 'Same request by API', 'Not checked live', 'With page_origin null (what the form sends) the lead is created; only with page_origin set is it refused', 'FAIL']] });
spec({ out: 'NDC-1488-retest.png', ticket: 'NDC-1488', verdict: 'FAIL', label: 'STILL FAILS', title: 'Web Forms | the hosted link (also behind the QR code and "Test your form") opens nginx 404',
  panels: [full('tavi-webform-hosted-404.png', 1400, 900, 'TAVI — the form\'s share_url /embed/feedback/f/{key}, opened signed out: "404 Not Found — nginx".', [{ b: [380, 0, 1020, 140], n: 1 }], [0, 0, 1400, 300]),
    full('z-webforms.png', 1600, 950, 'Zoho — Setup › Webforms: forms are created here and published with a hosted link (read-only; no form saved).', [{ b: [843, 520, 940, 555], n: 1, color: '#16a34a' }], [257, 66, 1327, 520])],
  rows: [['1', 'Hosted link / QR code / Test your form', 'Forms have a hosted link (not opened live: would need a saved Zoho form)', 'share_url answers 404 nginx; the QR code and "Test your form" use the same address', 'FAIL'],
    ['2', 'Embedded form (iframe)', 'Embed code available (not checked live)', 'Works: submission created lead "QA R2W4 Web 64484" with all 4 values, source web_form, owner set', 'PASS']] });
spec({ out: 'NDC-2630-retest.png', ticket: 'NDC-2630', verdict: 'PARTIAL', label: 'PARTLY FIXED', title: 'Email | a failed send is now shown as failed on screen, but the timeline still logs "EmailSent"',
  panels: [full('tavi-compose-after-send.png', 1600, 950, 'TAVI — Compose after Send: red banner and toast "The email wasn\'t sent: No Zoho account found for sender …".', [{ b: [376, 130, 1224, 177], n: 1 }, { b: [1157, 862, 1576, 925], n: 1 }], [352, 48, 1248, 900]),
    full('api-2630-failed-send.png', 1600, 330, 'TAVI API — the email is stored as failed, but the timeline entry says EmailSent.', [{ b: [0, 125, 1600, 165], n: 2 }]),
    full('z-lead-emails.png', 1600, 950, 'Zoho — a lead\'s Emails related list (read-only). Zoho\'s handling of a failed send was not checked live (our Zoho org can\'t be made to fail).', [])],
  rows: [['1', 'What the sender sees when sending fails', 'Not checked live', 'Clear error banner and toast with the reason (was "Sent" on 26 Oct) — fixed', 'PASS'],
    ['2', 'Timeline after a failed send', 'Not checked live', 'Still logs "EmailSent" for the failed email; the record\'s email list shows it as failed', 'FAIL']] });
spec({ out: 'NDC-2631-retest.png', ticket: 'NDC-2631', verdict: 'PASS', label: 'RETEST PASS', title: 'Email Templates | a placeholder the template can\'t fill is now refused with a clear message',
  panels: [full('api-2631-placeholder.png', 1600, 330, 'TAVI API — saving a template with {{company_name}} is refused and the message lists the allowed placeholders.', [{ b: [0, 70, 1600, 210], n: 1 }]),
    full('z-templates.png', 1600, 950, 'Zoho — email templates (read-only): merge fields are picked from the module\'s field list.', [])],
  rows: [['1', 'Template with an unfillable placeholder', 'Merge fields come from a picker, so unknown ones can\'t be inserted (insert not checked live)', '422 MAIL_TEMPLATE_UNKNOWN_PLACEHOLDER naming {{company_name}} and the 5 allowed placeholders', 'PASS']] });
spec({ out: 'NDC-2632-retest.png', ticket: 'NDC-2632', verdict: 'PASS', label: 'RETEST PASS', title: 'Notifications | the notification calls answer again for every user',
  panels: [full('api-2632-notifications.png', 1600, 400, 'TAVI API — list, unread count and preferences answer 200 for the owner and test user 1; reminders arrive.', [{ b: [0, 70, 1600, 240], n: 1 }, { b: [0, 245, 1600, 290], n: 2 }]),
    full('t-bell.png', 1600, 950, 'TAVI — the bell lists notifications again.', [])],
  rows: [['1', 'Notification list, unread count, preferences', 'Not checked live', '200 for both users (all 500 on 26 Oct)', 'PASS'],
    ['2', 'Activity reminder notifications', 'Not checked live', '"before", "at" and "overdue" reminders for the QA tasks arrived', 'PASS']] });
spec({ out: 'NDC-2633-retest.png', ticket: 'NDC-2633', verdict: 'PASS', label: 'RETEST PASS', title: 'Notifications | Signals (My Notifications) shows readable names, no raw event keys',
  panels: [full('t-signals.png', 1600, 950, 'TAVI — Settings › Signals: every signal has a plain name (Email opened, Link clicked, Activity reminders: upcoming, …).', [{ b: [293, 505, 700, 945], n: 1 }], [268, 60, 820, 890])],
  rows: [['1', 'Signal names on the preferences page', 'Not checked live', 'All names readable; no raw keys found on the page (was mail.email_received, crm.mass_delete.* …)', 'PASS']] });
spec({ out: 'NDC-2634-retest.png', ticket: 'NDC-2634', verdict: 'PASS', label: 'RETEST PASS', title: 'Portals | the customer portal link opens its sign-in page, and says "not available" when off',
  panels: [full('tavi-portal-on.png', 1400, 900, 'TAVI — QA portal switched on, link opened signed out: the portal\'s Sign in page.', [{ b: [480, 92, 920, 512], n: 1 }], [0, 0, 1400, 560]),
    full('tavi-portal-off.png', 1400, 900, 'TAVI — the same link with the portal switched off: "This portal is not available".', [{ b: [480, 130, 920, 220], n: 2 }], [0, 0, 1400, 400]),
    full('z-portals.png', 1600, 950, 'Zoho — Setup › Portals (read-only): portals are set up here; no portal exists in our org, so its link was not opened.', [{ b: [287, 155, 423, 187], n: 1, color: '#16a34a' }], [257, 66, 1327, 300])],
  rows: [['1', 'Portal link while switched on', 'Opens the portal sign-in (not checked live: no Zoho portal set up)', 'Opens the portal\'s Sign in page (was nginx 404 on 26 Oct)', 'PASS'],
    ['2', 'Portal link while switched off', 'Not checked live', 'Clear page: "This portal is not available … switched this portal off"', 'PASS']] });
spec({ out: 'NDC-1141-retest.png', ticket: 'NDC-1141', verdict: 'PARTIAL', label: 'STILL FAILS', title: 'Email | Gmail and Microsoft 365 still can\'t be connected; now marked "Unavailable" up front',
  panels: [full('t-connect-provider-dialog.png', 1600, 950, 'TAVI — Connect a provider: Google (Gmail) and Microsoft 365 are marked UNAVAILABLE and can\'t be picked; SendGrid / SES "coming soon".', [{ b: [488, 340, 796, 455], n: 1 }, { b: [488, 556, 796, 639], n: 1 }, { b: [804, 556, 1112, 639], n: 2 }], [464, 230, 672, 490]),
    full('z-email-providers.png', 1600, 950, 'Zoho — email configuration offers Gmail, Outlook / Microsoft 365, IMAP and others (read-only).', [])],
  rows: [['1', 'Connect Gmail / Microsoft 365', 'Available', 'Shown as "Unavailable" and disabled (clearer than the error on 26 Oct), still can\'t be connected', 'FAIL'],
    ['2', 'Transactional (SendGrid / SES)', 'Not checked live', '"coming soon", no configuration fields', 'FAIL']] });
spec({ out: 'NDC-1479-retest.png', ticket: 'NDC-1479', verdict: 'PARTIAL', label: 'PARTLY WORKS', title: 'Email | connections listed and healthy, but the taviportal.com connection can\'t send',
  panels: [full('t-email-integrations.png', 1600, 950, 'TAVI — Settings › Email: "You can send as ndc-staging-owner@taviportal.com through Zoho Mail"; both Zoho Mail connections Active.', [{ b: [292, 246, 1012, 292], n: 1 }, { b: [292, 306, 1012, 456], n: 2 }], [268, 60, 760, 520]),
    full('z-email-providers-list.png', 1600, 950, 'Zoho — email providers list (read-only).', [])],
  rows: [['1', 'Can the owner send?', 'Not checked live', 'Page says yes, but a real send fails: the connection is missing its Zoho org id (zoid). Team: please set it', 'FAIL'],
    ['2', 'Connections list and health', 'Providers listed with status', 'taviportal.com and anyware.software Active, health "ok"', 'PASS']] });
spec({ out: 'NDC-2496-retest.png', ticket: 'NDC-2496', verdict: 'PARTIAL', label: 'PARTLY WORKS', title: 'Email | compose with template and signature works; sending fails (missing Zoho org id)',
  panels: [full('tavi-compose-after-send.png', 1600, 950, 'TAVI — Compose: To, template "Introduction", subject, body and signature filled; the send is refused with a clear error.', [{ b: [376, 245, 1224, 640], n: 1 }, { b: [376, 655, 1224, 836], n: 1 }, { b: [376, 130, 1224, 177], n: 2 }], [352, 48, 1248, 900]),
    full('z-lead-emails.png', 1600, 950, 'Zoho — sending from a record (read-only).', [])],
  rows: [['1', 'Compose: template, merge, signature, drafts', 'Available', 'Works (drafts and scheduled send pass in the automated test)', 'PASS'],
    ['2', 'Send', 'Sends (not checked live)', 'Fails: "No Zoho account found for sender" (connection setup, NDC-1479)', 'FAIL']] });
spec({ out: 'NDC-1482-retest.png', ticket: 'NDC-1482', verdict: 'PARTIAL', label: 'PARTLY WORKS', title: 'SMS | every SMS screen works; nothing can be sent (0 credits, no sender ID)',
  panels: [full('t-sms.png', 1600, 950, 'TAVI — Settings › SMS: tabs Overview, Usage, Rates, Test send, Templates, Campaigns, Sender IDs, Opt-outs, Webhooks; balance 0 credits.', [{ b: [383, 155, 1140, 190], n: 1 }, { b: [383, 290, 700, 345], n: 2 }], [268, 60, 1330, 560]),
    full('z-sms.png', 1600, 950, 'Zoho — Notification SMS settings (read-only).', [])],
  rows: [['1', 'SMS screens', 'Available', 'All tabs open; templates, campaigns, opt-outs and webhooks screens work', 'PASS'],
    ['2', 'Send an SMS', 'Not checked live', 'Not possible: 0 credits and no sender ID on staging (team: please add a sender ID and a few credits)', 'BLOCKED']] });
spec({ out: 'NDC-1333-retest.png', ticket: 'NDC-1333', verdict: 'PASS', label: 'RETEST PASS', title: 'Activity Reminders | the settings page has one scroll area',
  panels: [full('t-activity-reminders.png', 1600, 950, 'TAVI — Settings › Activity Reminders: one page scroll area (the two small lists inside are pickers).', [], [268, 60, 1330, 890])],
  rows: [['1', 'Scrolling on the settings page', 'Not checked live', 'One main scroll area (was two)', 'PASS']] });
console.log('written');
