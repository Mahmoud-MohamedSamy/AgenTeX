// Builds docs/desk-blueprint/desk-blueprint-missing-list.html (self-contained, screenshots embedded as base64).
const fs = require('fs');
const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/desk-blueprint';
const img = f => 'data:image/png;base64,' + fs.readFileSync(`${D}/reference/screens/${f}`).toString('base64');
const W = 1600, H = 1000;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Figures: boxes in screenshot pixels [x1,y1,x2,y2,label,kind] kind: gap|bug|ok|ref (ref = Zoho has it)
// Each figure: TAVI side (file/boxes) and optional Zoho side (zoho: {file, title, boxes}) or zohoNote.
const FIG = {
  A: { file: 'tavi-06-designer-new.png', title: 'New blueprint — Blueprint details', boxes: [[1304, 118, 1598, 715, 'Gaps 1, 2: no Strict Mode and no "change owners in the ticket" setting', 'gap']],
    zoho: { file: 'zoho-create-blueprint.png', title: 'Zoho — Create Blueprint, Advanced Configuration', boxes: [
      [282, 463, 951, 573, 'Strict Mode: restrict editing, replies, comments, approvals, resolutions and attachments outside transitions', 'ref'],
      [282, 580, 951, 703, 'Dynamic Transition Owner Assignment: admins assign owners inside a ticket', 'ref'],
      [282, 710, 951, 818, 'Continuous Blueprint: Desk has this too', 'ok']] } },
  G: { file: 'tavi-13-dashboards.png', title: 'Analytics → Popular Dashboards', boxes: [[276, 252, 1584, 446, 'Gap 14: Ticket Status, SLA, Overview, Customer Happiness — no Blueprint dashboard', 'gap']],
    zoho: { file: 'zoho-dashboard-list.png', title: 'Zoho — Popular Dashboards', boxes: [[111, 203, 351, 228, 'Blueprint Dashboard', 'ref']] } },
  H: { title: 'Blueprint dashboard contents', tavi: false, taviNote: 'No blueprint dashboard or report exists in Desk; /blueprints/reports, /{id}/stats, /desk/blueprints/dashboard return 404.',
    zoho: { file: 'zoho-blueprint-dashboard.png', title: 'Zoho — Blueprint Dashboard', boxes: [
      [80, 158, 1576, 258, 'Active Blueprint Tickets, SLA Violated Tickets, All Transitions', 'ref'],
      [80, 268, 1576, 708, 'Blueprint Records: active and completed', 'ref'],
      [80, 718, 1576, 968, 'SLA Violated States and Violated vs Adherence', 'ref'],
      [100, 108, 334, 137, 'Filters: blueprint and period', 'ref']] } },
  J: { title: 'Saving a half-done transition as a draft (agent side)', tavi: false, taviNote: 'Desk has no transition draft. Closing the transition form loses what was typed: "The reply and notes were not saved. Leave without saving them?" (string from the Desk build).',
    zoho: [
      { file: 'zoho-transition-form-save-draft.png', title: 'Zoho — transition form on the ticket', boxes: [[1070, 930, 1169, 964, 'Gap 8: Save draft next to Complete Transition', 'ref']] },
      { file: 'zoho-transition-draft-saved.png', title: 'Zoho — after Save draft', boxes: [[1070, 930, 1218, 964, 'Draft kept: "Saved 04:40 PM" (menu holds discard)', 'ref']] },
      { file: 'zoho-ticket-draft-marker.png', title: 'Zoho — ticket after closing the form', boxes: [[893, 936, 977, 970, 'The transition button shows a draft marker', 'ref']] }] },
  I: { title: 'Profile permission to revoke a blueprint', tavi: false, taviNote: 'Desk has one permission for everything blueprint: desk:blueprints:manage ("Manage blueprints"). There is no separate revoke permission.',
    zoho: { file: 'zoho-profile-revoke.png', title: 'Zoho — Setup → Profiles → Agent', boxes: [[590, 497, 885, 553, 'Revoke Blueprint: its own permission', 'ref']] } },
  B: { file: 'tavi-04-designer-transition.png', title: 'Transition panel — Before / During / After', zoho: [
    { file: 'zoho-during-actions.png', title: 'Zoho — During → Add Operations → Actions', boxes: [[1160, 445, 1366, 475, 'Gap 5: Submit For Approval', 'ref'], [1160, 515, 1366, 545, 'Gap 6: Share Ticket', 'ref'], [1160, 338, 1366, 438, 'Reply All, Comment, Attach file(s): Desk has these', 'ok']] },
    { file: 'zoho-during-operations.png', title: 'Zoho — During → Add Operations', boxes: [[1146, 408, 1366, 440, 'Gap 7: Extensions (widgets)', 'ref'], [1146, 300, 1366, 405, 'Actions, Fields, Message: Desk has these', 'ok']] },
    { file: 'zoho-field-validation.png', title: 'Zoho — Validation on a During field', boxes: [[404, 166, 1192, 284, 'Gap 4: condition + "Show an alert message when above condition fails"', 'ref']] },
    { file: 'zoho-custom-mandatory.png', title: 'Zoho — Mandatory settings of the During items', boxes: [[1360, 292, 1576, 420, 'Gap 9: All / Not / Custom Mandatory (per agent group)', 'ref']] },
    { file: 'zoho-transition-before.png', title: 'Zoho — Before tab', boxes: [[1146, 265, 1576, 382, 'Owners: agents, teams, record owner — Desk has these', 'ok'], [1146, 405, 1576, 515, 'Owner from another department — Desk has this', 'ok'], [1146, 550, 1576, 610, 'Criteria — Desk has this', 'ok']] },
    { file: 'zoho-transition-after.png', title: 'Zoho — After tab', boxes: [[1146, 308, 1582, 524, 'Alerts, Field updates, Tasks, Custom functions — Desk has all four (plus webhook and notification)', 'ok']] }], boxes: [
    [302, 600, 732, 760, 'Gap 2: owners are fixed here', 'gap'],
    [738, 600, 1164, 945, 'Gaps 4–9: During has no field check, approval, share, widget or per-group rules', 'gap'],
    [1170, 600, 1598, 830, 'Built: 6 after-actions', 'ok']] },
  C: { file: 'tavi-03-state-onhold.png', title: 'State panel — On Hold of "Demo · Refund approval"', zoho: [
    { file: 'zoho-state-sla-escalation.png', title: 'Zoho — State Level SLA with Level 1 escalation', boxes: [[1146, 262, 1440, 302, 'Time in Minutes / Hours and a clock', 'ref'], [1146, 338, 1576, 700, 'Gap 11: escalation levels — when (Before / On Time / After), whom to notify, email template', 'ref']] },
    { file: 'zoho-state-sla-clock.png', title: 'Zoho — clock choice of the state SLA', boxes: [[1316, 298, 1440, 336, 'Gap 12: business-hours sets are listed here; this trial has none, so only Calendar Hours shows', 'ref']] },
    { file: 'zoho-auto-transition-rating.png', title: 'Zoho — Auto Transition on a transition', boxes: [[1146, 445, 1396, 688, 'Gap 10: on replies (All Threads) or ratings — All / Good / Bad', 'ref']] },
    { file: 'zoho-transition-order.png', title: 'Zoho — State Level Transitions', boxes: [[1146, 160, 1578, 240, 'Gap 3: drag and drop to reorder the transitions shown in tickets', 'ref']] }], boxes: [
    [1248, 240, 1598, 392, 'Gaps 11, 12: one warning + one limit; clock is only Business / Calendar', 'gap'],
    [1248, 404, 1598, 550, 'Gap 10: replies / rates fire on any reply or rating', 'gap'],
    [1118, 318, 1242, 364, 'Possible bug: canvas shows a 3-day timer…', 'bug'],
    [1256, 288, 1418, 324, '…but the panel says "No limit"', 'bug']] },
  D: { file: 'tavi-07-ticket-805.png', title: 'Ticket inside a blueprint', zoho: [
    { file: 'zoho-ticket-in-blueprint.png', title: 'Zoho — ticket #101 inside a blueprint', boxes: [[652, 918, 1600, 970, 'Blueprint strip: current state and transition buttons — Desk shows this as the Steps card', 'ok'], [356, 422, 432, 466, 'Status locked — Desk does this too', 'ok']] },
    { file: 'zoho-ticket-revoke-menu.png', title: 'Zoho — ticket More Actions', boxes: [[1322, 392, 1522, 422, 'Revoke Blueprint on the ticket — Desk has this too', 'ok']] }], boxes: [
    [372, 320, 656, 596, 'Built: Steps card. Gap 2: no way to change who runs the next step', 'gap'],
    [1448, 954, 1586, 992, 'Possible bug: "Close ticket" shown on a ticket in a blueprint', 'bug']] },
  E: { file: 'tavi-09-ticket-list.png', title: 'Ticket list and views', boxes: [
    [12, 200, 252, 645, 'Gap 13: no blueprint views (Active Blueprint Tickets, My Transitions…)', 'gap']],
    zoho: { file: 'zoho-blueprint-views.png', title: 'Zoho — ticket views list', boxes: [[124, 348, 350, 537, 'BLUEPRINT VIEWS: Active Blueprint Tickets, All / My Team / My / Unassigned Transitions', 'ref']] } },
  F: { file: 'tavi-05-designer-test.png', title: 'Test Blueprint — states palette', zohoNote: 'See Figure A for Zoho’s Strict Mode setting.', boxes: [
    [72, 386, 292, 412, 'Possible bug: "Reopened" has the type Closed', 'bug'],
    [1304, 118, 1598, 410, 'Gap 1: no Strict Mode in the details', 'gap']] },
};

const GROUPS = [
  ['Blueprint settings', [
    [1, 'Strict Mode', 'Agents can act on the ticket and edit fields only through transitions, with three choices: lock all actions, lock only selected actions, or lock all except selected.', 'Only Status is locked, and a reply cannot close the ticket.', 'Enterprise', ['A', 'F']],
    [2, 'Change transition owners from inside a ticket', 'An admin or owner picks who runs the next transition, also from another department (Zoho "Dynamic Transition Owner Assignment").', 'Owners are fixed in the blueprint.', '', ['A', 'B', 'D']],
    [3, 'Order of the transition buttons for each state', 'The admin drags the buttons into the order agents see.', 'No order setting in the designer.', '', ['C']]]],
  ['During a transition', [
    [4, 'Field check with your own error message', 'For example "Refund amount must be more than 0".', 'A field can only be required. The CRM designer has "validations"; Desk turns it off, and fieldValidations is always empty in the API.', '', ['B']],
    [5, 'Submit for approval', 'Approval as a step inside the transition.', 'Not offered.', '', ['B']],
    [6, 'Share the ticket as a step', 'The agent picks a department and access level while running the transition.', 'Sharing happens only automatically, when an owner is in another department.', '', ['B']],
    [7, 'Widgets in the transition form', 'Extensions inside the form.', 'Not offered.', '', ['B']],
    [8, 'Save a half-done transition as a draft', 'Finish it later with the typed values kept.', 'Closing the form loses the text: "The reply and notes were not saved. Leave without saving them?"', '', ['J']],
    [9, 'Different required items per agent group', 'Zoho "Configure Mandatory".', 'One set of required items for everyone.', '', ['B']]]],
  ['Automatic transitions', [
    [10, 'Run on certain ratings or replies only', 'Good / Okay / Bad rating only; public or private reply only.', '"When the customer rates / replies, run" fires on any rating or reply.', '', ['C']]]],
  ['State time limits (SLA tie-in)', [
    [11, 'Several escalation levels per state', 'Level 1…n, each at its own time before or after the due time, with its own people and email.', 'One warning and one set of actions when the limit runs out.', 'Professional', ['C']],
    [12, 'Business-hours set (and holidays) per state', 'Pick which business-hours set the state counts in.', 'Only "Business hours" or "Calendar time", although Desk can have several business-hours sets.', '', ['C']]]],
  ['Where agents see results', [
    [13, 'Blueprint views in the ticket list', 'Active Blueprint Tickets, All Transitions, My Transitions, My Team Transitions, Unassigned Transitions.', 'None, and no blueprint or state column or filter in the list.', '', ['E']],
    [14, 'Blueprint dashboard', 'Active / completed tickets, tickets and states over time, met vs missed %, average time per blueprint and state, transition counts; filters by blueprint, period, agent.', 'No blueprint report. /blueprints/reports, /{id}/stats, /desk/blueprints/dashboard and /desk/blueprints/reports return 404.', 'Enterprise', ['G', 'H']]]],
  ['Permissions', [
    [15, 'Separate "Revoke blueprint" permission', 'A profile permission just for revoking.', 'One permission, desk:blueprints:manage, covers designing, including and revoking.', '', ['I']]]],
];

const BUGS = [
  ['On Hold auto-close hidden', 'The On Hold state of "Demo · Refund approval" closes tickets after 3 days (autoTransitionAfterMinutes 4320, canvas shows "3d"), but the panel shows "No limit" and hides the auto-close. Saving the state may drop it.', 'C'],
  ['Fixed week in the example text', 'The time-limit example always says "Counted on a Monday to Friday, 9 to 5 week", although this tenant\'s business hours are 24×7.', ''],
  ['"Reopened" has the type Closed', 'A blueprint state "Reopened" may end the blueprint or count as resolved.', 'F'],
  ['"Close ticket" on a ticket in a blueprint', 'Ticket #805 is inside a blueprint and still shows the Close ticket button.', 'D'],
];

const BUILT = ['Blueprints page grouped by department: layout, states, Draft badge, tickets in progress; activate, include, revoke, delete (refused while tickets are inside); drag to order.',
  'One department and one layout per blueprint; entry criteria or all tickets.',
  'States are ticket statuses; Add State creates one. 16 connections per state (same as Zoho). Common transitions. Continuous blueprints.',
  'Save Draft, Save and Publish, problem list before publishing, version history with restore.',
  'Before: agents, teams, ticket owner, another department with Full / Read only / Restricted access; criteria.',
  'During: reply, comment, attachment, resolution, required fields, checklist, message — ordered, each required or optional.',
  'After: field update, notification, task, webhook, Desk email, custom action.',
  'State time limit with warning, business / calendar clock, actions at warning and at expiry, auto-move when time runs out; moves on customer reply or rating.',
  'Ticket: blueprint pill, progress bar, Steps card (time in state, due, overdue, next steps); Status locked; reply does not close.',
  'Revoke one, a list, or all tickets; full ticket history of blueprint events.',
  'Desk extras Zoho lacks: include existing tickets at a chosen state, versions, parallel steps, webhook / notification / custom action steps, actions at the warning, auto-move on timer.'];

const CHECK = [
  ['Business hours vs calendar', 'The only business-hours set is 24×7 and both holiday lists are empty. Please add a QA set (e.g. Sun–Thu 09:00–17:00 with one holiday) or allow us to, so we can test state time limits in business hours.'],
  ['SLA pause in an On Hold state', 'Needs transitions run on QA tickets. Please approve the functional run (spec groups H–J) so we can test whether the department SLA and the state timer pause.'],
  ['Transitions on IM tickets', 'No IM channel seen. Please tell us if WhatsApp or Telegram is connected to a department.']];

const side = (who, file, title, boxes) => `<div class="side"><div class="who ${who}">${who === 'tavi' ? 'TAVI Desk' : 'Zoho Desk'}</div>
  <div class="shot"><img src="${img(file)}" alt="${esc(title)}" loading="lazy">
  ${boxes.map((b, i) => `<div class="box ${b[5]}" style="left:${b[0] / W * 100}%;top:${b[1] / H * 100}%;width:${(b[2] - b[0]) / W * 100}%;height:${(b[3] - b[1]) / H * 100}%"><span>${i + 1}</span></div>`).join('')}</div>
  <div class="cap"><b>${esc(title)}</b><ol>${boxes.map(b => `<li class="${b[5]}">${esc(b[4])}</li>`).join('')}</ol></div></div>`;
const note = (who, text) => `<div class="side"><div class="who ${who}">${who === 'tavi' ? 'TAVI Desk' : 'Zoho Desk'}</div><div class="nonote">${esc(text)}</div></div>`;
const fig = k => { const f = FIG[k];
  const left = f.tavi === false ? note('tavi', f.taviNote) : side('tavi', f.file, f.title, f.boxes);
  const right = f.zoho ? '<div class="stack">' + [].concat(f.zoho).map(z => side('zoho', z.file, z.title, z.boxes)).join('') + '</div>' : note('zoho', f.zohoNote || 'No Zoho screen for this one.');
  return `<figure class="fig" id="fig-${k}"><figcaption class="figt"><b>Figure ${k}.</b> ${esc(f.title)}</figcaption><div class="pair">${left}${right}</div></figure>`; };

const gapCard = g => `<article class="gap" id="gap-${g[0]}"><div class="num">${g[0]}</div><div>
  <h3>${esc(g[1])}${g[4] ? ` <span class="ed">Zoho ${g[4]}</span>` : ''}</h3>
  <p><span class="lbl z">Zoho</span>${esc(g[2])}</p><p><span class="lbl t">Desk today</span>${esc(g[3])}</p>
  ${g[5].length ? `<p class="see">See ${g[5].map(k => `<a href="#fig-${k}">Figure ${k}</a>`).join(', ')}</p>` : '<p class="see">No screen to show (API / permission level)</p>'}</div></article>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Desk Blueprint Gaps</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2330;--mute:#5d6676;--line:#e3e6eb;--gap:#d9332b;--bug:#c77700;--ok:#1e8e4e;--acc:#2a5bd7;--chip:#eef2fb}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#12151b;--card:#1b1f27;--ink:#e6e9ef;--mute:#9aa3b2;--line:#2c323d;--chip:#232a38;--acc:#7ea2ff}}
:root[data-theme=dark]{--bg:#12151b;--card:#1b1f27;--ink:#e6e9ef;--mute:#9aa3b2;--line:#2c323d;--chip:#232a38;--acc:#7ea2ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Segoe UI",system-ui,sans-serif}
main{max-width:1180px;margin:0 auto;padding:28px 16px 60px}h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:36px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}
h3{font-size:16px;margin:0 0 6px}.sub{color:var(--mute);margin:0 0 18px}a{color:var(--acc)}
.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:16px 0}.meta div{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 12px}.meta b{display:block;font-size:12px;color:var(--mute);font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.stats{display:flex;gap:10px;flex-wrap:wrap;margin:6px 0 10px}.stat{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 16px;min-width:130px}.stat strong{font-size:24px;display:block}.stat.g strong{color:var(--gap)}.stat.b strong{color:var(--bug)}.stat.o strong{color:var(--ok)}
.gap{display:flex;gap:14px;background:var(--card);border:1px solid var(--line);border-left:4px solid var(--gap);border-radius:8px;padding:14px 16px;margin:10px 0}
.num{flex:none;width:32px;height:32px;border-radius:50%;background:var(--gap);color:#fff;font-weight:700;display:grid;place-items:center}
.gap p{margin:4px 0}.lbl{display:inline-block;font-size:11px;font-weight:700;padding:1px 7px;border-radius:4px;margin-right:8px;background:var(--chip)}.lbl.z{color:var(--acc)}.lbl.t{color:var(--gap)}
.ed{font-size:11px;font-weight:600;color:var(--mute);background:var(--chip);padding:2px 7px;border-radius:4px;vertical-align:middle}.see{font-size:13px;color:var(--mute)}
.fig{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px;margin:16px 0}.shot{position:relative;line-height:0}.shot img{width:100%;height:auto;border-radius:4px;border:1px solid var(--line)}
.box{position:absolute;border:3px solid var(--gap);border-radius:4px;background:rgba(217,51,43,.06)}.box.bug{border-color:var(--bug);background:rgba(199,119,0,.07)}.box.ok{border-color:var(--ok);background:rgba(30,142,78,.06);border-style:dashed}
.box span{position:absolute;top:-12px;left:-12px;width:24px;height:24px;border-radius:50%;background:var(--gap);color:#fff;font:700 13px/24px "Segoe UI",sans-serif;text-align:center}.box.bug span{background:var(--bug)}.box.ok span{background:var(--ok)}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media (max-width:900px){.pair{grid-template-columns:1fr}}
.who{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin:0 0 6px;padding:3px 8px;border-radius:4px;display:inline-block}.who.tavi{background:#e8eefc;color:#2a5bd7}.who.zoho{background:#e7f5ec;color:#1e7d46}
.stack{display:flex;flex-direction:column;gap:18px}.figt{font-size:15px;margin:0 0 10px}.cap{margin-top:8px;font-size:13px}.cap ol{margin:4px 0 0;padding-left:20px}
.nonote{border:1px dashed var(--line);border-radius:6px;padding:18px;color:var(--mute);font-size:14px;min-height:120px;display:flex;align-items:center}
.box.ref{border-color:var(--ok);background:rgba(30,142,78,.07)}.box.ref span{background:var(--ok)}li.ref::marker{color:var(--ok)}li.ref{display:list-item;border:0;padding:0;margin:2px 0;background:none}
figcaption ol{margin:6px 0 0;padding-left:22px}
.shot{cursor:zoom-in}#lb{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:9;padding:16px;cursor:zoom-out}#lb.on{display:flex}#lb .shot{max-width:96vw;width:96vw;cursor:zoom-out}
li.gap,li.bug,li.ok{display:list-item;border:0;padding:0;margin:2px 0;background:none}li.bug::marker{color:var(--bug)}li.ok::marker{color:var(--ok)}li.gap::marker{color:var(--gap)}
.bugc{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--bug);border-radius:8px;padding:12px 16px;margin:10px 0}
ul.list{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px 16px 12px 34px}ul.list li{margin:4px 0}
.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--mute)}.legend i{display:inline-block;width:14px;height:10px;border:3px solid;border-radius:3px;margin-right:6px;vertical-align:-1px}
@media (max-width:640px){.gap{flex-direction:column}.box span{display:none}}
@media print{.fig{break-inside:avoid}}
</style></head><body><main>
<h1>Blueprint (with SLA tie-in) — what Zoho Desk has that TAVI Desk is missing</h1>
<p class="sub">Draft for review · 1 November 2026 · nothing filed in Plane, nothing changed on the tenant</p>
<div class="meta">
<div><b>App</b>TAVI Desk — staging-desk.taviportal.com, org Anyware, owner account</div>
<div><b>Reference</b>Zoho Desk live (Enterprise trial, org techsolutionsegypt, read only) + help and API docs</div>
<div><b>PRD</b>NDC-1974 — two lines, no requirements</div>
<div><b>Already in Plane</b>NDC-2266 SLA gaps (not repeated)</div></div>
<div class="stats"><div class="stat g"><strong>15</strong>gaps</div><div class="stat b"><strong>4</strong>possible bugs</div><div class="stat o"><strong>11</strong>built areas</div><div class="stat"><strong>3</strong>could not be checked</div></div>
<div class="legend"><span><i style="border-color:var(--gap)"></i>Gap</span><span><i style="border-color:var(--bug)"></i>Possible bug</span><span><i style="border-color:var(--ok);border-style:dashed"></i>Built in Desk</span><span><i style="border-color:var(--ok)"></i>Zoho has it</span></div>

<h2>Missing in TAVI Desk</h2>
${GROUPS.map(([g, items]) => `<h3 style="margin-top:22px;color:var(--mute);text-transform:uppercase;font-size:13px;letter-spacing:.05em">${esc(g)}</h3>${items.map(gapCard).join('')}`).join('')}

<h2>Screenshots</h2>
<p class="sub">TAVI Desk on the left, Zoho Desk on the right, both captured read-only on 1 Nov 2026. Numbered boxes match the list under each picture. Click a picture to enlarge it; click again or press Esc to close.</p>
${['A','B','C','D','J','E','F','G','H','I'].map(k => fig(k)).join('')}

<h2>Possible bugs to check separately</h2>
${BUGS.map(b => `<div class="bugc"><h3>${esc(b[0])}</h3><p style="margin:0">${esc(b[1])}${b[2] ? ` <a href="#fig-${b[2]}">Figure ${b[2]}</a>` : ''}</p></div>`).join('')}

<h2>Already done in TAVI Desk</h2>
<ul class="list">${BUILT.map(b => `<li>${esc(b)}</li>`).join('')}</ul>

<h2>Could not be checked</h2>
<ul class="list">${CHECK.map(c => `<li><b>${esc(c[0])}:</b> ${esc(c[1])}</li>`).join('')}</ul>

<h2>Notes</h2>
<ul class="list">
<li>Not gaps: clone (Zoho has none), roles as owners (Zoho has none), department change as an action (Zoho has none), Zoho edition limits.</li>
<li>Same engine as CRM: NDC-2540, NDC-2420 and NDC-2730 are re-checked on Desk in the spec.</li>
<li>Zoho screens for gaps 3–12 were taken from a throwaway Zoho blueprint ("QA BP throwaway delete") built in the trial org and closed with Discard Changes — it was never saved; Zoho's blueprint list still shows only "Default Blueprint".</li>
<li>For gap 8 a second Zoho blueprint ("QA BP gap8 delete", Open → Closed, mandatory comment) was saved and activated and one ticket (#101 "QA BP gap8 ticket delete", contact Lawrence) was created. Afterwards the ticket was deleted and the blueprint deleted; Zoho's blueprint list shows only "Default Blueprint" again. Ticket #101 still sits in Zoho's Recycle Bin (Zoho erases it after 60 days).</li>
<li>Test spec: docs/desk-blueprint/spec-desk-blueprint.md (Group Z rows Z1–Z15 = gaps 1–15).</li>
</ul>
<p class="sub" style="margin-top:24px">Environment: staging-desk.taviportal.com, org Anyware, Edge, 1 November 2026, owner account.</p>
</main><div id="lb" role="dialog" aria-label="Enlarged screenshot"></div><script>
(function(){var lb=document.getElementById('lb');document.addEventListener('click',function(e){var sh=e.target.closest('.shot');
if(lb.classList.contains('on')){lb.classList.remove('on');lb.innerHTML='';return;}
if(sh){var c=sh.cloneNode(true);lb.appendChild(c);lb.classList.add('on');}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){lb.classList.remove('on');lb.innerHTML='';}});})();</script></body></html>`;
fs.writeFileSync(`${D}/desk-blueprint-missing-list.html`, html);
console.log('written', (html.length / 1024).toFixed(0) + ' KB');
