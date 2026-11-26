# Desk ticket page — Resolution, Time Entry, Parent-Child full retest (PLAN, waiting Gate 1)

Planned 26 Nov 2026. Nothing run yet.

## Why
Last tested 12–13 Nov (Desk go-live Wave 2: W2-15, W2-42, W2-52..54, W2-59; Wave 3: W3-30, W3-31, W3-35). All passed except W3-35.
The build has changed since then: Approval badge, timer in the header, Time Entry costs, resolution Notify customer and customer accept/reject.
This retest covers every function of the three tabs on the current build, on screen and through the API.

## What the current build offers (read from the public Desk bundle + desk-tickets.json, 26 Nov)
- **Resolution:** Add / Save / Save And Add Article / Clear / Cancel / Edit / Delete. "Notify customer" asks the customer to accept; public /resolution page; history events added / updated / deleted / accepted / rejected / unanswered (auto-close). Bulk "Update Resolution" from the list. Macro action "Set the resolution". Errors: content required, cannot email customer, no customer email.
- **Time Entry:** Add / Edit / Delete. Hours / Minutes / Seconds, Work date, Agent, Description, Charge type, Billing type (Billable / Non Billable), Agent Cost Per Hour, Additional Cost, Total Cost (currency shown "EGP"). Filters: All / My Time Entries, Billable, Non Billable, Total Time Spent. Header timer: Start / Pause / Resume / Stop ("Log this time") / Discard; Auto mode; one timer at a time ("Timer active on #N"); 24h cap; "Your timer is still running" dialog when closing (Submit time / Discard / Cancel). Settings: /desk/time-tracking/settings. Charge types in the code include consultation, development, bug fix, training (T-01 checks the list in EN and AR).
- **Parent-Child:** Link child tickets / Set parent ticket / Unlink / Unlink from parent; "N child tickets (up to MAX)"; siblings list; hidden-ticket note; rules: a child cannot have children, one parent only. Close rules: none / close children / block while open / auto-close parent.

## Setup
- NDC-Staging (staging-desk.taviportal.com), Wonder Travel tenant, Customer Support department.
- Accounts: **owner** (signs in once) and **agent C** (Customer Support only, Desk Agent profile; signs in once) for the permission cases.
- Test data: new tickets with subjects starting "QA TT" + one QA contact with an email address. Nothing real is touched.
- Before: baseline of time-tracking, resolution-confirmation and parent-child settings. After: delete every QA TT item, restore the settings, and diff against the baseline (target: zero left).

## Cases (47)

### All three tabs
| ID | Case | Expected | Type |
|---|---|---|---|
| TT-01 | Open a QA ticket; look at the Resolution, Time Entry, Parent-Child tabs | Tabs show; Time Entry tab count matches entries; no raw text keys | UI |
| TT-02 | Same in Arabic | Right-to-left, Arabic labels, no raw keys or English leftovers | I18N |

### Resolution
| ID | Case | Expected | Type |
|---|---|---|---|
| R-01 | Empty tab | "No resolution yet" + description | UI |
| R-02 | Save empty | "Resolution content is required.", nothing saved | NEG |
| R-03 | Add resolution, Notify off | "Resolution saved."; "Updated by … · …"; History "Resolution added" | UI+API |
| R-04 | Edit it | New text shown; History "Resolution updated" | UI+API |
| R-05 | Clear and Cancel while editing | Clear empties the editor; Cancel keeps the saved text | UI |
| R-06 | Delete | Confirm dialog; removed; History "Resolution deleted" | UI+API |
| R-07 | Long text (5,000 chars), Arabic, bold/list/link, `<script>` text | Saved and shown as typed; script not run | EDGE/SEC |
| R-08 | Notify on, contact has email | "The customer was notified."; email with accept/decline arrives (**you check the inbox**) | E2E |
| R-09 | Notify on, ticket without contact email | "This ticket has no customer email address…"; untick saves | NEG |
| R-10 | Customer accepts, then (second ticket) declines from the email link | History "accepted" / "not accepted"; ticket state per settings | E2E |
| R-11 | Save And Add Article | Resolution saved; KB article editor opens prefilled (article deleted after) | UI |
| R-12 | List › select 2 tickets › Update Resolution | Both replaced; "Resolution updated on 2 tickets." | UI+API |
| R-13 | Macro with "Set the resolution" on a ticket | Resolution set by the macro (macro deleted after) | UI |
| R-14 | Resolution on a Closed ticket | Can be added/edited, or refused with a clear message (record which) | EDGE |
| R-15 | Agent C on a ticket outside their department (API) | 403/404; on own-department ticket allowed | PERM |

### Time Entry
| ID | Case | Expected | Type |
|---|---|---|---|
| T-01 | Empty tab, open Add Time Entry | "No Time Entry available"; all form fields present | UI |
| T-02 | Add 0h30 Billable | Row shown; Total Time Spent 0h30; tab count 1; History "Time entry added" | UI+API |
| T-03 | Edit to 0h45 | Total 0h45; History "Time entry updated" | UI+API |
| T-04 | Delete | Confirm; total 0; History "Time entry deleted" | UI+API |
| T-05 | Zero, negative, 60+ minutes, over 24h, no billing type | Field errors, nothing saved (screen and API 4xx) | NEG |
| T-06 | Cost: rate 100/h × 0h45 + additional 20 | Total Cost 95; currency matches the company currency (screen shows "EGP") | CALC |
| T-07 | Filters All / My / Billable / Non Billable | Right rows; "No time entry matches this filter." when empty | UI |
| T-08 | Log time for another agent | Entry shows that agent; My Time Entries hides it | UI |
| T-09 | Header timer Start → Pause → Resume → Stop | "Log this time" prefilled, "Taken from the timer."; entry added; history timer events | UI+API |
| T-10 | Discard timer | Confirm; no entry; History "Timer discarded" | UI |
| T-11 | Timer on ticket A, open ticket B | B shows "Timer active on #A"; cannot start a second timer | UI |
| T-12 | Close ticket while the timer runs: Submit time / Discard / Cancel | Each does what the dialog says; Cancel leaves it open and running | UI |
| T-13 | Reload / second tab while the timer runs | Timer keeps its time (from /desk/timers/current) | UI |
| T-14 | Auto timer setting on | Starts on open, pauses on leave; setting restored | SETTINGS |
| T-15 | Over-24h cap | API/data check if possible, otherwise inconclusive (cannot wait 24h) | EDGE |
| T-16 | Agent C edits/deletes the owner's entry; logs on an outside ticket | Refused (or allowed per profile — record) | PERM |
| T-17 | Time Entries module list | Entry listed and opens its ticket | UI |

### Parent-Child
| ID | Case | Expected | Type |
|---|---|---|---|
| P-01 | Empty tab | "Not linked to other tickets" + buttons | UI |
| P-02 | Link 2 children from the parent (search by number and by subject) | "2 child tickets (up to MAX)"; "You can link N more" | UI+API |
| P-03 | Set parent from a third ticket | Child shows the parent and "Other child tickets of the parent" | UI |
| P-04 | Try to give a child its own children; give a ticket a second parent | Not offered / refused; "No tickets can be linked here…" | NEG |
| P-05 | Link up to MAX, then one more | Refused at the limit (API if MAX is large) | EDGE |
| P-06 | Unlink from the parent tab and "Unlink from parent" on the child | Links removed; history events on both tickets | UI+API |
| P-07 | Agent C opens a parent whose child is in another department | "1 related ticket is not shown because you cannot open it." | PERM |
| P-08 | Close rule: leave children open | Parent closes, children stay open | REG |
| P-09 | Close rule: close all children | All close | REG |
| P-10 | Close rule: block while open | "Close the child tickets too?" dialog; Close all works; API close refused | REG |
| P-11 | Close rule: auto-close parent | Parent closes when its last child closes | REG |
| P-12 | Reopen a closed child (screen button and status dropdown) | Parent reopens both ways (W3-31 only checked the button) | REG |
| P-13 | Delete a child ticket, then restore it | Parent count updates; link back after restore (or record) | EDGE |
| P-14 | Agent C changes the parent-child settings (W3-35 bug) | Refused now? (if still accepted, it is the already-filed bug) | PERM |
| P-15 | Merge a child into another ticket | Link moves or is removed cleanly; no broken row | EDGE |

## Needs from you
1. **R-08 / R-10:** a real email to a contact address you can read (mmohamed@ as before). I'll tell you when to check and click Accept / Decline.
2. **Zoho comparison:** should I check the differences against live Zoho Desk (read-only, Edge) before raising anything, or TAVI only?

## Gates
- Gate 1 (now): approve or trim the cases.
- Gate 2 (after the run): results + bug drafts for review. Nothing goes to Plane without your go.
