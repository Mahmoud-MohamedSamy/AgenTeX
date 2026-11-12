# Wave 4 results (NDC-Staging, 12-13 Nov 2026)

| Id | Verdict | Note |
|---|---|---|
| W4-01 | PASS | Overview: Mail is arriving, 4 of 4 done; all 6 tabs open. Note: Overview lists 1 receiving address while the Addresses tab shows 2 (Customer Support, Tech). |
| W4-02 | PASS | Your mail -> #3278 in Customer Support, channel Email, contact matched (mmohamed@), body (signature) kept. |
| W4-03 | PASS | #3279: Arabic subject kept as sent; the one attachment you sent (images.png) is on the ticket, public, downloadable. (Subject was reversed by copying from the terminal.) |
| W4-04 | PASS | Agent reply on #3278 reached you from customer-support@help-staging.anyware.software (you confirmed); Marketing replies come from qa-gl-w4@. |
| W4-05 | PASS | Your replies threaded on #3278 and #3280 (inbound, Re: subject), no new ticket. |
| W4-06 | PASS | Empty, 'abc@', 'qa gl', existing 'customer-support' and no department all refused with clear messages; nothing saved. |
| W4-07 | PASS | Mail to qa-gl-w4@ -> #3280 in Marketing (channel Email). Replies on it go out from qa-gl-w4@. Address to be deleted at cleanup. |
| W4-08 | FAIL | 'http://x.com' saved as 'http:%2f%2fx.com' and 'exa mple.com' (space) saved, awaiting proof; 'abc' and the existing domain get 503 'our side, try again' instead of a validation message. Removing a domain only retires it (stays listed). |
| W4-09 | PASS | Replies tab: acknowledgement wording + quote position 'Agent's reply on top' match /desk/channels/settings (ack on, quote above); no change made. |
| W4-10 | PASS | Agent C: settings page says 'You cannot view the email channel'; GET addresses 403; POST address 403 (desk:channel:manage). |
| W4-11 | PASS | Email settings in Arabic (as admin B): full RTL, Arabic labels, no raw keys; language set back to English. |
| W4-12 | INCONCLUSIVE | Block/unblock of a spare address works. Live mail part not run: both test mailboxes have open tickets from other tests and blocking closes them. |
| W4-13 | FAIL | '*@example.com' accepted and listed as blocked although the page says Desk blocks one address at a time, not a domain. Empty: Block disabled; '@@': browser email check; same address twice: no duplicate. Unblock works. |
| W4-14 | PASS | Spam filter options read (Deliver everything / Deliver and mark / Hold for review / Hold from new senders; policy off). Policy not changed: other sessions receive mail now. Mark spam / not spam passed as W2-43 today. |
| W4-15 | PASS | Suppressions: empty, clear text on how entries appear and that they can be released. |
| W4-16 | PASS | Agent C: spam-contacts GET/POST 403 (desk:spam:manage). |
| W4-17 | PASS | Providers listed with health and checked time; Check now refreshes (POST /mail/platform/status/refresh 200). |
| W4-18 | PASS | Fake SMTP host: 422 'The SMTP server could not be reached, so nothing was saved', shown as a toast; not saved. |
| W4-19 | NOT RUN | Skipped by you (no SMTP test account). |
| W4-20 | PASS | Gmail and Microsoft 365: 'Sign in ... is not available yet' (partly built vs Zoho; recorded, not a bug). |
| W4-21 | PASS | No password/key/token values in /mail/connections; per-connection GET not offered (405). |
| W4-22 | PASS | Agent C: Email Providers page 'You don't have permission'; GET 403; POST smtp 403 (mail:connection:manage). |
| W4-23 | PASS | Screen filters work: department, folder, used-for (Ticket closed = 1), module (Contacts = 0), starred only (1). |
| W4-24 | PASS | Folder + 'QA GL W4 template' (Marketing) created on screen; edit (PUT), star, clone '(copy)' all work. |
| W4-25 | PASS | Composer Insert template on #3280: English template filled (name, ticket 3280, status Open, department Marketing), no {{ }} left; sent 201. Template subject is not applied to a reply (keeps Re:) - check vs Zoho. |
| W4-26 | PASS | Arabic template saved intact (dir=rtl) and sent on #3280 with name and ticket number filled. |
| W4-27 | PASS | Empty name and empty subject: 'This is required.'; unknown placeholder refused ('isn't a field'); <script>, onerror and javascript: links stripped. |
| W4-28 | FAIL | Own Marketing reply-acknowledgement template active (subject "QA GL W4 we got your reply [#…]"), but after your reply on #3280 no acknowledgement mail reached you. The general new-ticket acknowledgement (on) did not arrive for #3278-#3280 either. See D8. |
| W4-29 | PASS | Active template: Delete is disabled with 'Activate another template for this email before deleting this one.' |
| W4-30 | PASS | Folder set to only me: admin B no longer sees the folder or its 2 templates; direct GET 404. (Agent C has no template permission at all.) |
| W4-31 | PASS | Web Forms page: feedback widgets + advanced forms with counter and embed code per form. |
| W4-32 | PASS | Marketing widget created; second for Marketing not offered ('Already has a feedback widget'); API 409 WEB_FORM_DEPARTMENT_TAKEN. |
| W4-33 | PASS | QA form made 5 of 5; 6th refused 409 'You can have 5 advanced web forms'; New button disabled. |
| W4-34 | FAIL | Hosted link (share_url on staging-crm host) still returns nginx 404. Known: NDC-1488. |
| W4-35 | PASS | Iframe address signed out: submitted, thank-you shown; ticket #3198 in Marketing, channel web, existing contact reused. |
| W4-36 | PASS | Empty: 3 'is required' messages; 'abc' email: 'Enter an email address like name@example.com'. Note: 300-char subject accepted and cut to 255 silently. |
| W4-37 | PASS | Script embed on another site works once that site is in the form's allowed sites (#3202). With an empty list the site gets a bare 404 and no form - note. |
| W4-38 | PASS | CAPTCHA on: Cloudflare Turnstile shown; send without it: 'Complete the CAPTCHA before sending.' |
| W4-39 | FAIL | Form disabled from the screen: iframe address shows a blank page (session 404), no 'form not available' message. |
| W4-40 | PASS | Script/onerror text in subject and description stored and shown as text; nothing runs (#3197). |
| W4-41 | FAIL | Form language Arabic: buttons in Arabic but field labels stay English and the page stays left-to-right. Arabic values saved (#3200/#3201). |
| W4-42 | PASS | Portal home loads signed out: name, KB, Community, Submit a ticket, My tickets, Arabic, Sign in. |
| W4-43 | PASS | You signed up (Cloudflare check needs a person); the account then signs in with no CAPTCHA and lands on My tickets. |
| W4-44 | PASS | Portal tickets: #3277 and #3292 (Marketing, channel Web, contact matched). #3292 with details: the description shows in Desk (first conversation entry) and on My tickets. #3277 had no details typed. |
| W4-45 | PASS | Agent reply shows in My tickets, private note does not; customer reply lands in the Desk thread. Note: the sent reply shows on the portal only after a page reload. |
| W4-46 | PASS | Another contact's ticket id in the portal URL: "Page not found". The public-API part was not run from here (needs a person). |
| W4-47 | PASS | Wrong password and unknown email both: 'The email or password is not correct.' (401, same message). |
| W4-48 | PASS | 101 chars: Save disabled; name with a web address: 'Use 1 to 100 characters, and no web address.'; valid rename shown on portal after Publish; set back to 'NDC Staging' and published. |
| W4-49 | PASS | Portal in Arabic: dir=rtl, lang=ar, Arabic menus. |
| W4-50 | PASS | SEO (per page + language, title 60 / description 160), Access settings and User authentication read; SEO title is 'NDC Staging'. Google/Microsoft/SAML sign-in 'Coming soon'. |
| W4-51 | PASS | Unknown portal page: portal 'Page not found' with link home (not nginx). |
| W4-52 | PASS | Help widget 'QA GL W4 widget' (Marketing) created: modules, launcher, preview, snippet + standalone page + CSP lines. Inventory N-16 (listed Missing) is built. |
| W4-53 | PASS | Community category 'QA GL W4 cat' (Marketing) created on screen; shows on portal; disabled -> hidden from portal; enabled again. |
| W4-54 | PASS | Customer topic "QA GL W4 topic" (Question) live at once (no moderation by default); author shown as "GL W4 Customer", kind customer. |
| W4-55 | PASS | Staff topic + reply and the customer topic all show on the portal and in Desk; moderation counters work (see W4-57). |
| W4-56 | PASS | Empty title: 422 'The title is not valid (required)'; signed-out New topic: 'Sign in to start a topic'. |
| W4-57 | PASS | Customer reported the staff reply (reasons Spam/Abuse/Off topic/Personal info/Other): 204; Desk Moderation "Reported spam 1", listed under Replies with reason Spam. |
| W4-58 | FAIL | TAVI: a customer question topic creates no ticket (API ticket: null) and there is no Convert to ticket. Zoho (checked live 13 Nov, test topic then deleted): posting a Question topic creates a linked ticket automatically (#190, Ticket ID shown on the topic, Forum Status on the ticket, Post Reply goes to the forum). See D7. |
| W4-59 | PASS | Arabic topic posted by you: body Arabic, RTL (dir=auto) on the portal. Title came reversed from copying out of the terminal - not a Desk bug. |
| W4-60 | PASS | Category + article with image published; shows in the portal KB. Rechecked at 22:15 Cairo, after the first signed link expired: the image still loads (portal signs a fresh link each time). |
| W4-61 | PASS | Draft not listed, not found by portal search, direct URL 'Page not found'. |
| W4-62 | PASS | Review category with reviewer B: owner cannot publish (403 'Only one of this category's reviewers...'); Save and Submit for review -> B sees Approve and publish / Reject -> published. |
| W4-63 | PASS | Expiry 4 min ahead: status 'expired' after the time; portal 'Page not found'. |
| W4-64 | PASS | No title refused ('Article title is required'). Script/onerror/javascript: kept in stored body but removed when the portal renders it; no dialog fired. |
| W4-65 | PASS | Agents-only article and article in a hidden category: not listed, not found by search, direct URL 'Page not found'. |
| W4-66 | FAIL | KB template works (Start from template fills the body). Gallery stays empty: its list call /files?purpose=kb_article_image returns [] although 3 images were uploaded/inserted. |
| W4-67 | PASS | Arabic article published; portal search finds the Arabic word and the English word. Note: dir=rtl on the paragraph is dropped on the portal. |
| W4-68 | PASS | Visitor 'Yes' counted (likes 1); visitor comment held for review ('will appear once the team has reviewed it'), listed in Desk as pending. |
| W4-69 | FAIL | Arabic translation shown on the Arabic portal and missing translations fall back to the original - but the translation Body editor reverses typed text ('abc def 123' -> '321 fed cba'); pasting works. |
| W4-70 | PASS | 3 versions listed; Restore version 1 brings back the original (becomes newest). Note: every version shows the same time (5:52 PM). |
| W4-71 | PASS | Expiry 0 / 91: 'between 1 and 90 days'; empty question: required; 600 chars: '500 characters or fewer'. |
| W4-72 | INCONCLUSIVE | Happiness was OFF by 23:15 (another session switched it on and off). For W4-73 it was switched on for Marketing only, #3280 reopened and closed, then restored to off (checked). |
| W4-73 | FAIL | #3280 closed (23:16 Cairo) with ratings on for Marketing, trigger on close: you got the closing mail, but it has no rating question or Good/Okay/Bad links. Ratings restored to off (checked). See D8. |
| W4-74 | NOT RUN | Blocked: needs a rating link, and no rating mail is sent (W4-73). |
| W4-75 | NOT RUN | Blocked: needs a rating link, and no rating mail is sent (W4-73). |
| W4-76 | NOT RUN | Blocked: needs a rating link, and no rating mail is sent (W4-73). |
| W4-77 | NOT RUN | Blocked: needs a rating link, and no rating mail is sent (W4-73). |
| W4-78 | NOT RUN | Blocked: no rating can be given (no rating link in the closing mail, W4-73). |
| W4-79 | PASS | Arabic file downloaded, imported back unchanged, saved: downloaded again it is byte-identical. English is the base (download only). Note: no message after import or Save. |
| W4-80 | PASS | Second Help Center refused: 'This organization already has a Help Center'; own domain 'Coming soon' (O-08 stays Partly; recorded, not filed). |
| W4-81 | PASS | Agent C: Help Center, Web Forms, Customer Happiness, Email Templates settings refused with clear messages; Community setup view-only. |
| W4-82 | PASS | Live chat + Social 'In Development'; no Phone / IM / Guided conversations; HC SSO Coming soon (NDC-2760 list holds). ASAP-like Help widgets now exist (W4-52). |
| W4-83 | INCONCLUSIVE | Cleanup done: 13 tickets, 3 topics, 8 KB articles, 3 KB categories, KB template, help widget, 2 web forms, 4 email templates + folder, address and blocked address deleted; 29 Recycle Bin items purged by exact id. Left: reply-ack template (cannot be deleted, D9), community category (no delete in TAVI, disabled), 2 retired junk domains (D1). Diff vs baseline otherwise clean except changes by other sessions (Help Center access mode, their own templates/forms). |
