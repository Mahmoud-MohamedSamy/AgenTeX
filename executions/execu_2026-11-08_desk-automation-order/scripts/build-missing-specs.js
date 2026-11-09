// Writes one annotate spec per missing-list item (TAVI live, left; Zoho help page, right) and builds the images.
// node build-missing-specs.js [ids]
const fs = require('fs'), path = require('path'); const { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const RAW = 'executions/execu_2026-11-08_desk-automation-order/evidence/raw/';
const DATE = 'TAVI 9 Nov 2026 (live) · Zoho: help article (live Zoho Desk did not load on this network)';
const zp = (id, box, caption, extra) => ({ side: 'zoho', img: RAW + 'z' + id + '-doc.png', w: 1440, h: 900, crop: [150, Math.max(0, box[1] - 170), 800, 440], caption, boxes: [{ b: [box[0] - 6, box[1] - 4, box[2] + 6, box[3] + 4], n: 1 }].concat(extra || []) });
const menu = (crop, boxes, caption) => ({ side: 'tavi', img: RAW + 't31-setup-menu.png', w: 700, h: 2420, crop, caption, boxes });
const S = {
  '06': { title: 'Workflow email alerts cannot go to typed outside addresses', env: 'Setup › Workflow Rules › New rule › Email action (not saved)',
    panels: [{ side: 'tavi', img: RAW + 't06-wf-email.png', w: 1440, h: 1300, crop: [290, 560, 520, 320], caption: 'TAVI: Email action recipients are agents, teams, roles, a user field or the ticket’s contact; "Free-text addresses aren’t allowed" (1).', boxes: [{ b: [308, 806, 768, 850], n: 1 }] },
      zp('06', [291, 433, 927, 459], 'Zoho Desk help, Workflow alerts: "Additional Recipients: Enter the email addresses, separated by a comma" (1).')],
    rows: [[1, 'Sending a workflow alert to an outside address (supplier, manager mailbox)', 'Additional Recipients takes typed email addresses.', 'Not allowed; only people in Desk or the ticket contact.', 'GAP']] },
  '16': { title: 'Blueprint transitions cannot show widgets', env: 'Setup › Blueprints › Tickets from Mail › transition Move to On Hold › During (opened, cancelled, nothing saved)',
    panels: [{ side: 'tavi', img: RAW + 't16-during.png', w: 1440, h: 900, crop: [300, 470, 1140, 380], caption: 'TAVI: During (what the agent fills in) offers fields, a checklist and an instructional message (1); there is no widget option.', boxes: [{ b: [690, 552, 1050, 848], n: 1 }] },
      zp('16', [171, 381, 927, 517], 'Zoho Desk help, Widgets in Blueprint: widgets can be added to a transition so agents use third-party tools while moving the ticket (1).')],
    rows: [[1, 'A widget inside a transition', 'Widgets (from the Developer Space) can be shown during a transition.', 'Not available; only fields, checklist and a message.', 'GAP']] },
  '22': { title: 'No contact notification for "Receiving a reply"', env: 'Setup › Notifications › QA AO Dept A › Contact Notifications',
    panels: [{ side: 'tavi', img: RAW + 't-notif-full.png', w: 1440, h: 6400, crop: [292, 461, 1124, 862], caption: 'TAVI: the 6 contact rules (1). There is no "Receiving a reply" rule.', boxes: [{ b: [305, 540, 1080, 1232], n: 1 }] },
      zp('22', [521, 413, 926, 478], 'Zoho Desk help: contact rule "Receiving a reply: Notifies the requester of a new reply received on their ticket" (1).')],
    rows: [[1, 'Telling the contact that a reply was received on their ticket', 'Contact rule "Receiving a reply".', 'Missing from the contact rules.', 'GAP']] },
  '23': { title: 'No CC notification for "Receiving a reply"', env: 'Setup › Notifications › QA AO Dept A › CC Notifications',
    panels: [{ side: 'tavi', img: RAW + 't-notif-full.png', w: 1440, h: 6400, crop: [292, 1343, 1124, 992], caption: 'TAVI: the 7 CC rules (1). "Acknowledging a ticket reply" is there, but not "Receiving a reply".', boxes: [{ b: [305, 1425, 1080, 2245], n: 1 }] },
      zp('23', [521, 414, 926, 478], 'Zoho Desk help: CC rule "Receiving a reply: Notifies CC’d users of a new reply received on their ticket" (1), separate from the acknowledgement.')],
    rows: [[1, 'Telling CC’d users that a reply was received', 'CC rule "Receiving a reply", separate from "Acknowledging a ticket reply".', 'Missing; only the acknowledgement exists.', 'GAP']] },
  '21': { title: 'No agent notification for "Assigning a blueprint transition"', env: 'Setup › Notifications › QA AO Dept A › Agent Notifications',
    panels: [{ side: 'tavi', img: RAW + 't-notif-full.png', w: 1440, h: 6400, crop: [292, 2356, 1124, 1560], caption: 'TAVI: the 10 agent rules (1). None is about blueprint transitions.', boxes: [{ b: [305, 2440, 915, 3850], n: 1 }] },
      zp('21', [333, 418, 516, 472], 'Zoho Desk help: agent rule "Assigning a blueprint transition" (1).')],
    rows: [[1, 'Telling an agent that a blueprint transition is assigned to them', 'Agent rule "Assigning a blueprint transition".', 'Missing from the agent rules.', 'GAP']] },
  '24': { title: 'Calls, tasks and events share one notification rule each instead of separate rules', env: 'Setup › Notifications › QA AO Dept A › Agent Notifications',
    panels: [{ side: 'tavi', img: RAW + 't-notif-full.png', w: 1440, h: 6400, crop: [292, 3480, 1124, 420], caption: 'TAVI: one rule each for assigning, completing and mentioning an activity (1), covering tasks, calls and events together.', boxes: [{ b: [305, 3505, 915, 3850], n: 1 }] },
      zp('24', [328, 413, 521, 477], 'Zoho Desk help: separate agent rules for calls, tasks and events, starting with "Assigning a call" (1).')],
    rows: [[1, 'Different notifications for calls, tasks and events', 'Nine rules: assigning, completing and mentioning, each for call, task and event.', 'Three rules shared by all activity types, so a department cannot, for example, notify on tasks but not on calls.', 'GAP']] },
  '15': { title: 'Business hours that run past midnight (e.g. 10:00 PM to 1:00 AM) cannot be saved', env: 'Setup › Business Hours › New Business Hours (nothing saved)',
    panels: [{ side: 'tavi', img: RAW + 't15-bh-midnight.png', w: 1440, h: 900, crop: [415, 630, 880, 320], caption: 'TAVI: hours 22:00 to 01:00 (1) are refused with "End time must be after start time" and "Fix the operational hours before saving" (2).', boxes: [{ b: [450, 704, 702, 738], n: 1 }, { b: [425, 735, 1290, 764], n: 2 }, { b: [422, 884, 1290, 944], n: 2 }] },
      zp('15', [211, 364, 927, 527], 'Zoho Desk help, Business hours: custom hours can include a slot such as "10:00 PM to 1:00 AM" (1).')],
    rows: [[1, 'A working slot that ends after midnight', 'Allowed, e.g. "10:00 PM to 1:00 AM".', 'The form takes 22:00 to 01:00 but cannot save it.', 'GAP'], [2, 'What the user sees', 'The slot is saved.', '"End time must be after start time." The only way is to split the shift into two days by hand.', 'GAP']] },
  '25': { title: 'Agents cannot switch notifications off per department', env: 'Avatar › My Notifications (/settings/notifications/preferences)',
    panels: [{ side: 'tavi', img: RAW + 't25-prefs.png', w: 1440, h: 900, crop: [280, 55, 1150, 700], caption: 'TAVI: My Notifications has channels and per-signal choices only (1); there is no list of departments to switch off.', boxes: [{ b: [290, 60, 1430, 750], n: 1 }] },
      zp('25', [211, 181, 927, 710], 'Zoho Desk help, Feeds › Notification preferences: agents in several departments can turn off notifications from a department (1).')],
    rows: [[1, 'Turning off one department\'s notifications', 'Each agent can disable notifications from departments they rarely work in.', 'Not possible: only channels (In-app, Email, WhatsApp, SMS) and signal types can be turned off, for all departments at once.', 'GAP']] },
  '27': { title: 'Macros have no custom function action', env: 'Setup › Macros › New Macro › Add action (not saved)',
    panels: [{ side: 'tavi', img: RAW + 't27-macro-menu.png', w: 1440, h: 900, crop: [790, 420, 270, 380], caption: 'TAVI: the 9 macro actions (1). None runs a custom function or script.', boxes: [{ b: [816, 444, 1026, 778], n: 1 }] },
      zp('27', [211, 418, 927, 472], 'Zoho Desk help, Macros: "Custom Functions - Execute advanced logic or integrations using scripts" (1).')],
    rows: [[1, 'Running a custom function from a macro', 'Available as a macro action.', 'Not offered. Actions: set a field, status, priority, assign, private comment, resolution, send email, create task, move to department.', 'GAP']] },
  '28': { title: 'Macros cannot reuse saved actions', env: 'Setup › Macros › New Macro › Add action (not saved)',
    panels: [{ side: 'tavi', img: RAW + 't27-macro-menu.png', w: 1440, h: 900, crop: [790, 420, 270, 380], caption: 'TAVI: a macro\'s actions are built inline only (1). There is no "use a saved action" choice here, although workflow rules have one.', boxes: [{ b: [816, 444, 1026, 778], n: 1 }] },
      zp('28', [171, 391, 927, 500], 'Zoho Desk help, Macros: alerts, tasks, field updates and custom functions made in a macro are kept under Automation and can be reused and edited (1).')],
    rows: [[1, 'Reusing an action in several macros', 'Actions created for a macro are listed and can be picked again in other macros.', 'Each macro defines its actions inline; nothing can be picked from saved actions.', 'GAP']] },
  '30': { title: 'The Bulk Actions Log does not show macro runs', env: 'Setup › Bulk Actions Log › action filter',
    panels: [{ side: 'tavi', img: RAW + 't30-bulk-log-actions.png', w: 1440, h: 900, crop: [270, 160, 560, 240], caption: 'TAVI: the action types in the log are Mass delete, Import, Export, Recycle Bin bulk and Data backup (1). Macros are not logged.', boxes: [{ b: [290, 182, 552, 382], n: 1 }] },
      zp('30', [202, 418, 896, 473], 'Zoho Desk FAQ, macros on many tickets: the status of macro applications is checked in the action logs (1).')],
    rows: [[1, 'Seeing whether a macro applied to many tickets worked', 'Macro runs, with status and failures, are in the action logs.', 'No macro entry in the Bulk Actions Log; failures on individual tickets are not visible anywhere.', 'GAP']] },
  '31': { title: 'Supervisor rules (time-based automation) are missing', env: 'Setup › Automation menu',
    panels: [menu([40, 1335, 640, 440], [{ b: [60, 1340, 268, 1752], n: 1 }], 'TAVI: Setup › Automation has no Supervisor Rules entry (1).'),
      zp('31', [171, 395, 927, 504], 'Zoho Desk help: "time-based automation rules, also known as supervisor rules" (1).')],
    rows: [[1, 'Rules that run on a schedule against tickets that match (e.g. no reply for 2 days)', 'Supervisor Rules under Setup › Automation.', 'Not available; Automation lists Workflow Rules, Actions, SLA, Support Plans, Assignment Rules, Macros, Blueprints, AI Tagging, Ticket Archiving, Time Tracking.', 'GAP']] },
  '32': { title: 'Automation Studio is missing', env: 'Setup › Automation menu',
    panels: [menu([40, 1335, 640, 440], [{ b: [60, 1340, 268, 1752], n: 1 }], 'TAVI: no Automation Studio in Setup (1).'),
      zp('32', [171, 288, 841, 328], 'Zoho Desk help: "Automation Studio - An Overview" (1). Zoho opens it on request for Professional and Enterprise.')],
    rows: [[1, 'Building automations visually across features', 'Automation Studio (on request, Professional and Enterprise).', 'Not available.', 'GAP']] },
  '33': { title: 'Schedules (run custom actions at a time or on repeat) are missing', env: 'Setup › Automation menu',
    panels: [menu([40, 1335, 640, 440], [{ b: [60, 1340, 268, 1752], n: 1 }], 'TAVI: no Schedules entry in Setup › Automation (1).'),
      zp('33', [171, 395, 927, 504], 'Zoho Desk help: "Schedules are automated, user-defined actions that run custom actions either at a specific time or on a recurring basis" (1).')],
    rows: [[1, 'Running an action at a set time or on repeat', 'Schedules under Setup › Automation.', 'Not available.', 'GAP']] },
  '34': { title: 'No Webhooks or API pages in Setup; a webhook exists only as a workflow action', env: 'Setup › Integrations menu',
    panels: [menu([40, 2235, 640, 160], [{ b: [60, 2240, 268, 2382], n: 1 }], 'TAVI: Setup › Integrations has Custom Actions, CRM ⇄ Desk Integration and Email Providers only (1).'),
      zp('34', [171, 380, 927, 489], 'Zoho Desk help, Webhooks: webhooks send instant notifications to other apps when an event occurs (1); Zoho also has an API dashboard.')],
    rows: [[1, 'Managing webhooks and API access in one place', 'Developer Space has Webhooks (a list you can subscribe to events) and APIs.', 'No webhook list or API page; a webhook can only be added as an action inside a workflow rule.', 'GAP']] }
};
const NEW = { '06': 1, '15': 2, '16': 3, '21': 4, '22': 5, '23': 6, '24': 7, '25': 8, '27': 9, '28': 10, '30': 11, '31': 12, '32': 13, '33': 14, '34': 15 };
const only = process.argv[2] ? process.argv[2].split(',') : Object.keys(S);
for (const id of only) {
  const s = S[id]; if (!s) continue;
  const spec = { out: String(NEW[id]).padStart(2, '0') + '-' + s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50).replace(/-+$/, '') + '.png', ticket: 'Desk automation gap ' + NEW[id], title: s.title, verdict: 'FAIL', label: 'MISSING vs ZOHO', date: DATE, env: 'TAVI staging-desk.taviportal.com (NDC-Staging, owner) · ' + s.env, panels: s.panels, rows: s.rows };
  const f = path.join(RUN, 'evidence/specs/M' + id + '.json'); fs.writeFileSync(f, JSON.stringify(spec, null, 1));
  console.log(execFileSync('node', [path.join(__dirname, 'annotate-vs-zoho.js'), f], { cwd: path.join(RUN, '../..'), encoding: 'utf8' }).trim());
}
