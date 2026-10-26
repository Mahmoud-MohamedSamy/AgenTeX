# TAVI Desk — Activities (life cycle): build map (26 Oct 2026)

Host `https://staging-desk.taviportal.com`. Sources: bundle `index-PA6o3K2s.js` (chunks `ActivitiesPage-GYQMPyQ2.js`, `ActivityDetailPage-BsXpQff9.js`, `ActivityCreateDrawer-CxlFNLrS.js`, `ActivityTab-*.js`, `AddActivityMenu-BcBIR5N7.js`, `CalendarPage-BHDVi2SI.js`, `useActivityReminder-BWOCgLbV.js`, `activity.mutations-Bf57Npg2.js`), locale `desk` (`activities.*`, 372 strings — `tavi-locale-activities.txt`), live API (GET) and UI as agent `fedelav803` and admin `mahmoud.mmohamedsamy`. Nothing was saved.

## Modules (records API — activities are records)
| Kind | Module id | Required | Key fields and allowed values |
|---|---|---|---|
| Task | `d120a6c2-2596-4254-968b-a1bcd3a000bf` | subject | due_date (date_time) · status (Not Started, Deferred, In Progress, Waiting on Someone, Canceled, Completed) · priority (highest…lowest) · category (follow_up, meeting, email, research, documentation, other) · owner · team · ticket_id · contact_id · related_to · department · completed_time · is_spam |
| Call | `f7e488b5-0232-42fd-811c-1f24356af653` | subject, call_start_time | call_type (inbound, outbound, missed) · call_status (scheduled, in_progress, completed, missed, cancelled) · call_duration (text) · call_outcome (answered, unanswered) · call_end_time · phone_number · recording_url · owner · team · priority · ticket_id · contact_id · department · is_spam |
| Event | `6fb19115-9356-40f0-b064-840d8f1fad93` | title, from_time, to_time | all_day · location · participants (text) · category (meeting, demo, presentation, training, webinar, other) · status (scheduled, deferred, completed, cancelled) · owner · team · priority · ticket_id · contact_id · department · is_spam |

Counts on 26 Oct: 12 tasks, 44 calls, 72 events (mostly teammates' "test call from workflow" rows). One layout each ("Standard").

## Screens
- `/activities` (nav tab "Activities" for the agent; hidden in the admin's tab bar): sub-nav All Activities · Tasks · Calls · Events; view picker; search; Refresh; layouts **Classic / Compact / Table** (+ Manage columns); Filter; **Export this view** (xlsx / csv, safety limit); Sort by (Due Date / Start Time, Subject, Category, Status, Priority, Created, Modified) asc/desc; **Add Activity** (Task / Call / Event); row checkbox "Mark … as complete"; "Overdue" badge; Load more per kind. Table mode: select rows → bulk bar **Update** only (no Delete, no Assign).
- Views in the locale: All, My, Open, My Open, Completed, Canceled, Overdue, Today's, Deferred, Waiting on Someone, Missed / Missed Calls, My Completed, My Canceled, My Team, Today + Overdue, My Overdue, Tomorrow's, Next 7 Days + Overdue, My Missed (Calls), Spam; custom views (name, share with agents, delete). `GET /desk/activity-views` → `{views: []}` (no custom view yet).
- Add forms (drawer): **Task** Subject*, Ticket, Due Date, Task Owner (defaults to me), Contact Name, Team, Priority, Status, Description, Set Reminder. **Call** Subject*, Direction, Call Status, Start Time*, Duration, Ticket, Contact Name, Priority, Call Owner, Description, Team, Set Reminder. **Event** Subject*, Category, Status, Start Time*, End Time*, Ticket, Contact Name, Priority, Event Owner, Description, Team, Set Reminder, **Invitees** (agents + contacts, emailed). No Department field on any form.
- Detail page `/modules/{moduleId}/records/{id}`: properties panel (Ticket, Contact, Key Information: Owner, Status, Priority, Due Date + "Late by …", Category, Completed Time, Modified By; Reminders card; Description), title edit, Start timer, tabs Comments (@mention agents / teams, edit, delete) · Attachments · Time Entry, footer **Mark as Complete** / **Reopen Task**. Calls: Start Call · End Call (Outcome Answered / Unanswered, Call notes → ticket private comment "Call notes:"), Mark as missed, Cancel Call, Reschedule (log missed), Reopen Call, "Completed calls cannot be edited". Events: Mark as Completed, Cancel, Reopen Event, Invitees with RSVP (Going / Maybe / Not going). No Delete action seen on the detail page.
- Ticket → **ACTIVITY** tab: views Upcoming / Overdue / Completed / All / Spam, sort Due Date / Start Time or Created, Add a Call, Task or Event.
- Contact / Account → activities tab (`activities.customerTab.*`).
- `/calendar`: Month / Week / Day, All Users, Create, Options; reads tasks (due_date), calls (call_start_time), events (from_time) and `/desk/activities/invited`.

## Activity API (besides `/modules/{id}/records`)
| Method | Path | Notes |
|---|---|---|
| GET / POST / PUT / DELETE | `/desk/activity-views[/{id}]` | custom views |
| GET | `/desk/activities/reminders/options` | `{channels:{popup:true,email:true,sms:false}, max_per_activity:5}` |
| GET / POST / PUT / DELETE | `/desk/activities/{id}/reminders[/{rid}]` | reminders |
| GET / PUT | `/desk/activities/{id}/invitees` · `/invitees/me` · POST `/invitees/{iid}/rsvp` · GET `/desk/activities/invited` | event invitees |
| POST | `/desk/activities/{id}/timer…` · GET `/desk/timers/current` | timer |
| POST | `/desk/activities/calls/click-to-call` | telephony (excluded in NDC-2008) |
Probed and absent (404): `/desk/activities`, `/desk/activities/stats`, `/desk/activities/reports`, `/desk/activities/settings`. Ticket detail `counts` has no activity count.

## Earlier tickets on this area (do not re-file)
NDC-1782 activities gaps (only SMS reminders left) · NDC-2008 Phase 3 extras (table view, more views, bulk update, several reminders, click-to-call, timer) · NDC-1959 parent · NDC-1907 "Add Task" from the ticket Activity tab fails for agents · NDC-1803 activity comments cannot be edited/deleted · NDC-1813 call has no Reopen · NDC-1332 reminders never fire · NDC-1333 reminder settings scroll · NDC-1123 reminder options unlabelled · NDC-1791 imported tasks show no due date · NDC-2214 / NDC-2197 / NDC-2039 Tasks dashboards · NDC-2510 workflow Task action with invalid status · NDC-1328 blueprint task ids.
