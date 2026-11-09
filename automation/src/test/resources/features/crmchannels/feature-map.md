# crmchannels — CRM email, channels and reminders (go-live Wave 4)

> The memory of this feature. Read it before testing; update it after every run.
> App: TAVI CRM staging-crm.taviportal.com · Reference: Zoho CRM org943261092 (read-only) · Created 2026-10-26
> Plan + manual results: `executions/execu_2026-10-26_crm-golive-waves3-5/wave4/` (results.md, report.md, scripts/ = snippets the tests were ported from)

## How to run
| What | Command (from automation/) |
|---|---|
| All Wave 4 API checks (owner + test user 1, nothing is sent) | `./mvnw test -Dsuite=crm-wave4` |
| One bug | `./mvnw test -Dtags=W4-B2` / `-Dtags=NDC-1488` |

## API (all under /api/v1)
- Email: `GET /mail/connections` (provider, domain, health), `GET /emails/sendability`, `POST /emails` (send — not automated),
  drafts `POST/PUT/GET/DELETE /mail/drafts[/{id}]` `{to, subject, body, body_html, record_type: leads, record_id, attachments, send_at?}`,
  record emails `GET /mail/records/leads/{id}/emails` (module KEY; the module-id form returns an empty list), `GET /mail/emails/{id}` (`last_error`), `/thread`, `/tracking`.
- Templates: `GET/POST /mail/templates`, `PUT /mail/templates/{id}`, `PUT …/favorite`, `DELETE`. Placeholders offered: recipient_name, recipient_email, sender_name, sender_email, today.
- Web forms: `POST /web-forms` (body in `CrmChannelsApi.webForm`), `PUT/DELETE /web-forms/{id}`, `GET …/submissions`; public: `/embed/feedback/index.html?key=…&mode=frame` (200), hosted `/embed/feedback/f/{key}` (404 — NDC-1488).
  Acknowledgement email requires CAPTCHA on (422 CAPTCHA_REQUIRED otherwise); CAPTCHA is Cloudflare Turnstile, so automated submissions only work on a form without CAPTCHA.
- Portals: `POST /record-portals` (body in `CrmChannelsApi.portal`), `PATCH /record-portals/{id}`, `DELETE`; link `/portal/{key}` (404 — W4-B2).
- SMS: `/messaging/templates` (create returns `template_id`; archive only, no delete), sender-ids, balance, campaigns, suppressions, `/messaging/webhooks` (404 = none registered).
- Telephony: `/telephony/providers|integrations|status|calls|calls/summary`; the webhook URL is only shown once after creating an integration.
- Notifications: `/notifications`, `/notifications/unread-count`, `/notifications/preferences/me` (all 500 from ~09:50 UTC on 26 Oct 2026 — W4-B3).
- Activity reminders: tasks carry `due_date` + `reminder_offset_minutes` (none|5|15|30|60|1440); tenant overdue escalation `GET /activity-reminders/overdue-escalation`.

## Traps
- The quick "+ Task" form sends `due_date` WITHOUT a time zone ("2026-10-26T13:06", browser Africa/Cairo); API-made tasks store "…Z".
- Notification preferences and the record-page actions take 10–25 s to load on staging; wait for the content, not for "Loading".
- Capturing browser requests also captures `/iam/auth/refresh` tokens: always redact (scripts/redact.js) before saving.
- Do not create a telephony integration without approval: it switches telephony on for the whole tenant.
- Archived SMS templates can't be deleted (they stay archived).

## Test inventory
| Class | Tests (case → ticket) |
|---|---|
| ChannelsApiTest | draftsAndScheduled (M02, NDC-2496) · templateLifecycle (C14) · unknownPlaceholderNotSilent (W4-B6) · webFormHostedLink (NDC-1488) · portalLinkOpens (W4-B2) · notificationsAnswer (W4-B3) · smsTemplate (M04) · telephonyStatus (M05) |

Manual only: sending an email (allowed once, to the two approved addresses), public form submission and its validation, calendar views, reminder delivery, Zoho comparisons.

## Run history
| Date | Scope | Result |
|---|---|---|
| 2026-10-26 | Manual run + crm-wave4 run 1 | 8 tests: 4 pass, 4 fail = NDC-1488, W4-B2, W4-B3, W4-B6 (all app bugs) |
