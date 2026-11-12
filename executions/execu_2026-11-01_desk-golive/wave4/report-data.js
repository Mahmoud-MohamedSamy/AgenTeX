module.exports = {
 "title": "Desk Go-Live Wave 4",
 "heading": "TAVI Desk go-live: Wave 4, channels and self service",
 "meta": "Run on NDC-Staging (Wonder Travel tenant) on 12 Nov 2026 with the owner (ndc-staging-owner@), admin B (mahmoud.mahamed1515@) and agent C (fedelav803@) for permission checks, plus a Help Center customer account (mmohamed@anyware.software) you signed up. Real emails and the CAPTCHA steps were done by you. Department Marketing; prefix `QA GL W4`. Compared with Zoho Desk Enterprise (trial org techsolutionsegypt: read only, plus one approved write on 13 Nov for D7, deleted and purged; and Zoho help pages). Covers inventory rows N-01..N-10, O-08 and T-37, plus the Group Z checks N-11..N-17. **Nothing is filed in Plane yet.**",
 "decisions": [
  "**Filed 13 Nov 00:11 (your approval: all nine):** NDC-3000 (D8), NDC-3001 (D5), NDC-3002 (D1), NDC-3003 (D9), NDC-3004 (D3), NDC-3005 (D4), NDC-3006 (D6), NDC-3007 (D7), NDC-3008 (D2). State Bug, module Desk, Sprint 15, MahmoudMohamed + mfathy + eahmed + Hegazy; one annotated image each.",
  "**D8 is the most important one:** customers get no acknowledgement for a new ticket or a reply, and the closing email has no rating link even with ratings on. Normal agent replies are delivered, so outgoing mail itself works.",
  "**Left in the tenant (cannot be removed):** template `QA GL W4 reply ack` (D9), community category `QA GL W4 cat` (TAVI has no delete; it is disabled and hidden), retired domains `http:%2f%2fx.com` and `exa mple.com` (D1). Your Help Center account mmohamed@ was kept.",
  "**Not ours:** the Help Center access mode was changed from open to sign in to submit by another session on the owner account (21:33 from a browser, then 23:40 and 23:44 from a script, Cairo time). Customer Happiness was switched on and off by another session too. I left both as they are now.",
  "**C10 (Wave 2) Zoho check:** still parked until after Wave 3, as you asked."
 ],
 "bugs": [
  {"id":"D8","sev":"High","title":"Automatic customer emails: no acknowledgements, and the closing email has no rating link","cases":"W4-09, W4-28, W4-73","where":"Setup › Channels › Email › Replies (acknowledgement on); Setup › Email Templates (reply acknowledgement); Setup › Customer Happiness (send on close)",
   "steps":["Make sure the acknowledgement is on (Email › Replies) and a reply-acknowledgement template is active for the department.","From a customer mailbox, email the support address to open a new ticket, then reply to the agent's answer.","Turn ratings on for the department with Send on close, and close the ticket."],
   "expected":"The customer gets \"Your ticket has been delivered…\" for the new ticket, the reply acknowledgement after their reply, and a closing email that carries the rating question with Good / Okay / Bad links (TAVI's own setup text says the Ticket Closed email carries the rating link when ratings are sent on close).",
   "actual":"For tickets #3278, #3279, #3280 and the reply on #3280, **no acknowledgement email arrived**. Closing #3280 twice (23:11 and 23:16 Cairo) with ratings on for Marketing sent the closing email **without any rating question or link**. Agent replies on the same tickets were delivered.",
   "request":"Closing email received (both closes):\n  Your ticket #3280 \"QA GL W4 mail to new address\" has been closed. If you need anything else, just reply to this email.\n  Wonder Travel · 09876543210 · 1, Maadi, Cairo, EG · https://crm.taviportal.com/\nSettings at the time: acknowledgement_enabled=true; happiness is_enabled=true, trigger=on_close, department scope = Marketing",
   "zoho":"Zoho Desk has notification rules for acknowledging a new ticket and a new reply (Zoho help: Notifications). Not checked live in Zoho (it would need test data in the Zoho account, which is read only). This is TAVI failing its own feature, so no Zoho comparison is needed to call it a bug.",
   "evidence":"Closing email text (evidence/raw/w4/W4-73-closing-mail.txt), close dialog below. Small extra: the footer link points to the live site crm.taviportal.com from staging.",
   "images":["evidence/raw/w4/W4-73-close-dialog.png"]},
  {"id":"D5","sev":"High","title":"KB translation editor reverses typed text","cases":"W4-69","where":"Knowledge Base › article › Translations tab › Body",
   "steps":["Open a published article and go to the Translations tab.","Pick a language (French or Arabic) and click into Body.","Type \"abc def 123\"."],
   "expected":"The text appears as typed.","actual":"Every key lands at the start of the box, so the text is saved as **\"321 fed cba\"** (Arabic too). Pasting works. A translation cannot be typed by hand.",
   "zoho":"Not checked live in Zoho (it would need test data in the Zoho account, which is read only). This is TAVI failing its own feature, so no Zoho comparison is needed to call it a bug.","evidence":"Screenshot of the Body box with reversed text.","images":["evidence/raw/w4/W4-69-typing.png"]},
  {"id":"D1","sev":"Medium","title":"Email domains: bad values are saved, others get \"try again\" instead of a validation message","cases":"W4-08","where":"Setup › Channels › Email › Your domains › Add domain",
   "steps":["Add domain \"http://x.com\".","Add domain \"exa mple.com\" (with a space).","Add domain \"abc\", then add a domain that is already in the list.","Remove one of the bad domains."],
   "expected":"Invalid values are refused with a clear message; a duplicate says it already exists; Remove removes it.",
   "actual":"\"http://x.com\" is saved as **http:%2f%2fx.com** and \"exa mple.com\" is saved, both waiting for DNS proof. \"abc\" and the duplicate get **503 \"our side, please try again\"**. Remove only marks the domain retired, so the junk stays listed.",
   "zoho":"Not checked live in Zoho (it would need test data in the Zoho account, which is read only). This is TAVI failing its own feature, so no Zoho comparison is needed to call it a bug.","evidence":"Domains page during the run.","images":["evidence/raw/w4/W4-08-domains-saved.png"]},
  {"id":"D9","sev":"Medium","title":"A department reply-acknowledgement template cannot be switched off or deleted","cases":"W4-28 (cleanup)","where":"Setup › Email Templates",
   "steps":["Create a reply-acknowledgement template for one department (Marketing) and Activate it.","Open its Actions menu, then the built-in Reply acknowledgement's Actions menu.","Try to Delete your template."],
   "expected":"A way to go back to the built-in template for that department (Deactivate, or Activate on the built-in), then Delete works.",
   "actual":"Your template's menu shows **Activate** (as if not active). The built-in's Activate is greyed out: **\"This template is already the one being sent.\"** There is no Deactivate. Delete is refused: **\"This template is the one being sent. Activate another template, or the built-in one, before…\"**. The template is stuck.",
   "zoho":"Not checked live in Zoho (it would need test data in the Zoho account, which is read only). This is TAVI failing its own feature, so no Zoho comparison is needed to call it a bug.","evidence":"API: DELETE /desk/email-templates/{id} → 422 UNPROCESSABLE (above); POST …/system.ticket.reply_acknowledgement/activate {department_id} → 200 but nothing changes.","images":[]},
  {"id":"D3","sev":"Medium","title":"A disabled web form shows a blank page","cases":"W4-39","where":"Web form hosted/iframe page after Disable on Setup › Web Forms",
   "steps":["Disable a web form on the Web Forms screen.","Open its embed (iframe) address."],
   "expected":"A short message such as \"This form is not available\".","actual":"The page is **completely blank**; its session call returns 404.",
   "zoho":"Not checked live: the Zoho test account has no web forms. A blank page with no message is a defect on its own.","evidence":"Blank page screenshot.","images":["evidence/raw/w4/W4-39-disabled.png"]},
  {"id":"D4","sev":"Medium","title":"Arabic web form keeps English labels and left-to-right layout","cases":"W4-41","where":"Setup › Web Forms › form language Arabic",
   "steps":["Set a web form's language to Arabic.","Open the form."],
   "expected":"Arabic field labels and right-to-left layout.","actual":"Only the buttons change (إرسال, إعادة تعيين). **Field labels stay English** (Last Name, Email, Subject, Description) and the page direction stays left-to-right.",
   "zoho":"Zoho Desk supports field translations for 20 languages (help page: Adding field translations).","evidence":"Form screenshot.","images":["evidence/raw/w4/W4-41-arabic.png"]},
  {"id":"D6","sev":"Medium","title":"KB Gallery is always empty","cases":"W4-66","where":"Knowledge Base › Gallery",
   "steps":["Upload an image in Gallery, and insert images into an article.","Open Gallery again."],
   "expected":"The uploaded and inserted images are listed for reuse (the page says images inserted into articles land there too).",
   "actual":"Gallery never lists anything: its list call **/files?purpose=kb_article_image returns []** although 3 images were uploaded or inserted.",
   "zoho":"Not checked live in Zoho (it would need test data in the Zoho account, which is read only). This is TAVI failing its own feature, so no Zoho comparison is needed to call it a bug.","evidence":"Gallery screenshot during the run.","images":["evidence/raw/w4/W4-66-gallery-upload.png"]},
  {"id":"D7","sev":"Medium","title":"Community question topics do not become tickets (Zoho creates a linked ticket)","cases":"W4-58","where":"Help Center › Community › customer posts a Question; Desk › Community topic","steps":["Signed in on the Help Center, post a topic of type Question in a category.","In Desk, open the topic (Community) and look for its ticket, or a Convert to ticket action."],"expected":"Like Zoho: a ticket is created and linked to the question (Ticket ID on the topic; on the ticket a Forum Status field and Post Reply back to the forum).","actual":"No ticket is created (topic API returns **ticket: null**) and the topic Tools menu has no Convert to ticket (sticky, lock, move, moderate, open in Help Center, delete; API can.convert = false).","zoho":"**Checked live on 13 Nov** (test topic created with your OK, then deleted and purged): posting \"QA GL W4 zoho topic\" as a Question created ticket **#190** at once. The topic shows \"Ticket ID: #190\"; the ticket shows the topic text, a Forum Status field and Post Reply to the forum; after the topic was deleted the ticket said \"Forum topic has been deleted\".","evidence":"Zoho topic with Ticket ID, and the linked Zoho ticket.","images":["evidence/raw/w4/zoho-D7-published.png","evidence/raw/w4/zoho-D7-ticket190-linked.png"]},
 {"id":"D2","sev":"Low","title":"Blocked addresses accept a wildcard (*@example.com)","cases":"W4-13","where":"Setup › Channels › Email › Blocked addresses",
   "steps":["Block \"*@example.com\"."],
   "expected":"Either refused (the page says \"Desk blocks one address at a time, not a whole domain\") or a real domain block.",
   "actual":"**\"*@example.com\" is accepted** and listed as blocked, with no hint of what it does.",
   "zoho":"Zoho Desk's Allowlist and Blocklist blocks **emails and domains** (\"tickets from blocked emails and domains will be restricted and marked as spam\"). So domain blocking is expected; TAVI should support it properly or refuse the wildcard.",
   "evidence":"TAVI list and Zoho Allowlist and Blocklist page.","images":["evidence/raw/w4/W4-13-wildcard-blocked.png","evidence/raw/w4/zoho-D2-blocklist.png"]}
 ],
 "gaps": [
   "Community categories cannot be deleted in TAVI (only Edit, Lock, Disable).",
  "Notes, not bugs: a 300-character subject is cut to 255 silently; the Overview tab's address count was out of date; Arabic dir is dropped on the KB portal paragraph; every KB version shows the same time; a reply sent from the portal shows only after reload; the email template subject is not applied to a reply (keeps Re:); no message after a translation import or Save on Customer Happiness.",
  "**Built since the inventory:** Help widgets (N-16 was listed Missing). The web form script embed works when the site is in allowed origins, so NDC-2751 may be fixed."
 ],
 "tickets": [
  "Known and still open: NDC-1488 (web form hosted link nginx 404, W4-34). NDC-2751 (script embed) looks fixed (W4-35). O-08: a second Help Center is refused and own domain is Coming soon (NDC-2760 list holds)."
 ],
 "inconclusive": [
  "W4-12: the live part of blocking needs a mailbox that never wrote to support (both test mailboxes have open tickets from other tests). Add/remove block works.",
  "W4-19: SMTP skipped by you at Gate 1.",
  "W4-72: Customer Happiness setup was changed by another session during the run; ratings were tested by switching it on for Marketing for a few minutes and back.",
  "W4-74..W4-78: blocked by D8 (no rating link to click).",
  "W4-46: the portal URL part passed; the public-API part (calling another customer's ticket with the customer's sign-in) was not run from here."
 ],
 "shots": [],
 "cleanup": [
  "Deleted on 12 Nov ~23:55 Cairo: 13 tickets (#3196–#3203, #3277–#3280, #3292), 3 topics, 8 KB articles, 3 KB categories, KB template, help widget, 2 web forms, 4 email templates and the folder, receiving address qa-gl-w4@, blocked address; 29 Recycle Bin items purged, each matched by exact id.",
  "Customer Happiness was switched on for Marketing twice for under 2 minutes and restored to off both times (checked). The Help Center name was set back to NDC Staging and published.",
  "Left: reply-ack template (D9), community category (disabled), 2 retired domains (D1). Baseline diff otherwise clean apart from other sessions' changes."
 ],
 "gapTicket": null
};
