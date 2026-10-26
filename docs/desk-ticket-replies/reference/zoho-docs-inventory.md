# Zoho Desk – Ticket Replying: Capability Inventory (from official docs)

Prepared 26 Oct 2026 for TAVI Desk parity QA. Sources: help.zoho.com/portal/en/kb/desk/..., desk.zoho.com/DeskAPIDocument (full HTML downloaded and parsed), desk.zoho.com/support/WebhookDocument.do, zoho.com/desk pricing pages. No login was used.

**Tags:**
- **[doc]**: stated in an official Zoho KB, API or pricing page.
- **[inferred]**: deduced from doc text, an API example or a field name, or taken from a help.zoho.com **community** thread (marked "(community)"). Community threads are user or staff posts, not product docs, so retest these against live Zoho before treating them as requirements.

**Short source keys** (used after each item):

| Key | URL |
|---|---|
| S-ACT | https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-replies/articles/actions-available-while-replying-to-a-ticket |
| S-CONV | https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/actions-in-ticket-conversation |
| S-PRIV | https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-replies/articles/public-and-private-threads-in-tickets |
| S-CMT | https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-replies/articles/private-and-public-comments-in-tickets |
| S-SCHED | https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-replies/articles/sending-scheduled-reply-to-tickets |
| S-MASS | https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-replies/articles/sending-mass-replies-to-tickets |
| S-COLL | https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/avoiding-agent-collision-over-tickets-in-zoho-desk |
| S-TPLUSE | https://help.zoho.com/portal/en/kb/desk/customization/templates/articles/using-ticket-and-email-templates-in-a-ticket-in-zoho-desk |
| S-TPL | https://help.zoho.com/portal/en/kb/desk/customization/templates/articles/creating-and-managing-email-templates |
| S-PREF | https://help.zoho.com/portal/en/kb/desk/for-agents/articles/setting-agent-preferences |
| S-FAQT | https://help.zoho.com/portal/en/kb/desk/faqs/tickets/articles/faqs-working-on-tickets |
| S-PROF | https://help.zoho.com/portal/en/kb/desk/user-management-and-security/roles-and-profiles/articles/managing-user-profiles |
| S-AGT | https://help.zoho.com/portal/en/kb/desk/user-management-and-security/agents-and-teams/articles/add-manage-desk-agents |
| S-RT | https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/response-and-resolution-times/articles/response-time-cases-example-and-important-notes |
| S-SLA | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-sla-service-level-agreement |
| S-ONHOLD | https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-status/articles/on-hold-state-use-cases-and-behavior |
| S-WF | https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/workflow-automations |
| S-CAG | https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/custom-actions-gallery |
| S-NOTIF | https://help.zoho.com/portal/en/kb/desk/customization/notifications |
| S-HAPPY | https://help.zoho.com/portal/en/kb/desk/organization-settings/customer-happiness/articles/setting-up-customer-happiness-rating |
| S-TID | https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-customization/articles/customizing-your-ticket-id-starting-number |
| S-MOB | https://help.zoho.com/portal/en/kb/desk/mobile-apps/android/ticket-management/articles/replying-to-tickets |
| S-ZIA | https://help.zoho.com/portal/en/kb/desk/faqs/zia/articles/faqs-zia-generative-ai |
| S-IMFAQ | https://help.zoho.com/portal/en/kb/desk/faqs/instant-messaging/articles/faqs-instant-messaging |
| S-API | https://desk.zoho.com/DeskAPIDocument (sections: Threads, Tickets Comments, Ticket Attachments, MailReplyAddress, EmailTemplates, Profiles, Errors) |
| S-WH | https://desk.zoho.com/support/WebhookDocument.do |
| S-PRICE | https://www.zoho.com/desk/pricing-comparison.html |

Community threads, all under https://help.zoho.com/portal/en/community/topic/:

| Key | Topic slug |
|---|---|
| C-REVIEW | what-does-tickets-for-review-do |
| C-FROM | setting-default-from-address-when-replying-to-request |
| C-AUTOCC | is-it-necessary-to-include-zoho-desk-s-support-email-address-in-cc |
| C-REOPEN | how-to-avoid-reopening-of-tickets-on-customer-response |
| C-OWNER | is-it-possible-to-trigger-a-workflow-rule-when-an-agent-replies-to-a-ticket |
| C-ATT | is-there-a-size-limit-on-email-attachments |
| C-FWD | forward-no-ticket-number |
| C-SIG | department-e-mail-signatures |
| C-UNDO | bug-report-undo-send |
| C-DRAFTVIS | who-can-see-draft-replies-on-tickets |
| C-MENTION | notifications-on-mentions-in-comments |
| C-KB | its-possible-add-kb-inside-ticket |
| C-THREAD | setting-the-email-subject-when-replying-to-a-ticket |

---

## 1. Reply actions on a ticket

1. **Reply** opens the editor from the ticket detail view. It goes to the contact in the To field only, to "respond directly to the person who raised the ticket." [doc] S-ACT, S-CONV
2. **Reply All** sends to everyone in the conversation. Secondary contacts are added to CC automatically. The agent can add CCs by hand or remove them. [doc] S-CONV
3. Removing a secondary contact from CC on Reply All does **not** remove their Help Center access to the ticket. Access ends only when they are removed from the ticket's Secondary Contact field. [doc] S-CONV
4. **Forward** shares the ticket or conversation with someone outside the thread, such as a dev or testing team. [doc] S-CONV
5. Forwarded threads are **always private**, whatever the recipient. [doc] S-PRIV; API `isPrivate` field: "Forwarded threads are always private" S-API
6. The agent's signature is **not** applied to forwards. [doc] S-PREF
7. Button placement: Reply, Reply All and Forward are opened from the ticket ("Select Reply, Reply All, or the Forward option from More"). On mobile they are reached from the Reply icon, the More icon on the ticket, or the More icon on a thread. [doc] S-TPLUSE, S-MOB
8. **Reply from a thread vs. the ticket:** each thread has its own More menu (reply, forward, split, pin, show original, print). The API's `inReplyToThreadId` sets which thread a reply answers. [doc] S-MOB, S-API
9. **Comment** opens from the "Comment" button or **Shift+C**. Comments are **private by default**, and a drop-down next to Comment switches to **public**. [doc] S-CMT
10. **Private comments** are visible only to internal users with ticket access (admins, peers, agents from other departments). **Public comments** are shown in the Help Center to the contact and to secondary contacts with access. [doc] S-CMT
11. **Public comment vs. reply:** a reply is emailed to the customer as part of the conversation. A public comment appears only in the Help Center and suits quick updates. [doc] S-CMT
12. **Send for Review:** agents without the Send Email permission have their reply saved as a draft and routed for review. Reviewers need the "Review Emails" permission. API: `POST /api/v1/tickets/{ticket_id}/threads/{thread_id}/sendForReview` ("saves drafts of agent's responses... and sends them to a manager/senior agent for review"). [doc] S-PROF, S-API
13. The review queue is the "Tickets for review" view. A reviewer can only edit and send the draft (there is no "Approve as is"), and the reply then goes out **under the reviewer's name**. [inferred] (community) C-REVIEW
14. **Ticket Approval** is separate from reply review. The Approval tab has **Submit For Approval** with To Address, Subject and Description. The approver gets an email with a link and accepts or declines on the ticket page. The request stays **Pending** until decided. [doc] S-FAQT
15. **Reply in IM / Reply via Email:** a ticket from an IM channel (WhatsApp, Telegram, Facebook, etc.) can be answered in IM or switched to email. To is auto-filled if the contact has an email. Otherwise "the agent must manually enter the email address to respond via email." [doc] S-CONV
16. **Channel replies via API:** `sendReply` takes `channel` = EMAIL, FACEBOOK, TWITTER or FORUMS, plus integrated custom channels such as "YOUTUBE" (fetched with the Get Channels API). The custom channel "must be able to handle the reply otherwise the reply will fail." [doc] S-API
17. WhatsApp has a 24-hour session window. After it closes, agents must start a new message with a WhatsApp template. [doc] S-IMFAQ
18. **Resolution tab:** the Resolution can be shared with the customer via the **Notify Contact** checkbox, instead of a separate reply. There is **only one resolution per ticket**. [doc] S-FAQT
19. **Mass Reply:** select tickets in list view, then click Reply in the top bar. [doc] S-MASS
    - Max **50 tickets**, email only.
    - Not available in the All Departments view.
    - Not for Community or IM tickets. Social tickets qualify only if the last conversation was by email.
    - Secondary contacts and CCs from the last response also receive it.
20. **Send as Email** (new outbound ticket from the agent) exists as a separate flow, with templates and snippets available. [doc] S-MASS related link; [inferred] details

## 2. Reply editor

1. **From address:** must be a From address configured in the portal ("The from address in the email must be a from address configured in your help desk portal"). [doc] S-API Send Email Reply
2. From addresses per department are the API's MailReplyAddress resource, with fields `address` (max 100), `displayName`, `isDepartmentDefault` ("default reply-to address for the department") and SMTP details. List by `departmentId` with `isActive`. [doc] S-API MailReplyAddress
3. From addresses are managed at Setup > Channels > Email > From Address, where unused addresses (including the default Desk support address) can be disabled. [inferred] (community) C-FROM
4. A department-level default From was "in final QA" per staff, and the agent-level default is on the roadmap. [inferred] (community) C-FROM
5. **To** is auto-filled with the ticket contact. On Reply All, secondary contacts go into **CC**. [doc] S-CONV
6. **BCC** is a supported field (API `bcc`, max 13,000 characters, EMAIL only). Max lengths for `to` and `cc` are also 13,000 characters each. [doc] S-API
7. **Auto-CC support mailbox** setting ("Auto Cc e-mail replies to your support mailbox") lives under Setup > Channels > Email > Other Configuration. Reply All also re-adds every address from the latest public thread, which can include the support mailbox. [inferred] (community) C-AUTOCC
8. **Subject:** the ticket ID is included in the subject of outgoing replies by default. It can be hidden per department under "Hide Ticket ID in Outgoing Replies". [doc] S-TID
9. Forwarded threads hide the ticket ID by default. "Show Ticket ID in Forwarded Tickets" is a per-department setting. [doc] S-TID
10. **Rich text vs. plain text:** API `contentType` = `html` or `plainText` (default `plainText` per the attribute table). Returned threads show `text/html`. Content max is **16,000,000 characters**. [doc] S-API
11. In the UI the editor is an HTML editor. Templates support "Insert HTML", including embedded video. [doc] S-TPL
12. Formatting toolbar details (bold, lists, fonts, spell check) are not itemised in official docs. [inferred]
13. **Inline images:** images can be inserted in signatures with the Insert icon. Inline images in reply bodies are not explicitly documented. [doc] S-PREF; [inferred] for body
14. **Attachments:**
    - Ticket attachments: "The size of each file cannot exceed 20MB". One or many files can be added. Attachments are private by default and can be made public. [doc] S-FAQT
    - Reply attachments go through `attachmentIds` (EMAIL only), with IDs from the Uploads API. Using another user's upload ID in sendEmailReply or draftEmailReply raises an error. [doc] S-API
    - A staff post cites 40 MB for paid editions, against 20 MB for native file share. Allowed file types are not documented. [inferred] (community) C-ATT
15. **Signatures:** set per agent and **per department** at Setup > Personalization > Preferences > Add Signature. [doc] S-PREF
    - HTML editor with logo or image insert.
    - Save drop-down offers "apply to all departments".
    - Can be toggled off.
    - Not applied to forwards.
16. Admins cannot push one department-wide signature to all agents. The suggested workaround is a default template. [inferred] (community) C-SIG
17. **Email templates in the reply:** click the Template icon on the toolbar, browse folders in the right panel and select one; its content is inserted. [doc] S-TPLUSE
    - **Set as default**: the template auto-fills every new reply, and setting a default also stars it.
    - **Star** templates, up to 50 starred per department, with drag reorder.
18. **Template details:** [doc] S-TPL, S-API EmailTemplates
    - Module and department specific, and stored in folders.
    - Folder visibility: Only me, All agents, or Specific agents by Teams, Roles, Roles and Subordinates, or Agents.
    - Max 32,000 characters. Placeholders are allowed in subject and body.
    - Placeholder groups: Ticket (about 50 fields), Ticket Owner, Agent, Organization. Syntax is like `${Cases.Contact Name}`.
    - The API template carries `fromId`, `replyTo` and `attachmentIds`. Body max is 64,000 characters via API.
    - Free plan users can only use the default templates.
19. **Snippets** (canned responses) work in replies and in both private and public comments. [doc] S-CMT, S-MOB, S-MASS
    - Snippets icon > **View all Snippets**, then pick from My or Shared snippets.
    - A new snippet can be created inline, named and shared with selected agents.
    - On mobile, typing the snippet name inserts it. Sort by name or by created or modified time.
    - Mobile cannot create snippets.
20. Profile permission **shareSnippet** ("Permission to manage share snippet"). [doc] S-API Profiles
21. Snippets do not support placeholders the way templates do. [inferred] (community)
22. **KB articles:** Preferences let agents show or hide **article suggestions** that appear when Reply is clicked; with them hidden, ticket properties show instead and suggestions stay available from a left-pane icon. [doc] S-PREF
23. "Insert article as link" or pasting article content from the conversation searches only published articles in public departments. [inferred] (community) C-KB
24. **Zia Reply Assistance:** drafts a reply from KB articles, linking the source article. It falls back to open-domain data only if ChatGPT is configured. [doc] S-ZIA
    - Tones: Formal, Informal, Diplomatic, Assertive, Humorous. Length: short or long. It can also translate.
    - Regenerate in the Reply Assistance tab, then copy or insert into the editor.
    - **Writing Assistance** rewrites a selected part (tone, length, language).
    - Needs Zia enabled and Answer Bot trained with published articles.
25. **Quoted previous thread:** not described in official KB pages. [inferred]
26. **@mentions in comments:** agents use `zsu[@user:{zuid}]zsu`; teams use `zsu[@team:{teamId}_{teamName}]zsu`. Get comment with `include=mentions` resolves them. [doc] S-API Tickets Comments
27. Mention notifications depend on the "Mentioning in a ticket" agent notification rule. The notification center has an @Mentions filter. [inferred] (community) C-MENTION
28. **Visibility toggle on replies:** a reply is public automatically when the recipient is the primary or a secondary contact. An agent replying or forwarding to a non-contact can mark it private. [doc] S-PRIV
    - Setting: Setup > Channels > Email > Advanced Configuration > "Automatically set Ticket threads as private, if requestor is not the recipient."

## 3. Drafts

1. **Autosave** runs "every 2 minutes" while composing. [doc] S-ACT
2. **Save Draft** button is in the ticket header. A "Saved @ 7:54 PM" timestamp shows after saving. [doc] S-ACT
3. **Draft indicator:** reopening the ticket shows an **Edit Draft** drop-down with **Send Draft**, **Edit Draft** and **Discard Draft**. [doc] S-ACT
4. Draft threads have status `DRAFT`. Each draft exposes actions: [doc] S-API
    - `send` = `POST /api/v1/tickets/{id}/sendDraft?draftThreadId={threadId}`
    - `delete` = `DELETE /api/v1/tickets/{id}/draftReply/{threadId}`
5. **Draft APIs:** [doc] S-API
    - Create: `POST /api/v1/tickets/{ticket_id}/draftReply` for EMAIL, FACEBOOK or FORUMS. Same fields as sendReply, including `ticketStatus`. 1 credit.
    - Update: `PATCH /api/v1/tickets/{ticket_id}/draftReply/{thread_id}`, for EMAIL, FACEBOOK or FORUM drafts.
    - Delete one draft attachment: `DELETE /api/v1/tickets/{ticket_id}/threads/{thread_id}/attachments/{attachment_id}`.
6. **Multiple drafts:** when a scheduled reply is pending, "a new reply can be scheduled only after the first scheduled reply is delivered. Until then, the new one is saved as a draft". So more than one draft or pending item can coexist. [doc] S-SCHED; per-agent multiple drafts otherwise [inferred]
7. **Draft visibility:** other agents can see drafts, with no lock. [inferred] (community) C-DRAFTVIS
8. **Collision on reply:** clicking Reply while another agent is drafting prompts that "an agent is already preparing a response" and asks whether to continue. The other agent is prompted too. [doc] S-COLL
9. Floating alerts show when another agent views, drafts, replies, comments, edits a comment or leaves the ticket. They need no refresh and keep unsaved changes. [doc] S-COLL
10. **Discard Draft** deletes the reply. **Clear Schedule** keeps the content as a draft. [doc] S-SCHED
11. Blueprint **Strict Mode**: agents cannot create new drafts or schedule replies, but can still edit, reschedule, clear or discard existing ones. [doc] S-SCHED

## 4. Send options

1. **Send.** [doc] S-ACT, S-MOB
2. **Send & Close.** The per-user preference "Default Send Behaviour" is **Send** or **Send & Close**. [doc] S-PREF, S-MOB
3. **Send and update status:** choose a status (examples: "on-hold", "under discussion", "Waiting for customer reply") at send time. [doc] S-ACT
    - On by default. Toggle via **Open preferences** in the Send drop-down.
    - Needs the update-status permission.
    - Unavailable when a blueprint validation rule exists on Status with field-level permissions.
    - If "parent cannot be closed until children closed" is on, the reply still sends but the status does not change.
4. API: `ticketStatus` (max 120 characters, includes custom statuses) on `sendReply` and `draftReply`. [doc] S-API
5. **Schedule Reply:** in the drop-down next to Send & Close. [doc] S-SCHED
    - Presets: 10 min, 1 h, 4 h, 12 h, custom, or a date and time with time zone.
    - Max **60 days** ahead, **email tickets only**.
    - "Schedule and Close Ticket" option. Hovering the scheduled label shows the time.
    - Edit, reschedule (timer paused while editing), Reschedule & Close, Discard Schedule, Clear Schedule.
    - A customer reply before the time, or a customer closing from the Help Center, cancels the schedule and keeps it as a draft.
    - **Scheduled Replies view** (My or All): Send immediately, Reschedule, Clear schedule, Send immediately and close; mass actions on up to 50 rows.
    - Enable at Setup > Customization > General Settings > Schedule Replies (per department).
6. API query param `sendImmediately` (boolean, default false) on Send Email Reply. Its exact meaning (bypassing a queue or delay) is not explained. [doc] S-API; meaning [inferred]
7. **Undo send window:** no official Desk doc. A community bug report describes a 5–30 second Undo Send in Desk. [inferred] (community) C-UNDO
8. **Send for review / approval:** see 1.12–1.14.
9. **Time entry on reply:** Ticket Time Entry exists, via API `/tickets/{id}/timeEntry` with manual or auto mode. A time-entry prompt on reply is not documented. [doc] S-API; prompt-on-reply [inferred]
10. **Mass Reply send:** see 1.19. Status shows in Setup > Data Administration > Bulk Action Log > Mass Reply Log, with Initiated and Completed tabs (counts and failed recipients). [doc] S-MASS

## 5. Effects of a reply

1. **Ticket status:** an optional status update on send (4.3). Otherwise no automatic status change is documented for agent replies. [doc] S-ACT; [inferred] no default change
2. **Customer reply reopens a closed ticket:** "If the customer responds again, a closed ticket will be re-opened." [doc] S-FAQT
3. Reopen can be prevented by turning off "Fall-Back to Default" on the Closed status (Setup > Customization > Ticket Status) or by a workflow. [inferred] (community) C-REOPEN
4. **First response time:** response time runs from ticket creation until an agent sends a reply. [doc] S-RT
    - With consecutive replies, only the **first** counts.
    - Automated acknowledgements are excluded.
    - Business hours apply under SLA.
    - Agent response time excludes Closed and On Hold.
    - A reply to an unassigned ticket, or one owned by someone else, gives agent response time = 1 min.
5. **Private threads count toward response time.** [doc] S-PRIV
6. Drafts sent for review do **not** stop the clock: response time runs until the final reply is sent. [doc] S-RT
7. **SLA:** applying an SLA resets response and resolution times, and the first reply after that counts. [doc] S-SLA, S-RT
    - On Hold statuses freeze SLA timers and escalations, which are rescheduled on return to Open. [doc] S-ONHOLD
    - Whether a reply cancels pending response escalations is not stated. [inferred] yes, response target met
8. **Thread count:** the ticket's `threadCount` attribute ("Number of threads associated with the ticket") increments. Each thread has `respondedIn` ("Time taken by the agent to respond"). [doc] S-API
9. **Owner assignment on reply:** replying to an unassigned ticket sets the replying agent as owner by default. [inferred] (community) C-OWNER
10. **Email threading:** replies match on the In-Reply-To header first. A ticket ID in the subject as `[## 123 ##]` also threads, but subject-based threading is "on demand". [inferred] (community) C-THREAD
11. API "Get Original Mail Content" (`GET /tickets/{id}/threads/{thread_id}/originalContent`) returns the full headers. [doc] S-API
12. **Ticket ID in subject:** included by default; it can be hidden per department. [doc] S-TID
13. **Public vs private:** a public reply is visible in the Help Center and the contact is notified. A private reply is not visible and sends no notification. [doc] S-PRIV
14. **Notifications:** [doc] S-NOTIF; rule names [inferred] (community)
    - Contact rule "Acknowledging a ticket reply" (on customer reply).
    - Agent rule "Receiving a ticket reply", plus a team version.
    - Rules are disabled by default and set per department.
15. Scheduled-reply success and failure rules: "Schedule reply Successful" and "Scheduled reply Failed". [doc] S-SCHED
16. **Happiness rating link:** Setup > Organization > Customer Happiness > Add Rating Link, with "To every response sent" or "When a ticket is closed". Standard edition and up. Template placeholder `${Cases.Customer Happiness Rating}`. [doc] S-HAPPY, S-TPL
17. **Bounces:** bounce messages are added to the ticket's conversation. Failed replies appear under **Email Failure Alerts** in the Notifications panel and **can be resent**. [doc] S-FAQT
18. API: "List / Clear email delivery failure alerts" and the `resendFailedThread?threadId=` action on a failed thread. [doc] S-API
19. **History:** sending a reply and editing or deleting comments are logged in the ticket History or audit trail. [doc] S-FAQT, S-CMT

## 6. Thread view

1. **Layout:** threads and comments show as one **conversation** or in **separate tabs** (Preferences). [doc] S-PREF
2. API preference `threadCommentViewType` = recentTop or recentBottom (sort order). [doc] S-API
3. **API listing:** [doc] S-API
    - List threads: `GET /tickets/{id}/threads`, `limit` 1–200 (default 100), `sortBy` `sendDateTime` or `-sendDateTime` (default descending).
    - List conversations (threads plus comments): `GET /tickets/{id}/conversations`, limit 1–200.
4. **Thread details:** [doc] S-API
    - `channel`, `direction` in/out, `status` (SUCCESS, PENDING, FAILED, DRAFT), `visibility` and `isPrivate`.
    - `fromEmailAddress`, `to`, `cc`, `bcc`, `author` (AGENT or END_USER), `attachments` (name, size in KB, href), `hasAttach`.
    - `isForward`, `isDescriptionThread`, `canReply`, `summary`, `sentiment` (Positive, Negative, Neutral), `respondedIn`.
    - `actions` (send, update, delete links), `source`.
5. **Show Original** shows the original email headers (copy or download). It is not available on comments. Paired with **Mark as spam**. [doc] S-CONV
6. **Print** the ticket with its conversation. Printing comments needs the Print Tickets extension. [doc] S-CONV
7. **Pin** a thread or comment for yourself or for all agents. Pinning for all needs admin permission (`pinnedConversations`). [doc] S-CONV, S-API
8. **Split as a new ticket** works only on incoming replies, not the description or agent replies, and moves only that thread. [doc] S-CONV
    - API: `POST /tickets/{id}/threads/{thread_id}/split`.
    - Response-time rules for split tickets are in S-RT. [doc] S-RT
9. **Resend failed:** see 5.17–5.18.
10. **Delete a thread:** no endpoint or UI action documented for email threads. `isDeleted` exists only for forum threads. [inferred] not supported
11. **Expand/collapse:** not documented textually. [inferred]
12. Get the latest thread: `GET /tickets/{id}/latestThread?needPublic&needIncomingThread&threadStatus=success|failed`. [doc] S-API
13. **Add to prediction** (Zia field prediction training) is available from the thread menu. [doc] S-CONV
14. Extensions add actions such as filing in BugTracker or JIRA. [doc] S-CONV

## 7. Permissions

1. **Send Email** (`mailSend`): "For sending email replies to customer tickets." [doc] S-PROF, S-API Profiles
2. **Review Emails** (`mailReview`): "approve response emails sent for review." [doc] S-PROF, S-API
3. Access to the conversation actions needs the "Ticket (Send Emails, Mass Reply, Review Emails)" permission. [doc] S-CONV
4. **Mass Reply** (`massReply`) needs Send Email. Path: Setup > User Management > Profiles > Tickets Permissions. [doc] S-MASS, S-API
5. **Comments:** [doc] S-PROF, S-API
    - Permission keys: edit, delete, `editOthers`, `deleteOthers`.
    - Admin "Comment Permissions": when disabled, "agents cannot leave a comment on any record."
    - `massComment` exists.
6. Other related permissions: `closeTicket`, `pinnedConversations`, `shareSnippet`, `templates`, `twitterConversationReply`. [doc] S-API
7. **Light agents:** [doc] S-AGT
    - **Cannot reply** to tickets or edit fields. **Private comments only**, no public comments.
    - Cannot merge, split or move tickets, and cannot be assigned tickets.
    - Not on Free. A paid add-on, with 50 free on Enterprise.
8. Built-in profiles (not editable): Support Administrator, Agent, Light Agents. Editable examples: Newbie Agent, Supervisor, Support Manager. [doc] S-PROF
9. **Templates:** using or managing them needs the Email and Ticket Template permission. Support Administrators have it by default. [doc] S-TPLUSE
10. Private and public thread features are listed under the Support Administrator permission. [doc] S-PRIV
11. A per-profile **From address permission** is not documented. [inferred] none
12. **Collision handling:** see 3.8–3.9. Other parts: [doc] S-COLL
    - Presence bubble (red when another agent is present).
    - Activity feed.
    - One-on-one or group collision chat titled with the ticket ID.
    - Prompts when another agent deletes or moves the ticket.
    - Also shown in Ticket Peek.
13. API error `LICENSE_ACCESS_LIMITED` covers features such as LIGHT_AGENTS by edition. `FORBIDDEN` is returned for missing permission. [doc] S-API Errors

## 8. Automation

1. **Workflow triggers** (Tickets module): [doc] S-WF
    - **Customer Reply**: fires on a new customer reply.
    - **Agent Response**: "when agents send a new reply to tickets".
    - **Private Thread**: incoming, outgoing or both.
    - **Happiness Ratings**.
    - Also Create, Edit, Field Update (Enterprise only) and Delete.
2. Workflows can be triggered for private conversations. [doc] S-PRIV
3. **Workflow actions:** email alert (notification, not added to the thread), task, field update, custom function. [doc] S-WF, S-CAG
4. **Custom Actions Gallery:** **Send Email Reply** (added to the ticket thread), **Add Comment** (public toggle), **Reply via Instant Messaging** (IM template), Assign, Tags, Followers, Spam, Share, Cliq. [doc] S-CAG
    - Max 5 custom actions per rule.
    - Placeholders use `{{ }}`. A null placeholder still runs with empty values.
    - Using the support address as To can cause loops.
5. **Workflow limits:** 25 criteria per rule, and up to 10 alerts, 10 tasks and 10 field updates per rule. [doc] S-WF
    - Rules per module per department: Standard 5, Professional 15, Enterprise 30.
    - Free: none. Express: 1 per module, tickets only (S-PRICE).
6. **Macros** apply several actions with one click, including sending emails. They are applied manually from the ticket. Per S-PRICE: Free and Express 2, Standard 5, Professional 15 per department, Enterprise 30 per department. [doc] S-PRICE, S-FAQT
7. **Notification rules:** contact "Acknowledging a ticket reply", agent "Receiving a ticket reply", "Mentioning in a ticket", and Schedule reply success or failure. [doc] S-NOTIF, S-SCHED; rule names partly [inferred] (community)
8. **SLA and escalation:** see 5.7. Supervisor rule condition "Hours since agent response pending". [doc] S-SLA
9. **Auto-responses:** contact notification "Receiving a new ticket" (acknowledgement with the ticket ID). These are excluded from response time. [doc] S-RT; name [inferred] (community)
10. **Webhooks:** [doc] S-WH
    - `Ticket_Thread_Add`: filters departmentId and `direction` (in or out). Payload includes channel, direction, status, isForward, to, cc, bcc, replyTo, fromEmailAddress, visibility, contentType, content, summary, attachments, isContentTruncated and fullContentURL.
    - Also `Ticket_Comment_Add`, `Ticket_Comment_Update`, `Ticket_Approval_Add` and `Ticket_Approval_Update`.

## 9. Settings

1. **Personal preferences** (Setup > Personalization > Preferences): [doc] S-PREF
    - Signature per department.
    - Default Send Behaviour (Send or Send & Close).
    - Show article suggestions on reply.
    - Thread and comment layout (conversation or tabs).
    - Keyboard shortcuts and time zone.
2. **Send-and-update-status toggle:** via Send drop-down > Open preferences. [doc] S-ACT
3. **Email Advanced Configuration:** "Automatically set Ticket threads as private, if requestor is not the recipient". [doc] S-PRIV
4. **Auto Cc support mailbox** (Setup > Channels > Email > Other Configuration). [inferred] (community) C-AUTOCC
5. **General Settings > Tickets:** [doc] S-TID, S-SCHED
    - "Hide Ticket ID in Outgoing Replies" (per department).
    - "Show Ticket ID in Forwarded Tickets" (per department).
    - Schedule Replies (per department).
    - Ticket ID prefix and suffix (org-wide or per department).
6. **From addresses** (Setup > Channels > Email > From Address). Each can have a Reply-To address. API MailReplyAddress with `isDepartmentDefault`. [doc] S-API; path [inferred] (community) C-FROM
7. **Templates:** Setup > Customization > Templates > Email Templates (folders, permissions, placeholders, default reply template per agent via "Set as default"). [doc] S-TPL, S-TPLUSE
8. **Snippets:** managed inline from the editor (create, share). No separate admin page is documented. [doc] S-CMT; [inferred] no admin page
9. **Collision detection:** no setting to switch it off is documented. [inferred]
10. **Happiness rating link** setting: see 5.16. [doc] S-HAPPY
11. **Notifications:** Setup > Customization > Notifications > Notification Rules (Agent and Contact sections). [doc] S-SCHED, S-NOTIF
12. **"Include previous threads in reply" / "Reply-all by default":** no official setting found. [inferred] not present or undocumented

## 10. API

All calls use base `https://desk.zoho.com/api/v1`, with headers `orgId` and `Authorization: Zoho-oauthtoken`. [doc] S-API

**Send replies**

1. **Send Email Reply:** `POST /tickets/{ticket_id}/sendReply`. Scope `Desk.tickets.UPDATE`. **Credit: 1 per 5 recipients.**
    - Query params: `isPrivate` (default false) and `sendImmediately` (default false).
    - Body: `channel`, `content` (**required**, max 16,000,000), `contentType` (html or plainText), `isForward`, `isPrivate`, `inReplyToThreadId`, `attachmentIds[]`, `direction`, `fromEmailAddress` (max 300, "mandatory for creating an email thread"), `to`, `cc`, `bcc` (max 13,000 each), `hasAttach`, `ticketStatus` (max 120).
    - The response returns a thread with `status: "PENDING"` (asynchronous send).
2. **Send Facebook / Twitter / Forum Reply:** the same endpoint with `channel` = FACEBOOK, TWITTER or FORUMS and `content`. Forums also need the `ZohoDiscussions.basic.ALL` scope. These responses come back with `status: SUCCESS`.
3. **Send Reply via Integrated Custom Channels:** the same endpoint, with `channel` set to a custom channel code from the Get Channels API.

**Drafts and review**

4. **Draft Email / Facebook / Forum Reply:** `POST /tickets/{ticket_id}/draftReply` (1 credit). Returns `status: DRAFT` with `actions`:
    - send = `POST /tickets/{id}/sendDraft?draftThreadId=`
    - delete = `DELETE /tickets/{id}/draftReply/{threadId}`
5. **Update Draft:** `PATCH /tickets/{ticket_id}/draftReply/{thread_id}` (content optional).
6. **Delete draft attachment:** `DELETE /tickets/{ticket_id}/threads/{thread_id}/attachments/{attachment_id}`.
7. **Send For Review:** `POST /tickets/{ticket_id}/threads/{thread_id}/sendForReview` (`Desk.tickets.UPDATE`).

**Read and manage threads**

8. **Get a thread:** `GET /tickets/{id}/threads/{thread_id}?include=plainText`.
9. **Get Original Mail Content:** `GET .../threads/{thread_id}/originalContent?inline=`.
10. **Get Latest thread:** `GET /tickets/{id}/latestThread`.
11. **List all threads:** `GET /tickets/{id}/threads` (3 credits, limit 1–200).
12. **List conversations:** `GET /tickets/{id}/conversations`.
13. **Split a thread:** `POST /tickets/{id}/threads/{thread_id}/split`.
14. **Resend a failed thread:** action link `POST /tickets/{id}/resendFailedThread?threadId=` (seen in an action example). [doc] example; [inferred] as a public endpoint
15. **Email delivery failure alerts:** List and Clear endpoints (Notification section). Also "Get my pending approvals".

**Comments**

16. Create: `POST /tickets/{id}/comments` with `content` (max 32,000), `isPublic` (settable only on create), `attachmentIds`, `contentType` (default html).
17. Update: `PATCH /tickets/{id}/comments/{comment_id}`.
18. Delete: `DELETE /tickets/{id}/comments/{comment_id}`.
19. Get: `GET /tickets/{id}/comments/{comment_id}?include=mentions,plainText`.
20. List: `GET /tickets/{id}/comments` with limit 1–100 (default 50) and `sortBy` commentedTime.
21. History: `GET /tickets/{id}/comments/{comment_id}/history`.
22. Mentions: `zsu[@user:{zuid}]zsu` and `zsu[@team:{teamId}_{teamName}]zsu`.

**Attachments, from addresses, templates**

23. **Ticket attachments:** `GET/POST /tickets/{id}/attachments` (multipart `file`, `isPublic`), `PATCH` and `DELETE /tickets/{id}/attachments/{attachment_id}`.
24. **Uploads** ("Upload file", which returns the IDs used in `attachmentIds`) is listed in the API table of contents. Its detail did not render in the static page. Using another user's upload ID throws an error. [doc] TOC; details [inferred]
25. **MailReplyAddress:** `GET /mailReplyAddress?departmentId=` (required), `GET /mailReplyAddress/{id}`, `POST /mailReplyAddress` (`Desk.channels.email.*`).
26. **Email templates:** `POST /templates` (`templateName` max 250, `subject` max 1000, `body` max 64,000, `recordType`, `departmentId` required, `folderId`, `fromId`, `replyTo`, `attachmentIds`). Scope `Desk.templates.CREATE`.

**Errors and webhooks**

27. **Validation and errors:** [doc] S-API Errors
    - HTTP statuses: 400, 401, 403, 404, 405, 413, 415, 422, 429, 500.
    - errorCodes: `INVALID_DATA` (errorType invalid, duplicate or missing, with `fieldName` as a JSON pointer), `UNPROCESSABLE_ENTITY`, `FORBIDDEN`, `SCOPE_MISMATCH`, `LICENSE_ACCESS_LIMITED`, `RESOURCE_SIZE_EXCEEDED`, `UNSUPPORTED_MEDIA_TYPE`, `THRESHOLD_EXCEEDED`, `TOO_MANY_REQUESTS`.
    - Example: a From address that is not configured, or a missing `content`, gives 422 or `INVALID_DATA`. [inferred]
28. **Webhooks:** `Ticket_Thread_Add` (direction filter), `Ticket_Comment_Add`, `Ticket_Comment_Update`, `Ticket_Approval_Add` and `Ticket_Approval_Update`. [doc] S-WH
    - A callback must return 200 within 5 s. A 410 response unsubscribes the webhook.
    - Max 20 webhooks per portal. Enabled by edition: Free 0, Standard 0, Professional 5, Enterprise 10, Ultimate 20.

## 11. Limits and edition availability

| # | Item | Limit or edition | Tag | Source |
|---|---|---|---|---|
| 1 | Attachment per file (ticket) | 20 MB | [doc] | S-FAQT |
| 2 | Reply attachments, paid editions | 40 MB (staff post) | [inferred] (community) | C-ATT |
| 3 | Reply content (API) | 16,000,000 characters | [doc] | S-API |
| 4 | To, CC, BCC (API) | 13,000 characters each | [doc] | S-API |
| 5 | fromEmailAddress (API) | 300 characters | [doc] | S-API |
| 6 | Comment content | 32,000 characters | [doc] | S-API |
| 7 | Email template | 32,000 characters (UI), 64,000 body (API) | [doc] | S-TPL, S-API |
| 8 | Starred templates | 50 per department | [doc] | S-TPLUSE |
| 9 | Mass reply | 50 tickets per action | [doc] | S-MASS |
| 10 | Scheduled reply | Up to 60 days ahead; email tickets only; one pending schedule per ticket at a time; mass actions on 50 rows | [doc] | S-SCHED |
| 11 | Autosave interval | 2 minutes | [doc] | S-ACT |
| 12 | Resolution | One per ticket | [doc] | S-FAQT |
| 13 | Threads list (API) | 200 per page | [doc] | S-API |
| 14 | Conversations list (API) | 200 per page | [doc] | S-API |
| 15 | Comments list (API) | 100 per page | [doc] | S-API |
| 16 | sendReply cost (API) | 1 credit per 5 recipients | [doc] | S-API |
| 17 | Users | Free 3, Express 5, Standard and up unlimited | [doc] | S-PRICE |
| 18 | Email channels (support addresses) | Free 1, Express 2, Standard 5, Professional 10, Enterprise 100 | [doc] | S-PRICE |
| 19 | Custom email templates | Free and Express: default templates only | [doc] | S-PRICE, S-TPL |
| 20 | Mass reply, Scheduled reply, Send for review, Approvals | Professional and Enterprise | [inferred] | S-PRICE (flattened table) |
| 21 | Private threads and public/private comments | All editions | [inferred] | S-PRICE |
| 22 | Happiness rating link in replies | Standard and up | [doc] | S-HAPPY |
| 23 | Light agents | Not on Free; paid add-on on Standard and Professional; 50 free on Enterprise | [doc] | S-AGT, S-PRICE |
| 24 | Workflows | Free none; Express 1 per module; Standard 5; Professional 15 per department; Enterprise 30 per department | [doc] | S-WF, S-PRICE |
| 25 | Macros | Free and Express 2; Standard 5; Professional 15 per department; Enterprise 30 per department | [doc] | S-PRICE |
| 26 | SLAs | Free and Express default only; Standard 4; Professional 10 per department; Enterprise 20 per department | [doc] | S-PRICE |
| 27 | Generative AI (Zia) | BYOK from Express; Native on Professional and Enterprise | [doc] | S-PRICE, S-ZIA |
| 28 | IM channels | Standard 1, Professional 10, Enterprise 50 | [doc] | S-PRICE |
| 29 | Social channels | 1 brand on Express to Professional; 2 brands on Enterprise | [doc] | S-PRICE |
| 30 | Webhooks | See 10.28 | [doc] | S-WH |
| 31 | Agent collision, snippets, time tracking | Edition columns not mappable from the pricing page | [inferred] | S-PRICE |

## Gaps in official documentation (verify on live Zoho)

1. Undo-send window (community only).
2. "Include previous thread / quoted text" behaviour.
3. Exact allowed attachment file types and per-reply total size.
4. Number of attachments per reply.
5. Department default From address (in rollout per community).
6. Owner auto-assignment on reply (community).
7. Whether a reply cancels pending response escalations.
8. Editor toolbar contents and spell check.
9. Deleting email threads.
10. "Agent Response" trigger behaviour for private, forwarded or scheduled sends.
11. Uploads API size limit.
