# Results — Desk ticket tabs retest (26 Nov 2026, NDC-Staging)

Accounts: owner (ndc-staging-owner) + agent C (Customer Experience Specialists 2, Desk Agent, Customer Support only), one sign-in each.
Customer Support tickets enter another tester's active "test blueprint" (status locked), so close/notify cases ran in **Sales** (no blueprint).
Zoho = live techegysolutions (read-only) + help.zoho.com.

| ID | Verdict | Note |
|---|---|---|
| TT-01 | PASS | Tabs + counts, no raw keys |
| TT-02 | PASS | Arabic RTL, tabs/labels translated, no raw keys (durations in Latin digits, dates in Arabic digits — cosmetic) |
| R-01 | PASS (differs) | Editor opens directly; "No resolution yet" text not shown when the agent can edit |
| R-02 | PASS | Save disabled when empty; API "Resolution content is required." |
| R-03 | PASS | Added; "ndc-staging-owner · date"; history resolution.added |
| R-04 | PASS | Edit; history resolution.updated |
| R-05 | PASS | Clear empties; Cancel only in edit mode |
| R-06 | PASS | Menu Edit/Delete; "Delete this resolution?"; history resolution.deleted |
| R-07 | PASS | Long/Arabic/format kept; 100,000-char limit; `<script>`/onerror stored raw but NOT run on the page |
| R-08 | PASS (1 odd) | Notify sends email + status → On Hold (waiting status) on 4 of 5 tickets; #7702 (edit on screen) got the email but stayed Open — not reproduced (INCONCLUSIVE) |
| R-09 | PASS | 422 "This ticket has no customer email address to notify." (API field is notify_contact) |
| R-10 | WAITING | User to click Accept (#7702) and Decline (#7703) in the emails |
| R-11 | PASS | Saves + opens new article "Drafted from ticket #7715" |
| R-12 | PASS | Bulk 2 tickets; empty refused; C on Marketing ticket not applied |
| R-13 | NOT RUN | No macros on the tenant; creating one skipped |
| R-14 | PASS | Resolution can be added on a Closed ticket |
| R-15 | PASS | C: Marketing ticket 404; own department allowed |
| T-01 | PASS | Form fields + charge types; default billing from settings (Non-billable) |
| T-02 | PASS | Screen add 0h20 Billable; total updates |
| T-03 | PASS | Edit 30→45 |
| T-04 | PASS | Delete |
| T-05 | PASS (notes) | Zero/negative/over 24h/bad billing/bad date/negative cost/2000+ desc refused. API accepts minutes=60, seconds=75 (normalised) and a 2030 work date |
| T-06 | PASS | 0h45×100+20 = 95; 1h20×90 = 120; currency EGP = company currency |
| T-07 | PASS (partial) | All/My filter works; "Filter by" billable dropdown not driven by the script |
| T-08 | PASS / FINDING | Log for another agent works; **API accepts an agent id that does not exist** |
| T-09 | PASS | Start/Pause/Resume/Stop → "Log this time" (Taken from the timer) → entry |
| T-10 | PASS | Discard writes no entry |
| T-11 | PASS | 409 TIMER_ALREADY_RUNNING; other ticket shows "Timer active on #7709" |
| T-12 | PASS / FINDING | Dialog Cancel/Discard/Submit time works; **dialog shows 0:01:25 while header shows 0:01:41 and the saved entry is 00:01:50** |
| T-13 | PASS | Timer kept after reload (header) |
| T-14 | PASS (note) | Auto timer starts on open; switching tickets auto-logs the time as a Non Billable entry with no description; a timer stayed running after the browser was killed |
| T-15 | INCONCLUSIVE | 24h cap not waited |
| T-16 | PASS = Zoho | C can edit/delete owner entries and log as owner; Zoho Agent profile also has timeEntry edit/delete = true |
| T-17 | PASS | desk_time_entries module lists the entries |
| P-01 | PASS | API role none; screen still loading in shot |
| P-02 | PASS | Link by number/subject; "(UP TO 200)"; "You can link 197 more" |
| P-03 | PASS | Parent + "Other child tickets of the parent" |
| P-04 | PASS | No grandchild / one parent / not self. Cross-department child allowed = Zoho ("cross-department can be associated") |
| P-05 | PASS | max_children 200 = Zoho |
| P-06 | PASS | Unlink both ways |
| P-07 | PASS | "1 related ticket is not shown because you cannot open it." |
| P-08 | PASS | none: parent closed, children open |
| P-09 | PASS | close_children: all closed |
| P-10 | PASS on screen / FINDING | Screen + /close: 422 "still has N open child tickets"; **records API status=Closed (field update / mass update path) closes the parent with children open** |
| P-11 | PASS | Parent closes after last child |
| P-12 | PASS on screen / FINDING | Screen Reopen → parent reopens (= Zoho). **Child set to Open through the status field does not reopen the parent** (also seen 13 Nov); the same /reopen call from the API script did not reopen it either (2/2) |
| P-13 | PASS | Delete child → restore from bin → link back |
| P-14 | PASS (fixed) | W3-35: C now 403 desk:ticket_settings:manage |
| P-15 | PASS | Merged child closes and stays listed as Closed child |

## Bug candidates (not filed)
- F1 Medium — Parent-Child | "Close parent only after children" rule is skipped when status is set through the record update (field update / mass update / API)
- F2 Low — Parent-Child | Child reopened through the Status field does not reopen the closed parent
- F3 Low — Time Entry | API accepts a time entry for an agent that does not exist
- F4 Low — Time Entry | "Your timer is still running" dialog shows an old duration; the saved entry has a different one
