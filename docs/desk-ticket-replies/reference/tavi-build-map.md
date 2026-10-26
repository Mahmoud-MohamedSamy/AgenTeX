# TAVI Desk — Ticket replies: build map (26 Oct 2026)

Host `https://staging-desk.taviportal.com` (tenant NDC-Staging). Sources: bundle `index-PA6o3K2s.js` (512 chunks, incl. `register-mocks-BZQqLNWp.js` route table, `useReplyComposerModel-DBbSBmiv.js`, `ConversationTab-D7Pg4LC2.js`, `ThreadRow-BnyAmIa3.js`, `TicketBulkDialogs-Clco4PVa.js`, `ScheduledRepliesPage-CJklRdY3.js`), live API (GET only) and the UI, as the agent `fedelav803` (Desk Agent, Customer Support) and the admin `mahmoud.mmohamedsamy` (HR / Marketing / Sales). Nothing was saved or sent.

## Screens
| Where | What is there |
|---|---|
| Ticket header | **Pick up**, **Reply All** split button (menu: Reply All · Reply · Forward), **Comment (Shift + C)**, ⋮ More ticket actions (Move · Merge · Apply Macro · Mark as Unread · Mark as Spam · Archive · Clone · Print · Copy link), Start timer, Close ticket |
| Conversation tab | count in the tab ("2 CONVERSATION"), **Filter the conversation**, per entry ⋮ (Reply All · Reply · Forward · Comment · Pin · Make private · Show Original) |
| Reply composer | From picker (department mailbox, e.g. `Customer Support <customer-support@help-staging.anyware.software>`), **Save draft**, "Change how you reply" (Reply All / Reply / Forward), Recipients chips (remove ×), **Bcc**, **Cc** (+ Remove Cc), Subject (`Re: …`), toolbar (Bold · Italic · Underline · Text size Small/Normal/Large/Huge · colour · align L/C/R · bullet · numbered · link · Insert placeholder · Rating link · Clear formatting), quoted previous message ("On {date}, {name} <{email}> wrote:"), **Insert template**, **Snippets** (All / Mine / Shared / New snippet), **Save as snippet**, **Attach**, **Send for review**, **Send**, **More send options** (disabled while the body is empty), Cancel |
| Comment composer | toolbar, Snippets, Save as snippet, Attach, **Comment Private** + **Comment visibility** (private / public), Cancel |
| Ticket side panel | Copied addresses (CC on the ticket, "Add an email address" + Add), Ticket Owner, Status, Due Date, Response Due Date, Tags, SLA |
| `/scheduled-replies` | Scheduled Replies list (covered by NDC-2177 / NDC-2178) |

## API (`/api/v1`, `Authorization: Bearer`, `x-app-key: desk`)
| Method | Path | Notes |
|---|---|---|
| GET / POST | `/desk/tickets/{id}/replies` | list (direction, mode, is_public, from_address, to, cc, bcc, subject, body_html, body_text, quoted_body_html, status, sent_at, bounced_at, attempts, dkim_aligned …) / send |
| GET | `/desk/tickets/{id}/replies/{replyId}` · `/headers` | one reply · original headers ("Show Original") |
| POST | `/desk/tickets/{id}/replies/{replyId}/retry` · `/split` | resend a failed reply · split into a new ticket |
| PUT / DELETE | `/desk/tickets/{id}/replies/{replyId}/pin` | pin / unpin |
| GET / POST / PUT / DELETE | `/desk/tickets/{id}/comments[/{commentId}]` | comments (is_public, parent_comment_id, can_edit, can_delete) |
| PUT / DELETE | `/desk/tickets/{id}/comments/{commentId}/pin` | |
| GET | `/desk/tickets/{id}/drafts` | all drafts on the ticket |
| PUT / DELETE | `/desk/tickets/{id}/drafts/mine` | save / discard my draft (one per agent) |
| POST | `/desk/tickets/{id}/drafts/mine/submit-review` · `withdraw-review` | send for review |
| POST | `/desk/tickets/{id}/drafts/{draftId}/approve` · `reject` | reviewer |
| GET / POST | `/desk/tickets/{id}/cc` | ticket CC list |
| GET | `/desk/tickets/{id}/sender` | From options |
| GET / POST | `/desk/tickets/{id}/email-templates` · `/{tid}/render` | templates with placeholders |
| GET / POST | `/desk/snippets` · `/desk/tickets/{id}/snippets/resolve` | snippets: placeholders customer_name, ticket_number, ticket_subject, agent_name, department_name; max 200 per agent, 5,000 per tenant, 25,600 chars |
| GET / POST | `/desk/tickets/{id}/scheduled-replies` · `/desk/scheduled-replies` | scheduled replies |
| POST | `/desk/tickets/send-as-email` · GET `/desk/tickets/send-as-email/departments` | outbound new ticket (department switch `send_as_email_enabled`, all off) |
| POST | `/desk/tickets/mass` | bulk actions incl. reply / comment (department switch `mass_comments_enabled`, all off) |
| GET | `/desk/tickets/{id}` | `counts {replies, comments, attachments, time_entries}` — no activity count |
| GET / PUT | `/desk/tickets/{id}/viewers/me` · POST `/viewers/heartbeat` | who is viewing (collision) |
| GET | `/desk/tickets/{id}/history` · `/activity` | ticket history feed |
| GET | `/desk/channels/addresses` · `/from-addresses` · `/settings` · `/sending-overview` · `/suppressions` | mailboxes: Customer Support and Tech have hosted addresses `*@help-staging.anyware.software`; HR / Marketing / Sales have none; `quote_position: above`; acknowledgement off |
| GET | `/mail/signatures/me` | agent signatures (empty for the agent) |
| GET | `/mail/platform/status` | SendGrid sending ok; last 7 days sent 40, **delivered 0** (delivery events not tracked or not received) |

Department switches (GET `/desk/departments`): `cc_enabled` true · `auto_private_non_contacts` false · `send_as_email_enabled` false · `mass_comments_enabled` false · `scheduled_replies_enabled` true · `scheduled_reply_cancel_on_customer_reply` / `_on_close` true — same on all 5 departments.

Probed and absent (404): `/desk/reply-settings`, `/desk/tickets/reply-settings`, `/desk/email/settings`, `/desk/signatures`, `/desk/settings/replies`.

## Data on the tenant
- Agent `fedelav803` sees 6 email tickets (#289–#300, Customer Support). The admin `mahmoud.mmohamedsamy` sees 0 tickets (none in HR / Marketing / Sales).
- Owner `ndc-staging-owner` is in all 5 departments but is shared with teammates.

## Earlier tickets on this area (do not re-file)
NDC-1838 Reply All after Forward leaks the forward · NDC-1842 one suppressed Cc stops the reply · NDC-1843 forward drops attachments · NDC-1888 agent edits another agent's comment · NDC-1906 empty reply can be sent · NDC-1908 reply from an older message quotes the newest · NDC-2182 reply HTML not sanitised · NDC-2377 rejected reply still saved · NDC-1986 reply triggers (Phase 2) · NDC-1981 light agents · NDC-2004 AI reply help · NDC-2017 / NDC-2177 / NDC-2178 / NDC-2179…2192 scheduled replies.
