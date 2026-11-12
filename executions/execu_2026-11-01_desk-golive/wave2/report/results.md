# Wave 2 results (NDC-Staging, 2 + 12 Nov 2026)

| Id | Verdict | Note |
|---|---|---|
| W2-01 | PASS | All, My, Open, On Hold, Escalated, Closed views listed with counts. |
| W2-02 | PASS | Created, cloned, clone deleted; duplicate name refused (409). Original view still live. |
| W2-03 | PASS | Pin and unpin both work. |
| W2-04 | PASS | 12 Nov: list filtered by "QA GL W2" returns only QA tickets, newest first. |
| W2-05 | PASS | Classic, Compact, Table, Handshake and a kanban custom view render. |
| W2-06 | PASS | Owner listed with 12 tickets. |
| W2-07 | PASS | Team lanes load. |
| W2-08 | PASS | Tag list with counts. |
| W2-09 | PASS | 201, numbers #781–#791 assigned. |
| W2-10 | PASS | Missing subject, missing status, bad priority: 422 with field errors. |
| W2-11 | PASS | #794 created, no "Permission denied" (NDC-2661). |
| W2-12 | PASS | Default series, no prefix, in order. |
| W2-13 | PASS | 12 Nov: picking the template on the create form fills subject "QA GL W2 from template" and priority Low. |
| W2-14 | PASS | Stored and shown as text; no script ran. |
| W2-15 | PASS | Header, properties and all 8 tabs present. |
| W2-16 | PASS | Saved; history rows added. |
| W2-17 | FAIL | "Followers was updated" shows a raw user-id list. See C1. |
| W2-18 | PASS | Sent to the contact; shows as sent. |
| W2-19 | FAIL | CC kept on the reply, but "Copied addresses" stays empty. Zoho adds a CC from a reply to the ticket's CC list. See C13. |
| W2-20 | PASS | Sent as forward. |
| W2-21 | PASS | Bad address and empty body refused (400). |
| W2-22 | PASS | All work. |
| W2-23 | PASS | Mention chip saved and shown. |
| W2-24 | PASS | Pin and unpin work. |
| W2-25 | PASS | Draft saved and restored (NDC-2644). |
| W2-26 | PASS | Scheduled on an email ticket, listed, cancelled. Phone ticket and past time refused. |
| W2-27 | FAIL | Placeholders resolve, but #{{ticket_number}} gives "##781". See C7. |
| W2-28 | PASS | Templates listed. |
| W2-29 | PASS | "No article matches this subject" (NDC-2636 message fixed). |
| W2-30 | FAIL | 12 Nov: signature saved, but it is not in the reply composer and not in the stored reply. See C11. |
| W2-31 | PASS | Assign to B, unassign work; agent C refused (not in the department). |
| W2-32 | PASS | Owner becomes me. |
| W2-33 | PASS | Open → On Hold → Closed → reopened. |
| W2-34 | PASS | "Bogus" refused (422). |
| W2-35 | FAIL | Move to Sales and back works, but the owner is cleared. See C6. |
| W2-36 | PASS | Read only, full, unshare work; own department refused. |
| W2-37 | PASS | C sees "Read-only for you"; reply, edit and close refused (403); private comment allowed, same as Zoho read-only sharing. |
| W2-38 | PASS | Child closed and points to the master; merge into itself refused. |
| W2-39 | PASS | Child back as its own Open ticket. |
| W2-40 | PASS | 12 Nov: your email became #3159; your reply to it was split on screen (message menu "Split as New Ticket") into #3166, same contact and department; the message moved off #3159. Split is offered only on later incoming messages: the opening message and agent replies are refused (409), same as Zoho. Both tickets deleted. |
| W2-41 | PASS | #793 "QA GL W2 child 2 (Clone)" created with the same fields. |
| W2-42 | PASS | Link, unlink work; self-parent and child-of-child refused. |
| W2-43 | PASS | Mark spam and not spam work. |
| W2-44 | PASS | Gone after delete, restored intact. |
| W2-45 | PASS | 12 Nov: deleted, then deleted forever from the Recycle Bin; restore then fails (gone). NDC-2248 looks fixed. |
| W2-46 | PASS | Add and remove work; short and HTML names refused. |
| W2-47 | PASS | Follow and unfollow work. |
| W2-48 | PASS | Uploaded, listed with size, deleted. |
| W2-49 | PASS | 12 Nov: a 30 MB file is refused on screen: "Each file can be at most 16 MB." The API upload is refused too (413). |
| W2-50 | PASS | Heartbeat works. |
| W2-51 | PASS | "mahmoud.mahamed1515 is also viewing this ticket" shown to the owner. |
| W2-52 | PASS | Start, pause, resume, stop add a time entry. |
| W2-53 | PASS | Add, edit, total updates. |
| W2-54 | PASS | Negative and over 24 h refused. |
| W2-55 | PASS | Request and cancel work. Approver outside the department is accepted; Zoho does not limit approvers to the department either. |
| W2-56 | PASS | 12 Nov: B approved one request and rejected the other on screen, each on its own card. |
| W2-57 | PASS | Submitted, withdrawn, nothing sent. |
| W2-58 | PASS | 12 Nov: B approved one review (reply sent) and rejected the other (shows rejected with B's note). |
| W2-59 | PASS | Save, edit, delete; empty refused. |
| W2-60 | PASS | Print preview with options. |
| W2-61 | PASS | Priority changed on 2 tickets. |
| W2-62 | PASS | Both tickets assigned to B and closed. |
| W2-63 | FAIL | An Open ticket can be archived and then leaves All Tickets. See C4. |
| W2-64 | PASS | 12 Nov: Ticket Number page shows the default format (next #3130) and the department series section. |
| W2-65 | PASS | Status set to On Hold and comment added. |
| W2-66 | PASS | "No SLA applies to this ticket." |
| W2-67 | FAIL | 404; screen shows "Something went wrong". See C5. |
| W2-68 | FAIL | 404. See C5. |
| W2-69 | FAIL | 404. See C5. |
| W2-70 | FAIL | 404. See C5. |
| W2-71 | PASS | Found by subject and by number. |
| W2-72 | FAIL | Opens, but filled with the reply draft. See C2. |
| W2-73 | PASS | 12 Nov: bell lists notifications with All, Unread, Flagged and @Mentions tabs and Mark all read. |
| W2-74 | PASS | 12 Nov: a mention made on screen shows in B's @Mentions tab ("You were mentioned on ticket #3105"). |
| W2-75 | PASS | B got "Ticket #781 assigned to you". |
| W2-76 | FAIL | 12 Nov: C (Customer Support only) can open Marketing ticket #3105 and its comments because B owns it. See C10. |
| W2-77 | PASS | 12 Nov: C cannot delete (403), share (403) or move a Customer Support ticket; with Tickets set to Private, C does not see unassigned tickets. |
| W2-78 | PASS | Arabic labels, right to left, no raw keys. |
| W2-79 | PASS | Logical tab order, focus ring on every stop. |
| W2-80 | PASS | Script not run; bold shown. |
| W2-81 | PASS | 404, no data. |
| W2-82 | PASS | Second one refused (409 version conflict). |
| W2-83 | PASS | 12 Nov: list API 0.1 to 1.1 s on staging; within the staging allowance. |
| W2-84 | PASS | No tasks, tags or records made by tenant rules for QA tickets. |
| W2-85 | FAIL | 12 Nov: C's list for "QA GL W2" includes Marketing tickets #3105 and #3106 (owned by B, not shared). See C10. |
