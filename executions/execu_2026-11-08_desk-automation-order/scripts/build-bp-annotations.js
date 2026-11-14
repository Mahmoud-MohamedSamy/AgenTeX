// Blueprint A6 drafted bugs D-2..D-11: write one spec per bug (evidence/specs/BP-Dn.json) and build each image with annotate-vs-zoho.js.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const E = 'executions/execu_2026-11-08_desk-automation-order/evidence/bp-bugs/';
const ENV = 'staging-desk.taviportal.com (NDC-Staging) · owner account · Edge';
const ZENV = ' · Zoho Desk techsolutionsegypt (live test blueprint, deleted after)';
const P = (side, img, caption, crop, boxes) => ({ ...(side ? { side } : {}), img: E + img, w: 1600, h: 900, caption, crop, boxes });
const specs = {
  'BP-D2': { label: 'BUG', out: 'BP-H6-second-editor-overwrites-first-silently.png', ticket: 'Blueprint · H6', title: 'Two people editing the same blueprint: the second save silently replaces the first person\'s change',
    date: 'TAVI 13 Nov 2026 (21:00 Cairo) · Zoho not checked live', env: ENV,
    panels: [P(null, 'd2-tab1-renamed.png', 'Tab 1 renames the blueprint to "QA BP D2 tabs RENAMED IN TAB 1" and presses Save and Publish (published)', [1300, 120, 300, 250], [{ b: [1316, 210, 1586, 250], n: 1 }]),
      P(null, 'd2-tab2-after-publish.png', 'Tab 2 (opened before tab 1 saved) changes only the description and publishes: no warning. Result, also after reload: Version 2, name back to "QA BP D2 tabs"; tab 1\'s rename is lost', [1000, 60, 600, 300], [{ b: [1316, 210, 1586, 250], n: 2 }, { b: [1316, 286, 1586, 348], n: 2 }])],
    rows: [[1, 'Tab 1 renames and publishes', 'Saved', 'Saved and published', 'INFO'], [2, 'Tab 2, opened earlier, changes the description and publishes', 'Tab 2 is told the blueprint changed since it was opened and can reload (no change lost)', 'Saved with no message; the rename from tab 1 is silently undone (same as NDC-2965 for Workflow Rules)', 'BUG']] },
  'BP-D3': { label: 'DIFFERS FROM ZOHO', out: 'BP-J15-continuous-blueprint-next-step-not-automatic-vs-zoho.png', ticket: 'Blueprint · J15', title: 'A continuous blueprint does not run the next step by itself',
    date: 'TAVI 13 Nov 2026 (20:58 Cairo) · Zoho 13 Nov 2026 (setting text seen live; not run)', env: ENV + ZENV,
    panels: [P('tavi', 'd3-designer-continuous.png', 'TAVI blueprint "QA BP D3 continuous": Advanced configuration = Continuous. Step 2 "QA auto" (Escalated → On Hold) asks for nothing', [1300, 120, 300, 260], [{ b: [1460, 320, 1545, 342], n: 1 }]),
      P('tavi', 'd3-ticket-stuck.png', 'Ticket #3541 after step 1: stays in Escalated ("In Escalated for 2 minutes"); "QA auto" waits for a click', [664, 60, 936, 150], [{ b: [676, 140, 1600, 200], n: 2 }]),
      P('zoho', 'zoho-D3-continuous.png', 'Zoho Create Blueprint: "In a continuous Blueprint, the next transition is automatically triggered as soon as the current transition is completed."', [280, 720, 690, 90], [{ b: [300, 730, 960, 795], n: 1 }])],
    rows: [[1, 'Continuous blueprint', 'The next transition runs by itself as soon as the current one completes', 'Saved as continuous, but nothing runs by itself', 'DIFFERS'], [2, 'Ticket after step 1', 'Moves on to the next state', 'Stays in Escalated (checked after 30 s and 2 min); also seen 12 Nov', 'DIFFERS']] },
  'BP-D4': { label: 'DIFFERS FROM ZOHO', out: 'BP-F2-blueprint-field-change-missing-from-history-vs-zoho.png', ticket: 'Blueprint · F2 / M1', title: 'Field changes made by a blueprint are missing from the ticket\'s History tab',
    date: 'TAVI 13 Nov 2026 (10:36 Cairo) · Zoho 13 Nov 2026 (20:13 Cairo, live)', env: ENV + ZENV,
    panels: [P('tavi', 'f2d-history.png', 'TAVI ticket #3474, History: transition "QA F2 desc" ran (its After action sets Description). Only "ran QA F2 desc" and the status change are shown, no Description line. The server has it (ticket.field_changed, source blueprint)', [664, 300, 936, 440], [{ b: [700, 450, 1100, 505], n: 1 }]),
      P('zoho', 'zoho-D4-history.png', 'Zoho ticket #191, History after transition "QA move" with an After field update: "Ticket updated as part of transition actions · Phone changed from -None- to 010000014"', [700, 230, 900, 450], [{ b: [740, 575, 1100, 665], n: 1 }])],
    rows: [[1, 'After action sets a field', 'History line "Ticket updated as part of transition actions" with old → new value', 'No line at all; a manual change of the same field does show', 'DIFFERS']] },
  'BP-D5': { label: 'BUG', out: 'BP-F2-address-change-shown-as-raw-json.png', ticket: 'Ticket History · F2', title: 'An address field change is shown in History as raw code text',
    date: 'TAVI 13 Nov 2026 (10:35 Cairo) · Zoho not compared (no address field type on Zoho Desk tickets checked)', env: ENV,
    panels: [P(null, 'f2-history-manual.png', 'TAVI ticket #3472, History after the QA address field City changed Cairo → Tanta: Old and New shown as JSON text', [664, 300, 936, 140], [{ b: [700, 365, 1350, 430], n: 1 }])],
    rows: [[1, 'Address field changed (City)', 'Readable text, e.g. "City: Cairo → Tanta" (or the full address as text)', 'Old {"zip": "11511", "city": "Cairo", …} / New {"street":"1 QA Street","city":"Tanta",…}', 'BUG']] },
  'BP-D6': { label: 'DIFFERS FROM ZOHO', out: 'BP-M1-history-shows-internal-blueprint-event-names-vs-zoho.png', ticket: 'Ticket History · M1', title: 'Blueprint lines in History show the internal name "BlueprintStateChanged" and text like "QA BP F2U|entered|Open"',
    date: 'TAVI 13 Nov 2026 · Zoho 13 Nov 2026 (live)', env: ENV + ZENV,
    panels: [P('tavi', 'm-history.png', 'TAVI ticket #3446: a line titled "BlueprintStateChanged", Detail "QA BP JU: QA verify", next to the readable "ran QA verify in QA BP JU"', [664, 580, 936, 160], [{ b: [700, 665, 1000, 725], n: 1 }]),
      P('tavi', 'f2-history-manual.png', 'TAVI ticket #3472: "BlueprintStateChanged", Detail "QA BP F2U|entered|Open"', [664, 725, 936, 70], [{ b: [700, 745, 1000, 790], n: 1 }]),
      P('zoho', 'zoho-D4-history.png', 'Zoho ticket #191: every blueprint line is readable: "Blueprint transition performed by …", Blueprint name, Transition name, From state, To state; "Blueprint applied"', [700, 230, 900, 640], [{ b: [740, 400, 1120, 540], n: 1 }])],
    rows: [[1, 'Blueprint events in History', 'Readable titles and fields only', 'Extra lines titled "BlueprintStateChanged" with internal text (pipe-joined "QA BP F2U|entered|Open")', 'DIFFERS']] },
  'BP-D7': { label: 'BUG', out: 'BP-H11-unsaved-designer-change-lost-on-session-expiry.png', ticket: 'Blueprint · H11', title: 'Unsaved designer changes are lost when the session expires',
    date: 'TAVI 13 Nov 2026 · Zoho not checked live', env: ENV,
    panels: [P(null, 'h11-before.png', '1. Description changed to "QA H11 change before expiry", not saved yet; the session then expires', [1300, 180, 300, 180], [{ b: [1316, 286, 1586, 348], n: 1 }]),
      P(null, 'h11-after-publish.png', '2. Save and Publish → "Your session expired. Please sign in again."', [570, 280, 460, 70], [{ b: [609, 299, 991, 337], n: 2 }]),
      P(null, 'h11-after-signin.png', '3. After signing in the designer opens again with the old description "QA A6": the change is gone', [1300, 180, 300, 180], [{ b: [1316, 286, 1586, 348], n: 3 }])],
    rows: [[1, 'Unsaved change when the session expires', 'Warned before losing it, or the change kept (local draft) and restored after sign-in', 'No warning', 'BUG'], [2, 'Save and Publish after expiry', 'Sign-in asked', 'Sign-in asked (good)', 'INFO'], [3, 'Back in the designer after sign-in', 'Change still there', 'Change lost', 'BUG']] },
  'BP-D8': { label: 'BUG', out: 'BP-D5-only-owner-suspended-ticket-stuck.png', ticket: 'Blueprint · D5', title: 'If the only owner of a transition is deactivated, nobody can run it and no warning is shown',
    date: 'TAVI 13 Nov 2026 (21:02 Cairo; agent reactivated right after) · Zoho not checked live', env: ENV,
    panels: [P(null, 'd8-ticket-owner-view.png', 'Ticket #3542 in "QA BP D8 owner": the only step "QA onlyA" is owned only by agent A, who is suspended. The admin owner sees "No transitions you can run"; Status is locked. API: 403 "You are not an owner of this transition."', [664, 60, 936, 150], [{ b: [1393, 143, 1590, 170], n: 1 }]),
      P(null, 'd8-designer-no-warning.png', 'Designer of the same blueprint: Status Active, no warning that a transition has no active owner', [1300, 120, 300, 260], [{ b: [1316, 320, 1586, 370], n: 2 }])],
    rows: [[1, 'Ticket waiting on that step', 'Someone can still move it (admin or a fallback), or the step is flagged', 'Nobody can run it; the ticket is stuck in Open', 'BUG'], [2, 'Blueprint after the owner is deactivated', 'A warning on the blueprint/transition', 'No warning; re-saving also works with no message', 'BUG']] },
  'BP-D9': { label: 'BUG', out: 'BP-N3-transition-owner-that-does-not-exist-accepted.png', ticket: 'Blueprint · N3', title: 'A transition owner that does not exist is accepted and shown as a raw id',
    date: 'TAVI 13 Nov 2026 (20:58 Cairo) · Zoho not compared (API case)', env: ENV,
    panels: [P(null, 'd9-ghost-owner.png', 'Blueprint "QA BP D9 ghost" saved through the API with owner id 5327d6ce-… (no such user): accepted (201). The designer lists the raw id as an "Agent" owner', [300, 540, 440, 160], [{ b: [316, 626, 716, 684], n: 1 }])],
    rows: [[1, 'Owner user id that does not exist', 'Refused like an id from another tenant (which is refused correctly)', 'Saved (201) and shown as a raw id "Agent"', 'BUG']] },
  'BP-D10': { label: 'BUG', out: 'BP-N8-large-blueprint-labels-overlap.png', ticket: 'Blueprint designer · N8', title: 'On a large blueprint the transition labels and buttons overlap; Firefox takes 43 s to open it',
    date: 'TAVI 13 Nov 2026 · Zoho not compared', env: ENV + ' · 30 states, 80 transitions',
    panels: [P(null, 'n8-big-edge.png', 'Blueprint "QA BP N8" (30 states, 80 transitions), Edge: transition labels and their + / delete buttons cover each other on every row', [440, 260, 860, 160], [{ b: [455, 274, 1185, 293], n: 1 }, { b: [480, 370, 1190, 390], n: 1 }])],
    rows: [[1, 'Labels and buttons on a dense graph', 'Readable and clickable (labels spaced or hidden until hover)', 'Overlap; hard to read or click', 'BUG'], [2, 'Time to open the designer', 'Usable in a few seconds', 'Edge 9.0 s, Chrome 10.7 s, Firefox 43 s (create 0.8 s, publish 0.9 s are fine)', 'BUG']] },
  'BP-D11': { label: 'BUG', out: 'BP-H3-issue-list-name-not-clickable-department-not-counted.png', ticket: 'Blueprint designer · H3', title: 'Issue list before publishing: the "name" line can\'t be clicked and a missing department isn\'t counted',
    date: 'TAVI 12 Nov 2026 · Zoho not compared', env: ENV,
    panels: [P(null, 'h3-issues.png', 'New blueprint with no name, no department and two unnamed transitions: "3 issues to fix before publishing"', [300, 120, 1300, 320], [{ b: [325, 158, 520, 173], n: 1 }, { b: [1316, 384, 1586, 420], n: 2 }])],
    rows: [[1, '"The blueprint needs a name"', 'A link that jumps to the Name box, like the transition issues', 'Plain text, not clickable', 'BUG'], [2, 'Department empty', 'Counted and listed as an issue ("4 issues")', 'Red on the field only; not in the count or list', 'BUG']] },
};
for (const [k, s] of Object.entries(specs)) {
  const f = path.join(RUN, 'evidence/specs', k + '.json'); const tOnly = !s.panels.some(x => x.side === 'zoho'); fs.writeFileSync(f, JSON.stringify({ verdict: 'FAIL', key: k, ...s, ...(tOnly ? { leftHead: 'TAVI Desk (screenshots)', rightHead: 'Expected (Zoho not checked live)', rightLabel: 'Expected' } : {}) }, null, 1));
  console.log(execFileSync('node', [path.join(__dirname, 'annotate-vs-zoho.js'), f]).toString().trim());
}
