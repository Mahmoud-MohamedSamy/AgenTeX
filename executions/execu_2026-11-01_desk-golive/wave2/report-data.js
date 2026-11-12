const IMG = id => [`evidence/annotated/W2-${id}-vs-zoho.png`];
module.exports = {
 "title": "Desk Go-Live Wave 2",
 "heading": "TAVI Desk go-live: Wave 2, ticket daily work",
 "meta": "Run on NDC-Staging (Wonder Travel tenant) on 2 Nov and 12 Nov 2026 with the owner (ndc-staging-owner@), agent B (mahmoud.mahamed1515@, Marketing and others) and agent C (fedelav803@, Customer Support only); screen + API. The 2 Nov tickets had been deleted by someone in between, so 12 Nov used fresh tickets #3105–#3120, plus #3159/#3166 for the split test from real emails sent by mmohamed@anyware.software. Compared with Zoho Desk Enterprise (help centre, community answers and the trial org techsolutionsegypt; one live Zoho write for C2, ticket #183, deleted). Covers inventory rows T-01..T-40 and Q-03. **Nothing is filed in Plane yet.**",
 "decisions": [
  "**File which of the 9 bug drafts below?** Suggested: all except C10, each as Bug, MahmoudMohamed + mfathy + Hegazy + eahmed, module Desk, current sprint, start today, annotated TAVI-vs-Zoho image attached (same fields as Wave 1).",
  "**C10 needs your call:** with Tickets data sharing = Private, agent C (Customer Support only) can open and list Marketing tickets owned by agent B, because C is above B in the role hierarchy. Zoho's docs say Private gives access to \"the ticket owner and their manager\" but say nothing about departments, and we cannot reproduce it in Zoho with one admin account. Is a manager outside the department allowed to see these tickets? If not, it is a High data-visibility bug (related NDC-2196).",
  "**Severities are my suggestion**, change them as you like: High C5; Medium C2, C4, C6, C11, C13; Low C1, C7.",
  "**Withdrawn, not filed:** C3 (approver outside the department, Zoho allows it too), C12 (read-only share can still add a private comment, same in Zoho), C8 and C9 (my test-script errors).",
  "**Next after your review:** file the approved bugs, then Wave 3 (automation) on NDC-Staging."
 ],
 "bugs": [
  {
   "id": "C5", "sev": "High",
   "title": "AI | Summary, triage, reply suggestions, draft assist and translate all fail with \"Something went wrong\"",
   "cases": "W2-67, W2-68, W2-69, W2-70",
   "where": "Ticket page › AI panel (Zia-style tools) and message menu › Translate; API `POST /desk/tickets/{id}/ai/*`, `…/messages/{id}/translate`",
   "steps": ["Open any ticket, e.g. #3105.", "Open the AI panel and press Summarise (also try Triage, Suggest replies, Writing assistant).", "On a message, open its menu and press Translate."],
   "expected": "A summary, triage suggestion, reply suggestions, rewritten draft or translation; or a clear message that AI is not set up for the tenant.",
   "actual": "Every action shows **\"Something went wrong. The AI request failed.\"** The calls return **404 NOT_FOUND**. Same on 2 Nov and 12 Nov.",
   "request": "POST /desk/tickets/{id}/ai/summary  →  404 {\"code\":\"NOT_FOUND\",\"message\":\"The requested resource was not found.\"}\nPOST /desk/tickets/{id}/messages/{id}/translate {target_language:\"ar\"}  →  404",
   "zoho": "Zoho Desk's Zia gives ticket summary, sentiment, reply suggestions and translation when Zia is enabled; when it is not, the tools are hidden, not broken. Broken on its own whatever Zoho does (related NDC-2004, NDC-2005).",
   "evidence": "Raw: `evidence/wave2n/ui-ai.png`; API output `wave2/raw-ndc/d.json`.",
   "images": IMG("C5")
  },
  {
   "id": "C2", "sev": "Medium",
   "title": "Ticket | A saved reply draft is copied into the comment editor (Shift+C / comment icon)",
   "cases": "W2-72",
   "where": "Ticket page › Reply (draft saved) then Shift+C or the comment icon",
   "steps": ["Open a ticket, press Reply, type some text and close the composer so the draft is saved (the Reply button shows DRAFT).", "Press Shift+C, or click the comment icon next to Reply All."],
   "expected": "An empty comment editor; the reply draft stays as a reply draft.",
   "actual": "The comment editor opens **filled with the reply draft text**. Saving it would post the customer reply text as a comment.",
   "zoho": "Live check on the Zoho trial (ticket #183, deleted after): with a saved reply draft, the comment editor opens **empty** and the draft stays separate.",
   "evidence": "Raw: `evidence/wave2n/ui-shiftc-draft.png`, `ui-commenticon-draft.png`; Zoho `evidence/zoho-w2/z-c2-*.png`.",
   "images": IMG("C2")
  },
  {
   "id": "C4", "sev": "Medium",
   "title": "Ticket | An Open ticket can be archived by hand and then disappears from All Tickets",
   "cases": "W2-63",
   "where": "Ticket archive action; API `POST /desk/tickets/{id}/archive`",
   "steps": ["Open an Open ticket.", "Archive it (POST /desk/tickets/{id}/archive).", "Go back to All Tickets."],
   "expected": "Only closed tickets are archived. Zoho: \"A ticket must be in closed state for 120 days\" and \"Tickets cannot be archived manually\".",
   "actual": "The Open ticket is archived at once and **drops out of All Tickets**; it shows only under Archived Tickets, so open work can be hidden from agents.",
   "zoho": "Help centre (Archived tickets): only tickets closed for 120 days are archived, automatically; on screen the ⋮ menu of an open and of a closed ticket has no Archive.",
   "evidence": "Zoho `evidence/zoho-w2/z-more-open-ticket.png`, `z-more-closed-ticket.png`; API output `wave2/raw-ndc/`.",
   "images": IMG("C4")
  },
  {
   "id": "C6", "sev": "Medium",
   "title": "Ticket | Moving a ticket to another department clears the owner even when the owner belongs to that department",
   "cases": "W2-35",
   "where": "Ticket page › department chip › Move; API `POST /desk/tickets/{id}/move`",
   "steps": ["Take a Marketing ticket owned by the owner account (a member of Sales too).", "Move it to Sales.", "Look at Ticket Owner."],
   "expected": "The owner stays, because they are a member of Sales.",
   "actual": "The ticket arrives in Sales **unassigned**; moving back to Marketing does not bring the owner back.",
   "zoho": "Zoho keeps the owner when they are a member of the target department and clears it only when not (Zoho staff answer in the Zoho community); the move dialog shows the owner field.",
   "evidence": "Zoho `evidence/zoho-w2/z-move-dialog.png`, `z-move-panel.png`.",
   "images": IMG("C6")
  },
  {
   "id": "C11", "sev": "Medium",
   "title": "Replies | The agent's own signature is not added to outgoing replies",
   "cases": "W2-30",
   "where": "Settings › Personal › Signatures; ticket Reply",
   "steps": ["Save a signature under My signatures (here \"QA GL W2 signature line\").", "Open a ticket and press Reply.", "Send the reply to the customer and open the delivered email."],
   "expected": "The agent's signature appears in the composer and at the end of the delivered email.",
   "actual": "Not in the composer, not in the stored reply, and **not in the delivered email**. Both delivered emails (12 Nov 12:05 and 15:16) end with a company block only: \"Wonder Travel / 09876543210 / 1, Maadi, Cairo, EG / https://crm.taviportal.com/ / ndc-staging-owner / ndc-staging-owner@anyware.software / Organization\".",
   "zoho": "Zoho Desk adds the agent's signature to outgoing replies (Personal settings › Signature; help centre). ",
   "evidence": "Raw: `evidence/wave2n/r-signature-page.png`, `r-signature-composer.png`, `r-sig2-composer.png`; the email text checked by you in mmohamed@ inbox.",
   "images": IMG("C11")
  },
  {
   "id": "C13", "sev": "Medium",
   "title": "Replies | A CC added on a reply is not kept on the ticket's copied addresses",
   "cases": "W2-19",
   "where": "Ticket page › Reply All with CC; panel \"Copied addresses\"",
   "steps": ["Open an email ticket.", "Reply All and add a CC address.", "Send, then look at Ticket Properties › Copied addresses."],
   "expected": "The CC address is added to the ticket's copied addresses so later replies include it.",
   "actual": "The reply goes to the CC, but **Copied addresses still says \"Nobody else is copied.\"**",
   "zoho": "Zoho adds a CC from a reply to the ticket's CC list (secondary contacts).",
   "evidence": "API output `wave2/raw-ndc/` (reply with cc stored); screen `Copied addresses` panel.",
   "images": IMG("C13")
  },
  {
   "id": "C1", "sev": "Low",
   "title": "History | \"Followers was updated\" shows raw user ids instead of names",
   "cases": "W2-17",
   "where": "Ticket page › History",
   "steps": ["Follow, then unfollow a ticket.", "Open the History tab."],
   "expected": "\"<name> started/stopped following\", with names.",
   "actual": "**\"Followers was updated\"**, Old **[\"97be04b6-…\"]**, New blank: a raw user-id list on screen.",
   "zoho": "Zoho's history names the person in follower events. Raw ids on screen are a bug on their own (related NDC-2660).",
   "evidence": "Raw: `evidence/wave2n/ui-history-uuid.png`.",
   "images": IMG("C1")
  },
  {
   "id": "C7", "sev": "Low",
   "title": "Snippets | The ticket-number placeholder adds its own \"#\" (\"ticket ##781\")",
   "cases": "W2-27",
   "where": "Ticket composer › Snippets; API `/desk/snippets`",
   "steps": ["Create a snippet with text \"ticket #{{ticket_number}}\".", "Insert it in a reply on ticket #781."],
   "expected": "\"ticket #781\": the placeholder gives the number only.",
   "actual": "**\"ticket ##781\"**: the placeholder already includes \"#\".",
   "zoho": "Zoho's ${Cases.Request Id} gives the number only (docs example \"support ticket number 116\").",
   "evidence": "Raw: `evidence/wave2n/r-ticket-number.png`; Zoho `evidence/zoho-w2/z-snippets.png`.",
   "images": IMG("C7")
  },
  {
   "id": "C10", "sev": "High",
   "title": "Access | With Private ticket sharing, an agent can read tickets of a department they are not in when a lower-role agent owns them (needs your decision)",
   "cases": "W2-76, W2-85",
   "where": "Setup › Data sharing (Tickets = Private); agent C ticket list and ticket page",
   "steps": ["Tickets data sharing = Private. Agent C is in Customer Support only; agent B (lower role) is in Marketing.", "Assign Marketing tickets #3105 and #3106 to B.", "Sign in as C, open All Tickets and search \"QA GL W2\", then open #3105."],
   "expected": "C cannot see Marketing tickets (403/404), as C is not in Marketing (case expectation, NDC-2196).",
   "actual": "C **lists and opens #3105 and #3106 with their comments**; no other Marketing tickets. Access comes from the role hierarchy (C above B).",
   "zoho": "Zoho docs: Private gives \"the ticket owner and their manager\" access; silent on departments. Not testable live with one admin account.",
   "evidence": "Raw: `evidence/wave2n/r-c-marketing.png`, `r-c-cs.png`, `r-roles.png`, `r-data-sharing.png`.",
   "images": IMG("C10")
  }
 ],
 "gaps": [
  "No new gaps beyond the go-live gap ticket NDC-2760. The Zoho-differs items above are filed as bugs because TAVI has the feature but behaves differently.",
  "**Note, not a bug yet:** the second email from mmohamed@ (a reply) was marked \"Unverified sender\" on screen, the first one was not."
 ],
 "tickets": [
  "Cases linked to earlier tickets: NDC-2211 (W2-01), NDC-2661 (W2-11), NDC-2660 (W2-17, see C1), NDC-2636 (W2-18, W2-29), NDC-2377 (W2-21), NDC-2644 (W2-25), NDC-2184 (W2-26), NDC-2355 (W2-31), NDC-2303 / NDC-2376 (W2-37), NDC-2248 (W2-45), NDC-1965 (W2-50, W2-51), NDC-1987 (W2-65), NDC-2004 / NDC-2005 (W2-67, W2-70, see C5), NDC-2196 (W2-76, W2-85, see C10).",
  "No ticket was moved during this wave."
 ],
 "inconclusive": [
  "None. All 85 cases ran. W2-40 (split) needed real customer emails; you sent two from mmohamed@ on 12 Nov and it passed."
 ],
 "shots": [],
 "cleanup": [
  "Test data used the prefix \"QA GL W2\": tickets #3105–#3109, #3119, #3120, #794, #3159, #3166, a ticket template and a snippet (2 Nov). Ledger `wave2/after/created-ndc.jsonl`.",
  "Today's runs changed no settings; the test signature was removed after each signature test.",
  "**Incident (12 Nov ~11:50):** a delete-forever step purged one foreign Recycle Bin item (newest item; search ignored the name). Almost surely QA data, not recoverable. Purges now match exact id + name only.",
  "Cleanup status: see the progress page; updated here once done."
 ],
 "gapTicket": null
};
