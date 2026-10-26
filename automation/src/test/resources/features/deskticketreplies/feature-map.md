# Desk Ticket Replies — feature map

> Read before testing; update after every run.
> App: TAVI Desk `https://staging-desk.taviportal.com` · Reference: Zoho Desk ticket replies · PRD NDC-1851 · Created 2026-10-26
> Docs: `docs/desk-ticket-replies/` (spec, missing list, reference/). Manual run: `executions/execu_2026-10-26_desk-activities-replies/` (r*.js).

## Where it lives
| What | Path |
|---|---|
| Ticket + composer | `/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/{ticketId}` (redirects to `/views/all/tickets/{id}`) |
| Scheduled replies | `/scheduled-replies` |

## Email safety
Real emails only to `mmohamed@anyware.software` (contact of every QA ticket). CC / BCC / forward targets: `qa.rpl.cc@example.com`, `qa.rpl.bcc@example.com`. ReplyApiTest sends about 8 emails per run, ReplyUiTest 1.

## API (`/api/v1`, Bearer, `x-app-key: desk`)
| Method | Path | Body |
|---|---|---|
| GET/POST | `/desk/tickets/{id}/replies` | `{mode: reply|reply_all|forward, to:[], cc?, bcc?, subject, body_html, attachments?:[{file_id}]}`; max 20 recipients, body ≤ 65,535 |
| PATCH | `/desk/tickets/{id}/replies/{rid}` | `{is_public}` (refused when the customer is a recipient) |
| PUT/DELETE | `…/replies/{rid}/pin` · GET `…/headers` · POST `…/split` (incoming only) |
| GET/POST/PUT/DELETE | `/desk/tickets/{id}/comments[/{cid}]` | `{body_html, is_public}` (private by default) |
| PUT/DELETE/GET | `/desk/tickets/{id}/drafts/mine` · POST `…/mine/submit-review|withdraw-review` · POST `…/drafts/{did}/approve|reject` |
| GET | `/desk/tickets/{id}/cc` · `/activity` (feed: reply.sent, comment.added …) |
| GET/POST/DELETE | `/desk/snippets` | `{name (single word ≤50), content_html (≤25,600), is_shared}` · POST `/desk/tickets/{id}/snippets/resolve {snippet_id}` |

## Tests
| Class | Case | Groups | Last result (26 Oct, new build) |
|---|---|---|---|
| ReplyApiTest.sendReply | RPL-C1/I1/I5 | smoke | pass |
| .noTokenIs401 | RPL-A5 | smoke | pass |
| .otherDepartmentIsBlocked | RPL-A2 | regression | pass |
| .validation | RPL-C9/C10/M2 | regression | pass |
| .htmlIsCleaned | RPL-L1 | NDC-2182 | pass |
| .ccBccForward | RPL-C3/C5/C6 | regression | pass |
| .entryActions | RPL-J1/J3/J4 | regression | pass |
| .comments_ | RPL-D1..D5 | regression | pass |
| .snippets | RPL-G4..G8 | regression | pass |
| .agentAddressNotCc | RPL-C9b | possible-bug R-B5 | FAIL (agent address accepted) |
| .doubleSubmit | RPL-C11 | possible-bug R-B4 | FAIL (2 replies) |
| .ownReviewApproval | RPL-K5 | possible-bug R-B3 | FAIL |
| ReplyUiTest.composerDefaults | RPL-B1/B3/B9 | smoke, NDC-1906 | pass |
| .replyAllShowsTicketCc | RPL-B3 | regression R-B1 | pass (fixed in index-7qe5X0Gd) |
| .saveDraftReachesServer | RPL-E1 | bug R-B2 (NDC-2644) | FAIL |
| .sendAndClose | RPL-F2 | regression | pass |

## Traps
- The Reply All button text carries a "DRAFT" badge when a local draft exists — match with starts-with.
- Drafts live in localStorage `desk.composer.draft:<userId>:<ticketId>`; `TicketComposerPage.openTicket` clears it.
- The Cc input appears only after clicking the "Cc" button; recipients input is labelled "Recipients".
- "More send options" is disabled while the body is empty.
- `playwright-cli` turns a file chooser into a blocking modal — set files on `input[type=file]` directly.
- An agent's address as Cc: refused before the 26 Oct redeploy, accepted after (R-B5).
- The agent cannot delete tickets (403) — QA tickets remain after runs.

## Run history
| Date | Scope | Result |
|---|---|---|
| 2026-10-26 | API 12 + UI 4 | API 9 pass, 3 possible-bug fail · UI 2 pass, 2 bug fail |
