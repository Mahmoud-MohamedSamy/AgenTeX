# Spec — Desk Ticket Replies (reply, reply all, forward, comments, drafts, review)

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging) |
| Feature | Everything an agent adds to a ticket conversation: Reply / Reply All / Forward (ticket header and per entry), the composer (From, To, Cc, Bcc, Subject, rich text, quoted message, placeholders, rating link, templates, snippets, attachments), Send and send options, drafts (save, resume, discard, other agents' drafts), Send for review → approve / reject, comments (private / public, edit, delete, pin, @mention), thread actions (pin, make private, show original, split, retry), effects on the ticket (status, owner, counts, response due, history, CC list), department reply settings |
| Reference | Zoho Desk ticket replies — `reference/zoho-docs-inventory.md` (11 groups, help.zoho.com + DeskAPIDocument) and live org `taviportal` (read-only, 26 Oct 2026: Reply All composer on ticket #101 — From `support@taviportal.zohodesk.com`, To, Cc, Bcc, templates, rich toolbar with spell check, Browse Files / Attach From Cloud, Suggested Articles panel) |
| Plane | PRD **NDC-1851** "Ticket Replies" (9 sub-items, phases 1–3) · **NDC-1865** checklist item "Ticketing Reply". Scheduled replies are covered separately by NDC-2017 / NDC-2177 / NDC-2178 (only regression here). Regression (all Done): NDC-1838, 1842, 1843, 1888, 1906, 1908. Open: NDC-2377 (rejected reply still saved), NDC-2182 (reply HTML not cleaned) |
| Gap list | `desk-ticket-replies-missing-list.md` (= Group Z) |
| Build map | `reference/tavi-build-map.md` |
| Written | 26 Oct 2026 from bundle `index-PA6o3K2s.js`, the live API (GET) and the UI |
| Case prefix | `RPL-` (automation: feature `deskticketreplies`) |

---

## Feature inventory

### Built in Desk (26 Oct 2026)
- Reply / Reply All / Forward from the header split button and from each entry's menu; "Change how you reply" inside the composer — C.
- Composer: From (department mailbox), Recipients, Cc, Bcc, Subject "Re: …", rich text, Insert placeholder, Rating link, quoted message, Insert template, Snippets (All / Mine / Shared / New, placeholders), Save as snippet, Attach, Send for review, Send, More send options — B, G, H.
- Drafts: Save draft, one draft per agent per ticket (`drafts/mine`), all drafts listed — E.
- Review: submit / withdraw review, approve / reject — K.
- Comments: private by default, public option, edit, delete, pin, thread (`parent_comment_id`) — D.
- Entry actions: Pin, Make private, Show Original, Split, Retry (failed) — J.
- Ticket CC list ("Copied addresses"), department switches (CC, auto-private non-contacts, send-as-email, mass comments) — I, N.

### Not a gap
- AI reply drafting (non-goal in NDC-1851; NDC-2004).
- Multi-channel reply composition (non-goal in NDC-1851).

---

## 0 How to run

1. **Order:** §1 → A → B → C → D → E → F → G → H → I → J → K → L → M → N → O → E2E → Z.
2. **Serial:** every row that writes. Replies send real email: the **only** customer address allowed is `mmohamed@anyware.software`; the only CC address allowed is `mahmoud.mmohamedsamy@gmail.com` (both the user's). Forward targets: the same two.
3. **Tags** as in the Activities spec, plus `[mail]` (sends email) and `[inbox]` (needs someone to look at the inbox — mark Inconclusive if nobody can).
4. **Verdicts / evidence:** as the Activities spec (failed cases only, TAVI vs live Zoho).

## 1 Preconditions

### 1.1 Accounts
| Label | Account | Profile / departments | Use |
|---|---|---|---|
| AG | `fedelav803@meinvr.com` | Desk Agent, **Customer Support** (has a mailbox) | main runner |
| AD | `mahmoud.mmohamedsamy@gmail.com` | Desk Admin, HR / Marketing / Sales (no mailbox) | other-department rows, reviewer rows if it gets access |
| OW | `ndc-staging-owner` | owner | do not sign in |

### 1.2 Test data
- QA tickets created by API in **Customer Support**, channel email, contact email `mmohamed@anyware.software`, subject `QA RPL <case> <n>`. A ticket created by API has no inbound email thread — rows that need a customer message use a ticket where the customer emailed `customer-support@help-staging.anyware.software` (ask the user to send one email per such row, or reuse an existing email ticket **read-only**).
- Cleanup: delete QA tickets (Recycle Bin); delete QA snippets / templates; discard drafts.

### 1.3 Baseline
Department reply switches (`GET /desk/departments`), `/desk/channels/settings`, `/desk/snippets` (count), `/mail/signatures/me`, Customer Support CC settings. Diff after the run.

### 1.4 Blockers (Inconclusive, not Fail)
- Delivery: `/mail/platform/status` shows 0 delivered in 7 days although 40 sent — inbox rows `[inbox]` need the user to confirm receipt.
- AD is not in a department with a mailbox → reviewer and admin-in-Customer-Support rows need AD added to Customer Support (shared setting: **ask first**).
- Customer replies (I7, I8) need an email from `mmohamed@anyware.software` to the ticket.

### 1.5 Cannot be undone
Sent emails, history entries, sent-thread records (no delete for replies).

## 2 Surface and contract

### 2.1 API
See `reference/tavi-build-map.md` (replies, comments, drafts, review, pin, split, retry, headers, cc, sender, email-templates render, snippets resolve). Envelope `{success, data, error:{code,message}, meta}`.

### 2.2 Field register
| Field | Rule (TAVI, to confirm) | Zoho |
|---|---|---|
| To / Cc / Bcc | email list; suppressed / invalid addresses? | max 13,000 chars each; CC max 20 per ticket (PRD) |
| Subject | "Re: {{subject}}" default; ticket number in subject? | ticket ID in subject by default, hideable per department |
| Body | required (NDC-1906); HTML cleaned (NDC-2182) | max 16 M chars |
| Attachments | size / count limits (record) | 20 MB per file |
| Comment | private default | private default, 32,000 chars |
| Snippet | name, content ≤ 25,600, 200 per agent | 200 / 25,600 |

### 2.3 Data classes
D1 empty · D2 spaces · D3 `<p></p>` only · D4 very long (100 k chars) · D5 Arabic / RTL · D6 emoji · D7 `<script>`, `onerror`, `javascript:` link · D8 invalid email `a@b`, `a b@c.com` · D9 duplicate address in To and Cc · D10 support mailbox as recipient · D11 21 Cc addresses.

---

## Group A — Access and permissions
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-A1 | Agent can reply | AG on a Customer Support ticket | Reply All / Reply / Forward / Comment visible | `[func]` |
| RPL-A2 | Other department | AD opens AG's QA ticket URL and POSTs a reply via API | Refused (404 / 403) unless shared; no reply saved (cf. NDC-2196) | `[sec]` 🔒 |
| RPL-A3 | Edit others' comment | AG edits / deletes AD's comment (UI + API) | Refused (regression **NDC-1888**) | `[sec]` 🔒 |
| RPL-A4 | Send permission vs review | Profile without send permission (if one exists) | Send hidden; Send for review only (Zoho "Send Email" vs "Review Emails") — record | `[sec]` 🔒 |
| RPL-A5 | No / foreign token | POST reply without bearer / other tenant | 401 / 404 | `[api]` `[sec]` |
| RPL-A6 | Light agent | Light agent profile exists? | Private comments only (NDC-1981) — record | `[sec]` |

## Group B — Composer rendering and defaults
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-B1 | From default | Open Reply All | From = the ticket department's mailbox | `[func]` |
| RPL-B2 | From options | Open the From picker | Only active addresses of the ticket's department (record if other departments' addresses appear) | `[func]` |
| RPL-B3 | Recipients default | Reply All on a ticket with CC | To = contact; Cc = ticket CC list (Zoho: secondary contacts in CC) | `[func]` |
| RPL-B4 | Reply vs Reply All | Switch "Change how you reply" | Reply drops Cc; Reply All keeps it | `[func]` |
| RPL-B5 | Subject | Subject value | "Re: {{subject}}"; record whether the ticket number is added (Zoho adds the ticket ID by default) | `[func]` |
| RPL-B6 | Quoted message | Body | "On {date}, {name} <{email}> wrote:" + the message being answered; quote above / below per `quote_position` | `[func]` |
| RPL-B7 | Quote of an older message | Reply from the 1st entry when there are 2 | Quotes that entry (regression **NDC-1908**) | `[func]` |
| RPL-B8 | Signature | Agent with a signature | Signature inserted (record; agent has none — add one in Settings › My signatures if allowed) | `[func]` |
| RPL-B9 | Send disabled when empty | Open composer, no text | Send / More send options disabled (regression **NDC-1906**) | `[func]` |
| RPL-B10 | Toolbar | Bold, italic, list, link, size, colour | Applied in the sent HTML | `[func]` `[mail]` `[serial]` |
| RPL-B11 | Cancel | Type text → Cancel | Asks to discard or keeps a draft (record); nothing sent | `[func]` |
| RPL-B12 | Keyboard shortcuts | Shift+C comment, other shortcuts | Open the right composer | `[a11y]` |

## Group C — Reply, Reply All, Forward (send)
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-C1 | Send a reply | QA ticket → Reply → "QA RPL C1" → Send | Toast; new outbound entry, public, status sent; `counts.replies` +1 | `[func]` `[mail]` `[serial]` |
| RPL-C2 | Reply arrives | Inbox of `mmohamed@anyware.software` | Email from the mailbox, subject as B5, body, threading headers | `[inbox]` |
| RPL-C3 | Reply All with Cc | Add Cc `mahmoud.mmohamedsamy@gmail.com` → send | Both get it; Cc added to the ticket CC list (record) | `[func]` `[mail]` `[serial]` |
| RPL-C4 | Remove Cc from one reply | Reply All, remove the Cc chip, send | Ticket CC list unchanged (PRD Sub-Item 7 AC2) | `[func]` `[serial]` |
| RPL-C5 | Bcc | Add Bcc | Bcc stored on the entry, not shown to the customer | `[func]` `[mail]` `[serial]` |
| RPL-C6 | Forward | Forward to `mahmoud.mmohamedsamy@gmail.com` | Entry is **private** (Zoho / PRD Sub-Item 9); attachments of the forwarded message included (regression **NDC-1843**) | `[func]` `[mail]` `[serial]` |
| RPL-C7 | Reply All after Forward | Reply All on the ticket after C6 | Forward recipient not copied, forward not quoted (regression **NDC-1838**) | `[func]` `[serial]` |
| RPL-C8 | Reply to a non-contact | Reply to `mahmoud.mmohamedsamy@gmail.com` only | Public unless `auto_private_non_contacts`; with the switch on → private (PRD 9 AC3; switch change = ask first) | `[func]` `[serial]` |
| RPL-C9 | Recipient D-classes | D8, D9, D10, D11 | D8 refused with a message; D9 deduplicated; D10 refused or warned; D11 refused if a cap exists (Zoho 20) | `[data]` `[serial]` |
| RPL-C10 | Body D-classes | D1–D7 | D1–D3 refused; D4 accepted or clear limit; D5 / D6 intact; D7 stripped in stored and sent HTML (NDC-2182) | `[data]` `[sec]` `[serial]` |
| RPL-C11 | Double send | Double-click Send / repeat POST quickly | One reply only | `[conc]` `[serial]` |
| RPL-C12 | Suppressed Cc | One suppressed Cc address | The rest still delivered (regression **NDC-1842**) — needs a suppressed address (Inconclusive if none) | `[func]` |
| RPL-C13 | Rejected send | Mail server rejects | Error shown; no orphan reply saved (NDC-2377, open) | `[func]` |

## Group D — Comments
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-D1 | Private comment | Comment (default) | Private; not in the customer's help center; no email | `[func]` `[serial]` |
| RPL-D2 | Public comment | Comment visibility → Public | Public; visible in the help center (PRD 1 AC2) | `[func]` `[serial]` |
| RPL-D3 | Edit own comment | Edit | Saved, "edited" marker; history logged (PRD 1 AC3) | `[func]` `[serial]` |
| RPL-D4 | Delete own comment | Delete | Gone; history logged | `[func]` `[serial]` |
| RPL-D5 | Pin comment | Pin / unpin; "only me" vs "all agents" (PRD 1) | Pinned on top; visibility option recorded | `[func]` `[serial]` |
| RPL-D6 | @mention | Mention an agent | Mentioned agent notified (record) | `[func]` `[serial]` |
| RPL-D7 | Snippet in comment | Insert a snippet | Inserted with placeholders resolved | `[func]` `[serial]` |
| RPL-D8 | Comment D-classes | D1, D7, 40 k chars | D1 refused; D7 cleaned; limit message | `[data]` `[sec]` `[serial]` |
| RPL-D9 | Comment count | After D1, D2 | `counts.comments` matches | `[api]` |

## Group E — Drafts and collision
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-E1 | Save draft | Type → Save draft | `drafts/mine` holds it; indicator on the ticket | `[func]` `[serial]` |
| RPL-E2 | Resume draft | Reload, open Reply | Draft content restored | `[func]` `[serial]` |
| RPL-E3 | Autosave | Type, wait 2 min, reload | Restored without pressing Save (Zoho autosaves every 2 min) — record | `[func]` `[slow]` `[serial]` |
| RPL-E4 | Discard | Discard the draft | `drafts` empty | `[func]` `[serial]` |
| RPL-E5 | Another agent's draft | AD (or second agent) has a draft on the same ticket | AG sees "someone is replying" (Zoho collision prompt) — record | `[func]` `[serial]` |
| RPL-E6 | Viewers | Two agents on the same ticket | Presence shown (viewers heartbeat) | `[func]` |
| RPL-E7 | Send a draft | Resume and send | Draft removed; reply sent | `[func]` `[mail]` `[serial]` |

## Group F — Send options
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-F1 | Menu content | Type text → More send options | Record the options (Zoho: Send & Close, send-and-update-status, Schedule) | `[func]` |
| RPL-F2 | Send & Close | If offered | Reply sent and ticket Closed | `[func]` `[mail]` `[serial]` |
| RPL-F3 | Send and set status | If offered → On Hold | Ticket status On Hold | `[func]` `[mail]` `[serial]` |
| RPL-F4 | Schedule | Schedule +10 min | Listed in Scheduled Replies (regression only — NDC-2177) | `[func]` `[serial]` |

## Group G — Templates, snippets, placeholders, rating link
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-G1 | Insert template | Pick a template | Subject / body filled; placeholders resolved for this ticket | `[func]` |
| RPL-G2 | Placeholder | Insert placeholder → contact name | Resolved in the sent email | `[func]` `[mail]` `[serial]` |
| RPL-G3 | Rating link | Insert Rating link | Link in the email; opens the rating page | `[func]` `[mail]` `[serial]` |
| RPL-G4 | New snippet | "QA RPL snip" with `{{customer_name}}` | Saved in Mine | `[func]` `[serial]` |
| RPL-G5 | Snippet name rules | Name with spaces; duplicate name; 25,601 chars | Refused with a message (PRD 5: single token, limits) | `[data]` `[serial]` |
| RPL-G6 | Insert snippet | Pick it / type name + Tab (PRD 5 AC1) | Inserted with placeholders replaced | `[func]` `[serial]` |
| RPL-G7 | Shared snippet visibility | AG's unshared snippet; AD lists snippets | Not visible to AD (PRD 5 AC2) | `[sec]` `[serial]` |
| RPL-G8 | Delete shared snippet | Delete | Gone for others (PRD 5 AC3) | `[func]` `[serial]` |
| RPL-G9 | Save as snippet | Select text → Save as snippet | Snippet created from the selection | `[func]` `[serial]` |

## Group H — Attachments
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-H1 | Attach a file | 10 KB pdf | Sent with the reply; listed on the ticket | `[func]` `[mail]` `[serial]` |
| RPL-H2 | Size limit | 25 MB | Refused with a message (Zoho 20 MB) | `[data]` |
| RPL-H3 | Dangerous file | `.exe` renamed `.png` (cf. NDC-1856) | Refused or stored safely (record) | `[sec]` |
| RPL-H4 | Remove before send | Attach then remove | Not sent | `[func]` `[serial]` |

## Group I — Effects on the ticket
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-I1 | Counts | After a reply | `counts.replies` +1; tab count updated | `[api]` `[serial]` |
| RPL-I2 | Owner on reply | Unassigned QA ticket → reply | Record: replier becomes owner (Zoho community) or stays unassigned | `[func]` `[serial]` |
| RPL-I3 | Status on reply | Open ticket → reply | Status unchanged unless an option is chosen | `[func]` `[serial]` |
| RPL-I4 | First response / SLA | Ticket with SLA → reply | Response due cleared / met (record) | `[func]` `[serial]` |
| RPL-I5 | History | After C1, D3, D4 | History entries for reply, comment edit, delete with author and time (PRD goal 4) | `[func]` |
| RPL-I6 | Customer responded flag | Customer replies | "Customer Responded" view / flag set | `[func]` `[inbox]` |
| RPL-I7 | Closed ticket reopens | Customer replies to a closed QA ticket | Ticket reopens (Zoho) | `[func]` `[inbox]` |
| RPL-I8 | Scheduled reply cancelled by customer reply | regression NDC-2177 setting | Saved as draft | `[func]` `[inbox]` |

## Group J — Entry actions
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-J1 | Pin a reply | Pin / unpin | Shown pinned; API `pinned_at` | `[func]` `[serial]` |
| RPL-J2 | Make private | On a public outbound reply | Becomes private; hidden from the help center | `[func]` `[serial]` |
| RPL-J3 | Show Original | On an inbound email | Headers shown; nothing secret (no tokens) | `[func]` `[sec]` |
| RPL-J4 | Split | Split an inbound reply | New ticket with that message (Zoho: incoming only) — agent reply split refused | `[func]` `[serial]` |
| RPL-J5 | Retry failed | Failed reply → retry | Resent; attempts +1 | `[func]` |
| RPL-J6 | Filter the conversation | Filter replies / comments / private | Right entries | `[func]` |
| RPL-J7 | Print | Ticket ⋮ Print | Printable conversation | `[ui]` |

## Group K — Send for review
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-K1 | Submit for review | Type → Send for review | Draft in review state; ticket in "Tickets for Review" | `[func]` `[serial]` |
| RPL-K2 | Withdraw | Withdraw review | Back to my draft | `[func]` `[serial]` |
| RPL-K3 | Approve | Reviewer approves | Reply sent; record sender name (Zoho: reviewer) | `[func]` `[mail]` `[serial]` |
| RPL-K4 | Reject | Reviewer rejects | Draft returned with a note (record) | `[func]` `[serial]` |
| RPL-K5 | Approve own | AG approves own draft via API | Refused | `[sec]` 🔒 |

## Group L — Security
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-L1 | Stored XSS in reply | D7 body | Stripped in stored HTML, in the UI and in the email (NDC-2182) | `[sec]` `[serial]` |
| RPL-L2 | XSS in comment | D7 | Rendered as text | `[sec]` `[serial]` |
| RPL-L3 | Attachment from another ticket | `attachment_ids` of ticket B on ticket A | Refused (cf. NDC-2181) | `[sec]` `[api]` |
| RPL-L4 | From address spoof | POST with `from_address` of another department | Refused | `[sec]` `[api]` |
| RPL-L5 | Header injection | Subject with `\r\nBcc: x@y` | Rejected or cleaned | `[sec]` `[api]` |

## Group M — API contract
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-M1 | Reply shape | GET replies | Fields of the build map; `is_public`, `status`, `sent_at` | `[api]` |
| RPL-M2 | Missing / wrong types | POST without body; `to` as string; unknown field | 4xx with field names | `[api]` `[data]` |
| RPL-M3 | Unknown ticket | POST to a random id | 404 | `[api]` |

## Group N — Department settings
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-N1 | CC switch off | (ask first) `cc_enabled` false on Customer Support | Cc field hidden / refused | `[func]` `[serial]` |
| RPL-N2 | Auto-private switch | (ask first) see C8 | | `[func]` `[serial]` |
| RPL-N3 | Quote position | `quote_position` above / below | Composer follows (record) | `[func]` |

## Group O — i18n, a11y, performance
| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| RPL-O1 | Arabic UI | AR | Composer strings translated, RTL editor | `[i18n]` |
| RPL-O2 | Arabic body | Send Arabic text | Correct direction in the email | `[i18n]` `[mail]` `[serial]` |
| RPL-O3 | Keyboard / names | Tab through the composer | All controls named and reachable | `[a11y]` |
| RPL-O4 | Long conversation | Ticket with 50 entries | Opens < 3 s; composer usable | `[perf]` |

## E2E journeys `[serial]`
| ID | Journey |
|---|---|
| RPL-E2E1 | Agent answers: open QA ticket → template → placeholder → attach → Send → entry public → counts → history. |
| RPL-E2E2 | Internal collaboration: private comment @AD → AD replies in thread → pin → forward to consultant (private) → Reply All does not leak (NDC-1838). |
| RPL-E2E3 | Review: agent drafts → Send for review → reviewer rejects → agent edits → resubmits → reviewer approves → email sent. |
| RPL-E2E4 | Negative recovery: empty send blocked → invalid Cc refused → fixed → sent once. |

## Group Z — Gaps (from `desk-ticket-replies-missing-list.md`)
| ID | Item | How to check | Expected (Zoho / PRD) |
|---|---|---|---|
| Z1 | Send and set a status | Type text → More send options | Status picker on send (e.g. Waiting for customer) |
| Z2 | Ticket number in the subject | Subject field / sent email | `[#123]`-style id by default; hideable per department |
| Z3 | Editor tools | Toolbar | Inline image, strikethrough, font, spell check, attach from cloud |
| Z4 | Draft auto-save + Edit Draft menu | Type, wait 2 min, reload on another browser | Draft kept on the server; Send / Edit / Discard Draft |
| Z5 | Read receipts / delivery status | Reply status and thread info (NDC-1851 item 6) | Delivered / read / bounced per recipient |
| Z6 | Mass reply, mass comment, send as email | Department switches on (ask first) | NDC-1851 items 2, 3, 8 |

## Traceability (NDC-1851)
| PRD item | Cases |
|---|---|
| 1 Private & public comments | D1–D6, A3, I5 |
| 2 Mass comments | Z (department switch off) |
| 3 Mass replies | Z |
| 4 Scheduled replies | F4, I8 (rest: NDC-2177 spec) |
| 5 Snippets | G4–G9, D7 |
| 6 Read receipts | Z |
| 7 Secondary contacts (CC) | B3, C3, C4, C9, N1 |
| 8 Send as email | Z (department switch off) |
| 9 Public & private threads | C6, C8, J2, N2 |
| Goal "auditable" | I5 |

## Reporting
As the Activities spec. Never paste email bodies of real customers; report token lengths only.
