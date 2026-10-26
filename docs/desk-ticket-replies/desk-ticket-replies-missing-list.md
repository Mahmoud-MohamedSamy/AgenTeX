# Ticket Replies: features Zoho Desk has that Desk is missing

**Plane: NDC-2636** (bug NDC-2644)

Checked 26 Oct 2026 on `https://staging-desk.taviportal.com` (agent `fedelav803` in Customer Support), against the Zoho Desk help and API docs (`reference/zoho-docs-inventory.md`) and our live Zoho Desk org (portal `taviportal`, Reply All composer on ticket #101, opened and closed without saving). PRD: **NDC-1851** "Ticket Replies" (9 sub-items, 3 phases); item "Ticketing Reply" of NDC-1865. Scheduled replies have their own gap item NDC-2177. Staging was redeployed during the run (bundle `index-PA6o3K2s.js` → `index-7qe5X0Gd.js`); every item below was seen on the new build too.

## Already done in Desk
- Reply, Reply All and Forward from the ticket header and from each message's menu; the composer can switch between them.
- From is the department mailbox; To is the contact; Cc and Bcc; subject "Re: …"; the message being answered is quoted.
- Send is disabled while the body is empty; empty bodies, bad addresses, more than 20 recipients and bodies over 65,535 characters are refused with clear messages.
- Script, event handlers and javascript: links are removed from the sent HTML (NDC-2182 fixed).
- Send and Close, Send as private, Schedule, Schedule and close ticket.
- Forward is always private; Reply All after a forward does not leak it (NDC-1838 fixed).
- Templates (with record fields filled), placeholders, rating link, snippets (Mine / Shared, 50-character single-word names, 25,600 characters, placeholders resolved), attachments.
- Comments: private by default, public on request, edit, delete, pin, @mention; everything is logged in the ticket activity feed.
- Send for review, withdraw, approve / reject; pin a reply; show original headers; split works only on incoming messages (same as Zoho).
- Copied addresses (CC) on the ticket; Reply All shows them ("Also copied on this ticket") with "Leave … off this reply"; leaving one off keeps it on the ticket (NDC-1851 item 7).
- Suggested articles panel ("Articles" in the composer, matching the ticket subject) — added in the 26 Oct redeploy.
- An agent outside the ticket's department gets 404 on the ticket, its replies and comments.

## Missing — composer
1. Send and set a status (Zoho: a status drop-down in the Send menu, on by default, e.g. "Waiting for customer"). Desk offers only Send and Close.
2. Ticket number in the email subject (Zoho adds it by default and lets each department hide it). Desk sends "Re: <subject>" only.
3. Editor tools: insert inline image, strikethrough, font family, spell check, attach from cloud (all in Zoho's toolbar). Desk has bold, italic, underline, size, colour, align, lists, link, placeholder.

## Missing — drafts
4. Auto-save of drafts every 2 minutes and an "Edit Draft" menu (Send / Edit / Discard) on the ticket. Desk saves nothing until "Save draft" is pressed, and see the bug note below.

## Missing — tracking (NDC-1851 Phase 3)
5. Read receipts and per-recipient delivery status (NDC-1851 item 6). Desk shows only "Sent"; the mail platform page reports 40 sent and 0 delivered in 7 days, so delivery events are not coming back.

## Could not be checked
- Mass reply, mass comment and Send as email (NDC-1851 items 2, 3, 8): the department switches `mass_comments_enabled` and `send_as_email_enabled` are off on all 5 departments. Please switch them on for Customer Support (or a QA department) so we can test them.
- Delivery of our replies, the rating link and the placeholders in the real email: please check the mmohamed@anyware.software inbox for "QA RPL" emails of 26 Oct 2026.
- Customer reply reopening a closed ticket and the "Customer Responded" flag: please send one email reply to a "QA RPL" email so we can test it.
- Collision ("another agent is replying"): needs a second agent in Customer Support. Please give one so we can test it.

## Additional notes
- Not gaps: AI reply drafting and multi-channel composing are NDC-1851 non-goals.
- Possible bug to check separately: the Suggested articles panel says "The suggestions could not be loaded." (new build, ticket subject "QA RPL EV cc and draft").
- Fixed during the run: before the 26 Oct redeploy Reply All did not show the ticket's copied addresses although they were copied into the email; the new build shows them.
- Possible bug to check separately: "Save draft" keeps the draft only in this browser (localStorage); nothing reaches the server (`drafts/mine` is 404), so the draft is lost on another device and invisible to other agents (R-B2 = NDC-2644).
- Possible bug to check separately: the author of a reply sent for review can approve it themselves (R-B3).
- Possible bug to check separately: two identical reply requests at the same moment send two emails (no duplicate protection) (R-B4).
- Possible bug to check separately: an agent's address is accepted as Cc since the redeploy, although it was refused earlier the same day and NDC-1851 item 7 excludes agent addresses (R-B5).
- Small UX note: "Send as private" and "Make private" are offered on replies to the customer and are always refused ("The customer is a recipient, so this reply cannot be sent as private.").
- Test spec: docs/desk-ticket-replies/spec-desk-ticket-replies.md in the QA repository; automation feature `deskticketreplies`.
- Tenant changes: QA tickets "QA RPL …" were created and replies were sent only to mmohamed@anyware.software (CC / BCC / forward to @example.com addresses and once to mahmoud.mmohamedsamy@gmail.com). QA snippets were deleted. The QA tickets could not be deleted with the agent account (403).

## Environment
staging-desk.taviportal.com, Edge, 26 October 2026, Desk Agent account.
