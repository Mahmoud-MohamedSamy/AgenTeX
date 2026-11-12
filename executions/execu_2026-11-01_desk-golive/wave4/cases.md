# Wave 4 — Channels & self service: test cases on NDC-Staging (TAVI Desk go-live, written 12 Nov 2026)

Rows O-08, T-37, N-01..N-10 (+ Group Z check of N-11..N-17). Host https://staging-desk.taviportal.com, tenant **NDC-Staging ("Wonder Travel")**; Help Center (portal) on https://staging-crm.taviportal.com/help/hc1…/ . Reference: Zoho Desk Enterprise (reference/zoho-desk-inventory.md sections ZN channels, ZK knowledge base, ZH help center, ZC community) and the live Zoho org (read only) for failures.
Wave 3 (automation) is deferred until the "Desk automation order" session finishes (user, 12 Nov).

**Accounts (one sign-in each):** A owner; **B** mahmoud.mahamed1515@gmail.com (Desk Admin, Marketing) for KB review; **C** fedelav803@meinvr.com (Desk Agent, Customer Support) for permission cases.
**Test data:** prefix `QA GL W4 `, department **Marketing** (no receiving address today). Mail only to/from mmohamed@anyware.software and mahmoud.mmohamedsamy@gmail.com. Created ids → `wave4/after/created.jsonl`.
**Live state read 12 Nov (probe `wave4/raw/probe*.json`):** 1 receiving address customer-support@help-staging.anyware.software (Customer Support), 2 domains (help-staging live, 1 retired), suppressions empty; providers: Zoho Mail anyware.software, SendGrid (send/receive help-staging), shared no-reply sender, Gmail + Microsoft 365 "not available yet"; 41 email templates, 1 folder; web forms: 1 feedback widget + 3/5 advanced forms (one is another tester's "QA AS6 D14 form" — not touched); Help Center "NDC Staging" (EN/AR); Community 5 categories, 1 topic; **KB empty (0 categories, 0 articles)**; **Customer Happiness collection OFF**; Self Service › Help widgets: 1 widget ("Anyware Tech Team").
**Workflow-rule hazard:** a tenant rule fires *on edit* of tickets with channel web. Web-form / portal tickets are therefore not edited by API after creation (reply/comment only). Rules re-read before the run.
**Before / after:** baseline GET of every list above → `wave4/baseline/`; end with `after/diff.txt` + cleanup (tickets, KB, community, forms, widget, templates, folder, any address/block; every setting set back).
Lens: UI · API · NEG · PERM · I18N · SEC · USER (needs you: send a mail / click a link / confirm an inbox) · SET (tenant-wide setting changed for a short window, then set back).

| Id | Row | Screen / API | Steps | Expected (TAVI spec + Zoho behaviour) | Lens |
|---|---|---|---|---|---|
| W4-01 | N-01 | Email › Overview | Open Settings › Channels › Email | "Mail is arriving", checklist done, tabs Addresses / Your domains / Replies / Spam filter / Blocked addresses / Suppressions open without errors | UI+API |
| W4-02 | N-01 | Inbound mail | **You** send "QA GL W4 mail 01" from mmohamed@ to customer-support@help-staging.anyware.software | New ticket in Customer Support, channel Email, contact matched, body intact | USER |
| W4-03 | N-01 | Arabic subject + attachments | **You** send "QA GL W4 بريد ٠٢" with 3 attachments (pdf, png, docx) | Arabic subject exact; 3 attachments on the ticket, downloadable | USER+I18N |
| W4-04 | N-01 | From address on reply | Agent replies on the W4-02 ticket | From = customer-support@help-staging… (not no-reply); **you** confirm From in the inbox | API+USER |
| W4-05 | N-01 | Customer reply threads | **You** reply to the W4-04 mail | Threads on the same ticket (no new ticket) | USER |
| W4-06 | N-01 | Add address — invalid | Add receiving address "abc@", empty, "x@gmail.com" (domain not ours) | Refused with a clear message; nothing saved | NEG |
| W4-07 | N-01 | Add address — valid | Add "qa-gl-w4@help-staging.anyware.software" → Marketing; **you** send a mail to it; then delete the address | Saved/verified; mail becomes a Marketing ticket; delete removes it (Zoho: one address per department mapping) | SET+USER |
| W4-08 | N-01 | Add domain — invalid | Domain "abc", "http://x.com", existing domain again | Refused, no record left | NEG |
| W4-09 | N-01 | Replies tab + persistence | Read reply-from per department; reload | Values unchanged and match sending-overview API | UI+API |
| W4-10 | N-01 | Agent access | C opens /settings/channels/email; C calls POST address API | No settings access; write 403 | PERM |
| W4-11 | N-01 | Arabic UI | Switch UI to Arabic, open Email settings | RTL, no raw keys, no English leftovers | I18N |
| W4-12 | N-02 | Block an address | Block mahmoud.mmohamedsamy@gmail.com; **you** send "QA GL W4 blocked" from it; unblock; **you** send "QA GL W4 unblocked" | First mail: no ticket (or Spam); second: ticket created | SET+USER |
| W4-13 | N-02 | Block — invalid | Block "@@", empty, the same address twice | Refused / no duplicate | NEG |
| W4-14 | N-02 | Spam | Read spam filter settings; mark a QA ticket Spam, find it in Spam view, mark Not spam | Listed in Spam, then back in its view | UI+API |
| W4-15 | N-02 | Suppressions | Open Suppressions (empty); check remove action exists for a listed address (if any) | Empty state clear; list/remove work (Zoho: bounce list) | UI |
| W4-16 | N-02 | Persistence + access | Reload lists; C opens the tabs | Unchanged; C has no access | PERM |
| W4-17 | N-03 | Providers page | Open Integrations › Email Providers; "Check now" | Each provider with health + checked time; check refreshes | UI+API |
| W4-18 | N-03 | SMTP — wrong details | Connect SMTP with host smtp.invalid.example, port 587, fake user/password | Clear error; not saved as Working | NEG |
| W4-19 | N-03 | SMTP — real account | Connect a real SMTP test account and send a reply through it | Mail sent via provider (headers) — **runs only if you give an SMTP test account; else Not run** | USER |
| W4-20 | N-03 | Gmail / Microsoft 365 | Open both cards | Record "not available yet" vs Zoho (Gmail/Outlook supported) — partly built, no bug unless it errors | UI |
| W4-21 | N-03 | Secrets hidden | GET /mail/connections, open a provider's detail | No password / API key / token values returned or shown | SEC |
| W4-22 | N-03 | Agent access | C opens Email Providers; C calls a provider write API | No access; 403 | PERM |
| W4-23 | N-04 | Template list + filters | Filter by department, folder, module, used-for; starred only | Lists match filters; 41 templates; built-ins marked | UI+API |
| W4-24 | N-04 | Create folder + template | Folder "QA GL W4 folder"; template "QA GL W4 template" (Marketing, Tickets, subject with {{ticket.number}}, body with contact name); edit; star; clone | Saved, listed in folder, star/clone work | API+UI |
| W4-25 | N-04 | Placeholders in a sent mail | Reply from a Marketing QA ticket with the template to mmohamed@ | Real values, no `{{…}}` left (stored body + **you** glance at the inbox) | API+USER |
| W4-26 | N-04 | Arabic template | Arabic subject/body template; use it in a reply | Stored and sent intact, RTL in the mail | I18N |
| W4-27 | N-04 | Template — invalid | Empty name; empty subject; unknown placeholder {{ticket.nope}}; HTML/script body | Refused or warned; script stripped | NEG+SEC |
| W4-28 | N-04 | Activate for automatic email | Activate own "Reply acknowledgement" template for Marketing, then deactivate | Own template active, built-in falls back after deactivation | SET |
| W4-29 | N-04 | Delete template in use | Delete a template used by an automatic email | Blocked or clear warning (known NDC-2834 partly fixed) | NEG |
| W4-30 | N-04 | Folder visibility | Make the QA folder private; C lists templates | C does not see the folder or its templates | PERM |
| W4-31 | N-05 | Forms page | Open Web Forms | Feedback widgets + advanced forms with counter "3 of 5", embed code per form | UI+API |
| W4-32 | N-05 | Feedback widget | Create widget for Marketing; try a second for Marketing | First saved with embed code; second refused (one per department) | API+NEG |
| W4-33 | N-05 | Advanced form + limit | Create "QA GL W4 form" (Marketing, Standard layout) → 4/5; create "QA GL W4 form 2" → 5/5; try a 6th | 6th refused with the limit message | API+NEG |
| W4-34 | N-05 | Hosted link | Open the form's hosted link signed out; submit "QA GL W4 form 01" (mmohamed@) | Thank-you; ticket in Marketing, channel Web (known NDC-1488: nginx 404) | UI |
| W4-35 | N-05 | Iframe / test form | Submit through "Test your form" / iframe address signed out | Ticket created in Marketing | UI |
| W4-36 | N-05 | Required + invalid | Submit without email; with "abc" as email; over-long subject | Blocked with field messages; no ticket | NEG |
| W4-37 | N-05 | Script embed | Paste the script snippet into a local HTML page and open it | Form loads and submits (known NDC-2751 CORS) | UI |
| W4-38 | N-05 | CAPTCHA | Turn on CAPTCHA for the QA form | Form shows a CAPTCHA; submit without solving refused | UI+NEG |
| W4-39 | N-05 | Disable form | Disable the QA form; open hosted link; POST to public submit | "Not available" page; submission refused | NEG |
| W4-40 | N-05 | XSS in a field | Submit `<img src=x onerror=alert(1)>` in subject/description | Stored and shown as text on the ticket | SEC |
| W4-41 | N-05 | Arabic form | Arabic labels/values; open hosted link in Arabic | RTL; Arabic values saved | I18N |
| W4-42 | N-06 / O-08 | Portal home | Open the Help Center URL from settings signed out | Loads (name, logo, KB, community, submit ticket) | UI |
| W4-43 | N-06 | Sign up + sign in | Sign up with mahmoud.mmohamedsamy@gmail.com (if no account yet); **you** confirm the mail; sign in | Account works; name shows | USER |
| W4-44 | N-06 | Submit ticket | Signed in, submit "QA GL W4 portal 01" | Desk ticket, contact = that customer, channel Web/Portal, department per "Ticket properties" | UI+API |
| W4-45 | N-06 | My tickets + reply | Agent replies + adds a private comment; customer opens My tickets, replies | Agent reply visible, private comment hidden; customer reply threads in Desk | UI+API |
| W4-46 | N-06 | Own tickets only | Customer opens another contact's ticket id (URL + public API) | No access (404/403), no data | PERM+SEC |
| W4-47 | N-06 | Wrong password | Sign in with wrong password / unknown email | Same generic error, no "user exists" leak | NEG+SEC |
| W4-48 | N-06 | Rebranding | Rename Help Center "NDC Staging QA"; 101 chars; name with a web address | Valid name shows on portal; invalid refused; set back | SET+NEG |
| W4-49 | N-06 | Languages | Portal in Arabic | RTL, menus Arabic | I18N |
| W4-50 | N-06 | Access / SEO / User authentication | Read each tab; change SEO title and set back | Saves and restores; record User authentication options (SSO = Group Z) | SET |
| W4-51 | O-08 | Unknown page | Open portal URL + "/xyz" | Portal "page not found", not raw nginx 404 | NEG |
| W4-52 | N-06 / N-16 | Help widgets | Open Self Service › Help widgets; create "QA GL W4 widget" (Marketing); snippet shown; delete | Saved/listed/deleted; snippet present (inventory row N-16 says Missing → update) | UI+API |
| W4-53 | N-07 | Category | Create community category "QA GL W4 cat" (Marketing); reorder; disable; enable | Shown/hidden in portal accordingly | API+UI |
| W4-54 | N-07 | Customer posts | Signed-in customer posts "QA GL W4 topic" (Question) in the QA category | In moderation or live per setting | UI |
| W4-55 | N-07 | Moderate + reply | Agent approves and replies | Topic live, reply visible in portal | UI+API |
| W4-56 | N-07 | Topic — invalid | Empty title; signed-out user tries to post | Refused; asked to sign in | NEG+PERM |
| W4-57 | N-07 | Spam / report | Customer reports a reply; moderation counts | Shows under Reported spam; counts update | UI |
| W4-58 | N-07 | Topic to ticket | Convert the topic to a ticket (if offered) | Ticket with topic text, linked back | UI |
| W4-59 | N-07 | Arabic topic | Post an Arabic topic | RTL, saved intact | I18N |
| W4-60 | N-08 | Category + article | KB category "QA GL W4 KB"; article "QA GL W4 article" with an image; publish | In KB list and in the portal | API+UI |
| W4-61 | N-08 | Draft hidden | Save "QA GL W4 draft" as draft; search the portal | Not found in portal | UI |
| W4-62 | N-08 | Review flow | Send an article for review to B; B approves | Published after approval; REVIEW list empties | AGENT |
| W4-63 | N-08 | Expiry | Set expiry a few minutes ahead | Moves to EXPIRED, gone from portal | UI+API |
| W4-64 | N-08 | Invalid / XSS | Publish without title; body with `<script>` | Refused; script stripped | NEG+SEC |
| W4-65 | N-08 | Internal article | Visibility agents only | Not in portal; visible in Desk | PERM |
| W4-66 | N-08 | Templates + gallery | Create KB template "QA GL W4 tpl"; upload an image to the Gallery; use both | Template prefills; image reusable | UI |
| W4-67 | N-08 | Arabic article + search | Arabic article; portal search an Arabic word | RTL; found | I18N |
| W4-68 | N-08 | Feedback + comments | Customer likes/dislikes + comments; agent sees counts | Likes/dislikes/comments counted in the list | UI |
| W4-69 | N-09 | Translation | Add Arabic translation to the QA article; portal in Arabic | Arabic version shown; missing translation falls back (record which) | UI+I18N |
| W4-70 | N-09 | Versions | Edit + publish twice; open versions; restore the first | Older versions listed; restore works (inventory: "Not confirmed" → settle) | UI |
| W4-71 | N-10 | Settings page | Open Customer Happiness; validate expiry 0 / 91, empty question | Out-of-range refused; page saves valid values | NEG |
| W4-72 | N-10 | Turn on (Marketing only) | Enable collection, "On every response", department scope = Marketing only | Saved; other departments unaffected (set back to OFF at the end) | SET |
| W4-73 | N-10 / T-37 | Rating from reply | Reply on a Marketing QA ticket to mmohamed@; **you** click Good + comment | Thank-you page; rating + comment on the ticket | USER |
| W4-74 | T-37 | Rate again | **You** click Bad on the same link | Latest rating shown (or "already rated" — record vs Zoho) | USER |
| W4-75 | N-10 / T-37 | Tampered link | Change the link token | Error page; nothing saved | NEG+SEC |
| W4-76 | N-10 | Arabic + long comment | Bad with a long Arabic comment; open the link in Arabic | Saved fully; RTL page | I18N |
| W4-77 | N-10 | Turn off | Turn collection off; open an already-sent link | Short "no longer accepting" message | SET |
| W4-78 | T-37 | Agent view | C opens a rated ticket shared to C (or B) | Rating shown read-only | PERM |
| W4-79 | N-10 | Translations file | Download English file; import it back unchanged | Import succeeds, nothing changed | UI |
| W4-80 | O-08 | Second brand / domain | Try a second Help Center "QA GL W4 brand"; custom domain "abc" | Saved or "not available" (record); invalid domain refused | NEG |
| W4-81 | O-08 | Agent access | C opens Help Center / Web Forms / Community settings | No access | PERM |
| W4-82 | Z | Still missing? | Open Live chat, Social, and look for Phone, IM, Guided conversations, HC SSO | "In development" / absent → confirm NDC-2760 list; Help widgets (N-16) noted from W4-52 | UI |
| W4-83 | all | Cleanup + diff | Delete all QA GL W4 data, set back every setting, GET diff vs baseline | Zero QA GL W4 left; settings equal to baseline | API |

## What I need from you during the run
- **Mails:** W4-02, 03, 05, 07, 12 (twice) — from mmohamed@ (W4-12 from the Gmail). I'll tell you each subject when it's time.
- **Links / inbox:** W4-04 and W4-25 (glance at From / body), W4-43 (sign-up confirmation in mahmoud.mmohamedsamy@gmail.com), W4-73/74/76 (click the rating links).
- **SMTP test account** for W4-19 (otherwise Not run).
- **OK for short tenant-wide changes, each set back at once:** extra receiving address (W4-07), blocking the Gmail (W4-12), activating a template for Marketing (W4-28), Help Center name/SEO (W4-48/50), Customer Happiness ON for Marketing only (W4-72..77).

## Already seen by earlier runs (context only, retested here)
N-01-01/02/06 pass (8–10 Nov), N-05-02 fail NDC-1488, N-05-03 pass, N-04-05 fail NDC-2834 (partly fixed), N-10-01/02 pass (rating link in closed mail), N-06-03 partly.
