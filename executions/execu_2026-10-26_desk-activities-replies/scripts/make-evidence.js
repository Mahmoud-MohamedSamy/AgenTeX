// Writes the API cards and annotate specs for A-B2..A-B7 and R-B2, then renders them (apicard.js, annotate-vs-zoho.js).
// TAVI screenshots: evidence/raw/ev-*.png (build index-7qe5X0Gd.js, 1600x900); Zoho: evidence/raw/zoho-*.png (1280x720, read-only).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const S = __dirname;
const ENV = 'staging-desk.taviportal.com (build index-7qe5X0Gd.js, agent fedelav803) vs Zoho Desk portal taviportal (read-only)';
const card = (out, title, lines) => { fs.writeFileSync(path.join(S, out.replace('.png', '.json')), JSON.stringify({ out, title, lines }, null, 1)); execFileSync('node', [path.join(S, 'apicard.js'), path.join(S, out.replace('.png', '.json'))], { stdio: 'inherit' }); };
const T = (img, caption, boxes, crop) => ({ img, w: 1600, h: 900, caption, crop: crop || [0, 0, 1600, 900], boxes });
const Z = (img, caption, boxes, crop) => ({ img, w: 1280, h: 720, caption, crop: crop || [0, 0, 1280, 720], boxes });
const C = (img, h, caption, boxes) => ({ img, w: 1600, h, caption, crop: [0, 0, 1600, h], boxes });

card('card-A-B4.png', 'TAVI — completed call edited through the API (agent fedelav803, build index-7qe5X0Gd.js)', [
  ['POST /modules/{Calls}/records  subject "QA ACT E8 …", call_status = completed  → 201', ''],
  ['Page of that call: "Completed calls cannot be edited. Reopen the call to change it." (fields locked)', 'ok'],
  ['PATCH /modules/{Calls}/records/{id}  subject = "QA ACT E8 edited"', 'info'],
  ['→ 200, subject now "QA ACT E8 edited"   ← the read-only rule exists only in the screen', 'bad']]);
card('card-A-B5.png', 'TAVI — Completed Time (completed_time) on tasks, records API (agent fedelav803, build index-7qe5X0Gd.js)', [
  ['PATCH status = "Completed" (API)                     → 200, completed_time = null', 'bad'],
  ['UI "Mark as Complete" on the same kind of task        → completed_time = 2026-10-26T10:45:55Z (sent by the browser)', 'ok'],
  ['PATCH completed_time = "2001-01-01T00:00:00Z" on an open task → 200, stored 2001-01-01T00:00:00Z', 'bad'],
  ['So the server neither fills nor protects Completed Time: API clients, imports and rules leave it empty, and any client can backdate it.', '']]);
card('card-A-B6.png', 'TAVI — call duration (call_duration) values accepted by the records API (agent fedelav803, build index-7qe5X0Gd.js)', [
  ['POST call  call_status = completed, call_duration = "abc"    → 201 saved', 'bad'],
  ['POST call  call_status = completed, call_duration = "-1"     → 201 saved', 'bad'],
  ['POST call  call_status = completed, call_duration = "99:99"  → 201 saved', 'bad'],
  ['The field is a free single-line text; End Call writes "00:00:10" (HH:MM:SS) while the page label says "Duration (HH:MM)".', '']]);
card('card-A-B7.png', 'TAVI — accessible names of the Add Task drawer controls (DOM, build index-7qe5X0Gd.js)', [
  ['input[text]           name=""   placeholder="Type or pick a subject"   (Subject)', 'bad'],
  ['button                name="Choose a record…"                         (Ticket)', 'bad'],
  ['input[datetime-local] name=""                                         (Due Date)', 'bad'],
  ['button                name="Choose a record…"                         (Contact Name — same name as Ticket)', 'bad'],
  ['button                name="Select"                                   (Priority)', 'bad'],
  ['button                name="Select"                                   (Status — same name as Priority)', 'bad'],
  ['textarea              name=""   placeholder="Description"', 'bad'],
  ['The visible labels (Subject, Ticket, Due Date …) are not linked to the controls (no for/id, no aria-labelledby). Reminder radios (at / before / custom) have no label either.', '']]);
card('card-R-B2.png', 'TAVI — what "Save draft" does (agent fedelav803, ticket #518, build index-7qe5X0Gd.js)', [
  ['Click "Save draft" after typing "QA RPL EV draft text."', ''],
  ['Network: no request to /desk/tickets/{id}/drafts (nothing sent to the server)', 'bad'],
  ['GET /desk/tickets/{id}/drafts/mine  → 404 "You have no draft on this ticket."', 'bad'],
  ['localStorage: desk.composer.draft:<agent id>:<ticket id> holds the text   ← only this browser', 'bad'],
  ['The server API for drafts exists (PUT drafts/mine 200, used by Send for review), so the draft could be stored there.', 'info']]);

const specs = {
  'A-B2': { title: 'Activities | A task saved without a status has no status and never shows in Open, My Open or Overdue', panels: [
      T('ev-A-B2-addtask.png', 'TAVI — Add Task drawer: Status starts empty ("Select"); Save is allowed without it.', [{ b: [1116, 545, 1584, 606], n: 1 }]),
      Z('zoho-add-tasks.png', 'Zoho — Tasks › Add Task (live, opened and cancelled): Status starts as "Not Started".', [{ b: [452, 432, 724, 490], n: 1 }], [0, 100, 960, 620]),
      T('ev-A-B2-view-open.png', 'TAVI — Tasks › Open, search "QA ACT EV": only the task with status Not Started (1). The overdue task saved without status is missing.', [{ b: [304, 62, 405, 106], n: 2 }, { b: [272, 118, 1592, 178], n: 2 }]),
      T('ev-A-B2-view-all.png', 'TAVI — Tasks › All Tasks, same search: both tasks exist (2).', [{ b: [304, 62, 436, 106], n: 3 }, { b: [272, 118, 1592, 250], n: 3 }])],
    rows: [[1, 'Status of a new task', 'Defaults to "Not Started".', 'No default; the task is saved with no status at all (API create without status: status = null).', 'BUG'],
      [2, 'Open / My Open / Overdue views', 'An open, overdue task shows in Open and Overdue.', 'The task without status is in none of them, so it is invisible in every working view.', 'BUG'],
      [3, 'All Tasks', 'Listed.', 'Listed — the task exists.', 'SAME']] },
  'A-B3': { title: 'Activities | Priority, call status and direction show raw keys ("highest", "scheduled", "outbound")', panels: [
      T('ev-A-B3-task.png', 'TAVI — task page: Priority "highest" (stored key) instead of the label.', [{ b: [279, 515, 540, 573], n: 1 }]),
      Z('zoho-add-tasks.png', 'Zoho — Add Task: Priority "High", Status "Not Started" (labels).', [{ b: [62, 516, 334, 574], n: 1 }], [0, 100, 960, 620]),
      T('ev-A-B3-call.png', 'TAVI — call page: Call Status "scheduled" and Direction "outbound" (stored keys).', [{ b: [283, 451, 536, 509], n: 2 }, { b: [279, 719, 540, 777], n: 3 }]),
      Z('zoho-add-calls.png', 'Zoho — Add Call: Direction "Inbound / Outbound", Call Status "Completed / Scheduled / Current call", Priority "High".', [{ b: [62, 340, 440, 392], n: 2 }, { b: [62, 258, 300, 310], n: 3 }], [0, 100, 960, 620])],
    rows: [[1, 'Task priority', 'Highest, High, Normal, Low, Lowest.', '"highest" (lower-case key). Same in lists and the ticket ACTIVITY tab.', 'BUG'],
      [2, 'Call status', 'Completed, Scheduled, Current call (UI); Missed, Canceled in views.', '"scheduled", "missed", "completed" (keys).', 'BUG'],
      [3, 'Call direction', 'Inbound / Outbound.', '"outbound" / "inbound".', 'BUG']] },
  'A-B4': { title: 'Activities | A completed call is read-only on its page but can still be edited through the API', panels: [
      C('card-A-B4.png', 477, 'TAVI — the call page refuses edits, the records API accepts them.', [{ b: [20, 150, 1580, 330], n: 1 }]),
      Z('zoho-add-calls.png', 'Zoho — Add Call (live). Per the Calls help article, "once completed, a call record can no longer be edited" (not tried live: no calls in our org).', [{ b: [62, 340, 440, 392], n: 1 }], [0, 100, 960, 620])],
    rows: [[1, 'Edit a completed call', 'Not editable (help docs).', 'Page: locked with "Completed calls cannot be edited. Reopen the call to change it." API: PATCH → 200 and the subject changes.', 'BUG']] },
  'A-B5': { title: 'Activities | Completed Time is set by the browser: the API leaves it empty and lets clients backdate it', panels: [
      C('card-A-B5.png', 477, 'TAVI — Completed Time through the records API.', [{ b: [20, 96, 1580, 140], n: 1 }, { b: [20, 190, 1580, 236], n: 2 }]),
      Z('zoho-add-tasks.png', 'Zoho — Add Task (live). In Zoho completedTime is a read-only attribute filled when Status becomes Completed (API docs).', [{ b: [452, 432, 724, 490], n: 1 }], [0, 100, 960, 620])],
    rows: [[1, 'Complete a task through the API', 'completedTime filled by the server.', 'Stays null; only the screen fills it.', 'BUG'], [2, 'Write Completed Time directly', 'Read-only.', 'Accepted: any date (2001-01-01) is stored.', 'BUG']] },
  'A-B6': { title: 'Activities | Call duration accepts any text ("abc", "-1", "99:99")', panels: [
      C('card-A-B6.png', 400, 'TAVI — values the records API stores in call_duration.', [{ b: [20, 96, 1580, 240], n: 1 }]),
      Z('zoho-add-calls.png', 'Zoho — Add Call (live): Duration is two numeric boxes HH : MM (API: seconds, integer).', [{ b: [452, 422, 724, 474], n: 1 }], [0, 100, 960, 620])],
    rows: [[1, 'Duration value', 'Numeric HH:MM (seconds in the API); text is impossible.', '"abc", "-1" and "99:99" saved; the field is plain text.', 'BUG']] },
  'A-B7': { title: 'Activities | Add Task / Call / Event drawer fields and reminder options have no accessible names', panels: [
      T('ev-A-B2-addtask.png', 'TAVI — Add Task drawer: labels are shown but not attached to the controls.', [{ b: [1116, 120, 1584, 186], n: 1 }, { b: [1116, 480, 1584, 606], n: 2 }]),
      C('card-A-B7.png', 560, 'TAVI — accessible names read from the page (what a screen reader announces).', [{ b: [20, 96, 1580, 190], n: 1 }, { b: [20, 300, 1580, 390], n: 2 }]),
      Z('zoho-add-tasks.png', 'Zoho — Add Task (live): every field has a visible label. Zoho\'s screen-reader names were not checked.', [], [0, 100, 960, 620])],
    rows: [[1, 'Subject, Due Date, Description', 'Labelled fields (screen-reader names not checked).', 'No accessible name (placeholder only or nothing).', 'BUG'], [2, 'Pickers', 'Labelled fields.', 'Ticket and Contact both "Choose a record…"; Priority and Status both "Select".', 'BUG']] },
  'R-B2': { title: 'Ticket Replies | "Save draft" keeps the draft only in this browser; nothing is saved on the server', panels: [
      T('ev-R-B2-tavi.png', 'TAVI — after "Save draft" the composer closes and Reply All shows a DRAFT badge, but only this browser knows the draft.', [{ b: [1330, 84, 1512, 122], n: 1 }]),
      C('card-R-B2.png', 400, 'TAVI — request trace and the server answer.', [{ b: [20, 120, 1580, 240], n: 2 }]),
      Z('zoho-reply-composer.png', 'Zoho — Reply All composer on ticket #101 (live, closed without saving). Help docs: drafts auto-save every 2 minutes and reopen as "Edit Draft" (Send / Edit / Discard) for the agent on any device.', [], [0, 50, 1280, 720])],
    rows: [[1, 'After Save draft', 'Draft stored on the ticket; "Edit Draft" menu.', 'DRAFT badge from localStorage only.', 'DIFFERS'], [2, 'Same agent, another browser or device', 'Draft is there.', 'drafts/mine → 404 "You have no draft on this ticket."; the draft is lost.', 'BUG']] }
};
for (const [id, sp] of Object.entries(specs)) {
  const full = { out: id + '-vs-zoho.png', ticket: id, label: 'BUG', verdict: 'FAIL', env: ENV, date: '26 Oct 2026', ...sp };
  const f = path.join(S, 'spec-' + id + '.json'); fs.writeFileSync(f, JSON.stringify(full, null, 1));
  execFileSync('node', [path.join(S, 'annotate-vs-zoho.js'), f], { stdio: 'inherit' });
}
