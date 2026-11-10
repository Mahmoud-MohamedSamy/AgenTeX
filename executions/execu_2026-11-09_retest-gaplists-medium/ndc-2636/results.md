# NDC-2636 Ticket Replies: recheck 9 Nov 2026

Tenant NDC-Staging, account mahmoud.mahamed1515 (Desk Administrator). Result: 1 built, 1 partly built, 3 still missing. Related bug NDC-2644 (draft kept only in the browser) is Done; NDC-2177 (scheduled replies) is Done.

| # | Item | Verdict | TAVI now (9 Nov 2026) | Evidence |
|---|---|---|---|---|
| 1 | Send and set a status | Still missing | The Send menu still has only "Send and Close"; the app texts have no other send option. | ev-01 |
| 2 | Ticket number in the email subject | Still missing | The composer subject is "Re: QA RT 2636 replies check" for ticket #2217, and there is no setting for a ticket number in the subject. | ev-01 |
| 3 | Editor tools | Still missing | Toolbar: bold, italic, underline, size, colour, align, lists, link, placeholder, clear format. No inline image, strikethrough, font family, spell check or cloud attach. New: Suggest replies and Writing assistant. | ev-01 |
| 4 | Draft auto-save and draft actions | Built | Typing saves the draft on the server within seconds (PUT /desk/tickets/{id}/drafts/mine; GET returns it). After a reload, Reply All shows a DRAFT badge, the text comes back, and "Discard draft" removes it. NDC-2644 is Done. | raw/tavi-send-menu.png |
| 5 | Read receipts and per-recipient delivery | Partly built | Failed or bounced replies are now marked "Not delivered: reason", and a notification rule "An email to the customer is not delivered" exists. There is still no delivered or read status per recipient. Not seen on a real reply (see notes). | ev-02 |

## Notes
- Checked on NDC-Staging as mahmoud.mahamed1515 (Desk Administrator), with a throwaway ticket #2217 "QA RT 2636 replies check" (HR). The ticket and its draft were deleted and purged from the Recycle Bin; nothing was sent.
- The composer refused qa.rt2636@example.com as "not a valid email address", and the HR department has no email channel, so no real reply was sent for item 5.
