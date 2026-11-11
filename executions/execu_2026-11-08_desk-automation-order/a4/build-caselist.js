// Builds the A4 Workflow case list (local HTML) from the 12 Oct spec + changes found 11 Nov 2026.
const fs = require('fs'), path = require('path');
const SPEC = path.join(__dirname, '../../../docs/desk-workflow-rules/spec-desk-workflow-rules.md');
const md = fs.readFileSync(SPEC, 'utf8').split(/\r?\n/);
const groups = []; let g = null;
for (const l of md) {
  if (/^## (Group [A-Z]|E2E journeys)/.test(l)) { g = { title: l.replace(/^## /, '').replace(/`\[serial\]`/, '(serial)'), rows: [] }; groups.push(g); continue; }
  if (/^## /.test(l)) { g = null; continue; }
  if (g && /^\| *(?:[A-Z]\d+|E2E-\d) *\|/.test(l)) { const c = l.split('|').slice(1, -1).map(s => s.trim()); g.rows.push({ id: c[0], sc: c[1], exp: c[c.length - 1] || c[2], tag: '', note: '' }); }
}
const U = (id, o) => { for (const G of groups) for (const r of G.rows) if (r.id === id) Object.assign(r, o); };
const T = { u: 'Updated', r: 'Bug recheck', m: 'Moved', s: 'Skipped', b: 'Blocked', k: 'Built, see P' };
// Rows the build has overtaken
U('A1', { tag: T.u, note: 'Also the Execution History page (B-6: no menu link on 14 Oct).' });
U('A10', { tag: T.b, note: 'No second tenant. Inconclusive unless one exists.' });
U('B1', { tag: T.u, note: 'Baseline is now 50 Tickets rules, all inactive (41 "QA NDC" reference rules to keep, 1 "test workflow", 8 old QA leftovers). Active / Inactive tabs added.' });
U('B2', { tag: T.u, note: 'Add ticket-event triggers (Customer Reply, Agent Response, Comment, Private Thread, Rating) and multi-field Field Changed.' });
U('B6', { tag: T.r, note: 'NDC-2173 (looked fixed 14 Oct), recheck.' });
U('B14', { tag: T.u, note: 'Tickets is AT 50 now: check New Rule is disabled and POST #51 refused, before freeing slots.' });
U('C2', { tag: T.u, note: 'Add the Department picker (rules per department, built).' });
U('D1', { tag: T.u, note: 'Add "Ticket Event" with its 5 events; Field Changed up to 3 fields with Any / All; "also on create" switch.' });
U('D3', { tag: T.u, note: 'Up to 3 watch fields; 4th refused ("watches at most 3 fields").' });
U('D11', { tag: T.u, note: 'Score triggers: record whether offered now (scoreChange in the API).' });
U('E2', { tag: T.u, note: 'Was 21 fields; now about 82, with 19 Contact and 16 Account fields, Is Overdue, Created By and others.' });
U('E3', { tag: T.u, note: "Add \"doesn't contain\", between / not between, Current Time." });
U('F1', { tag: T.u, note: 'Was 9 types. Now also Add Comment, Send Email Reply, Add Followers, Mark as Spam, Share Ticket, Change Layout, Run Custom Action, Add / Remove / Recalculate Skills, Reassign by Skills, Update Related Record (chat and IM actions hidden without a connection).' });
U('F3', { tag: T.r, note: 'B-5 (picker offers used types). Also Z18 (several actions of one type).' });
U('F8', { tag: T.r, note: 'NDC-2204 (looked fixed 14 Oct), recheck. Add the Teams target (Z17).' });
U('F11', { tag: T.u, note: 'Recipients now include Contact, Teams and Roles; Contact needs a Desk template.' });
U('F13', { tag: T.r, note: 'B-8 (Create Record skips required fields).' });
U('G8', { tag: T.r, note: 'B-1 (500 when "kind" is not the first key) and B-2 (created_by accepted by Field Update).' });
U('H3', { tag: T.r, note: 'NDC-2205 On Edit.' });
U('H4', { tag: T.r, note: 'NDC-2205 Field Changed.' });
U('H10', { tag: T.u, note: 'Order between workflow rules stays here; order against other automations is Part B.' });
U('H16', { tag: T.m, note: 'Moves to A8 Macros / Part B (MC-03 with OR-21).' });
U('I8', { tag: T.r, note: 'B-9 (role round robin assigns nobody) and NDC-2204.' });
U('I9', { tag: T.u, note: 'Not run on 14 Oct. Needs a QA agent to suspend (invite flow as in NT-30).' });
U('I10', { tag: T.m, note: 'Moves to Part B OR-10 / OR-11 (Workflow vs Round robin).' });
for (const i of ['I11', 'I12', 'I13', 'I15', 'I16', 'I17']) U(i, { tag: T.b, note: 'Needs a webhook receiver (I11–I17, F10, O3): your OK for a public one such as webhook.site.' });
U('I14', { tag: T.b, note: 'B-4 recheck (404 shown as Cancelled). Needs the webhook receiver.' });
U('I18', { tag: T.u, note: 'Mail to the Gmail +qaao address; you confirm arrival.' });
U('I28', { tag: T.u, note: 'Now testable: Customer Happiness works in QA AO Dept A (NT-10, 11 Nov).' });
U('J5', { tag: T.u, note: 'Not run on 14 Oct. Business hours possible as owner (SL-15, 9 Nov).' });
U('J6', { tag: T.u, note: 'Not run on 14 Oct.' });
U('J7', { tag: T.r, note: 'B-7 (cancelled scheduled action has no dispatch row); J7 was inconclusive.' });
U('K2', { tag: T.r, note: 'B-3 (no Send happiness email in the library). Record which new action types can be saved.' });
U('M1', { tag: T.r, note: 'B-6 (no menu link).' });
U('M5', { tag: T.r, note: 'NDC-2205.' });
U('N1', { tag: T.u, note: 'Rule name now shown ("Workflow rule ran — Rule … · Triggered by … · Actions …"); check each action type.' });
U('O7', { tag: T.u, note: 'Arabic UI via anyware_language=ar.' });
U('O11', { tag: T.u, note: 'Read-only on the 50 rules already on the tenant.' });
U('O12', { tag: T.u, note: 'Burst of 20 tickets (Part C OR-27 does 100).' });
U('O13', { tag: T.s, note: 'Edge only on this machine.' });
U('E2E-1', { tag: T.u, note: 'Role owner assignment depends on B-9.' });
U('E2E-6', { tag: T.u, note: 'Diff against the 11 Nov baseline (wf-baseline-rules.json).' });
const built = { Z1: 'P1', Z2: 'P2', Z4: 'P5', Z5: 'P3', Z6: 'P6', Z8: 'P8', Z9: 'P9', Z10: 'P10', Z11: 'P11', Z12: 'P12', Z13: 'P13', Z14: 'P14', Z15: 'P15', Z16: 'P16', Z17: 'P17', Z19: 'P18', Z20: 'P19', Z21: 'P20', Z22: 'P21', Z23: 'P22', Z26: 'P23', Z28: 'P25' };
for (const [z, p] of Object.entries(built)) U(z, { tag: T.k, note: 'Built (NDC-2203 retest 26 Oct). Tested as ' + p + '.' });
U('Z3', { tag: 'Still missing', note: 'Fires on a forward, but no incoming / outgoing / both choice (NDC-2203 FAIL). Recheck in P4.' });
U('Z7', { tag: 'Recheck', note: 'Ticket Event takes a list of events: check whether record and ticket events mix in one rule.' });
U('Z18', { tag: 'Recheck', note: 'Still one action per type? (the NDC reference build needed 2 owner assignments per rule).' });
U('Z24', { tag: T.s, note: 'No chat tool connected (NT-26 ignored).' });
U('Z25', { tag: T.s, note: 'IM skipped (standing rule).' });
U('Z27', { tag: T.s, note: 'AI skipped (standing rule).' });
const P = { title: 'Group P — Built since 12 Oct: ticket-event triggers, new conditions and actions (serial)', rows: [
  ['P1', 'Customer Reply trigger', 'Fires on a trusted customer reply; not on an untrusted one', 'Needs an inbound reply into a department mailbox: blocked like SL-18 unless a Help Center portal reply counts (you reply in the portal)'],
  ['P2', 'Agent Response trigger', 'Fires once per agent reply', ''],
  ['P3', 'Comment trigger, public / private filter', 'Public-only rule ignores private comments', ''],
  ['P4', 'Private Thread trigger', 'Fires on a forward; incoming / outgoing / both choice (Z3)', 'NDC-2203 FAIL item'],
  ['P5', 'Happiness Rating trigger: all / good / okay / bad', 'Only the matching rating fires', 'You rate from Gmail, as in NT-10'],
  ['P6', 'Field Changed: 3 fields, Any / All, 4th refused', 'Any fires on one change; All only when all change in one save', ''],
  ['P7', 'Several events in one rule', 'Record what is allowed (Z7)', ''],
  ['P8', 'Department scope', 'Fires only in its departments', ''],
  ['P9', 'Active / Inactive tabs', 'Counts and filters right', ''],
  ['P10', 'Contact and Account conditions', 'Match only the right ticket', ''],
  ['P11', 'Execution Time: business hours, outside, holiday', 'Follows business hours and holidays', 'QA business hours with a gap (owner, as SL-15)'],
  ['P12', 'New ticket fields: Is Overdue, Created By, Team, Ticket Number, SLA flags', 'Each condition matches correctly; Is Overdue on Create recorded', ''],
  ['P13', "Operators: doesn't contain, between / not between, Current Time", 'Match only the right tickets', ''],
  ['P14', 'Add Comment, public and private', 'Comment with the right visibility, author System', ''],
  ['P15', 'Send Email Reply', 'Reply in the conversation, mail to the contact', 'You confirm arrival'],
  ['P16', 'Email to Contact, Team, Role', 'One mail per person; Contact needs a Desk template', 'You confirm arrival'],
  ['P17', 'Assign to a team, on Create and on Edit', 'Team set on both (26 Oct: Create rule ignored the team)', 'NDC-2203 FAIL item'],
  ['P18', 'Add Followers', 'Followers added', ''],
  ['P19', 'Mark as Spam', 'Ticket marked spam', ''],
  ['P20', 'Share Ticket: department and access level', 'Shared with that access', ''],
  ['P21', 'Change Layout', 'Ticket moves to the layout', 'QA layout only, Standard untouched'],
  ['P22', 'Run Custom Action', 'Published Desk custom action runs', ''],
  ['P23', 'Add / Remove / Recalculate Skills, Reassign by Skills', 'Skills change; reassign picks an online skilled agent', 'Uses the QA AS6 skills setup'],
  ['P24', 'Update Related Record (contact field)', 'Contact field updated', ''],
  ['P25', 'Ticket history names the rule for every action type', 'Rule, trigger, actions, status', ''],
  ['P26', 'Saved actions for the new types', 'Saved and reused; Used by right', '']
].map(a => ({ id: a[0], sc: a[1], exp: a[2], tag: 'New', note: a[3] })) };
const R = { title: 'Group R — Old bugs and NDC-2203 items to recheck (state only)', rows: [
  ['R1', 'B-1 record API 500 when "kind" is not the first key', 'G8'], ['R2', 'B-2 created_by accepted by Field Update', 'G8'], ['R3', 'B-3 no Send happiness email saved action', 'K2'],
  ['R4', 'B-4 webhook 404 shown as Cancelled', 'I14 (receiver needed)'], ['R5', 'B-5 picker offers used action types', 'F3'], ['R6', 'B-6 no menu link to Execution History', 'M1'],
  ['R7', 'B-7 cancelled scheduled action has no dispatch row', 'J7'], ['R8', 'B-8 Create Record skips required fields', 'F13, I25'], ['R9', 'B-9 role round robin assigns nobody', 'I8'],
  ['R10', 'NDC-2205, NDC-2204, NDC-2173 (looked fixed 14 Oct)', 'H3, H4, M5 / F8, I8 / B6'], ['R11', 'NDC-2203 FAIL items: private thread direction, team on Create rules', 'P4, P17']
].map(a => ({ id: a[0], sc: a[1], exp: 'Still fails or fixed. B-1..B-9 were never filed; a failure is filed only with your OK', tag: T.r, note: 'Run inside ' + a[2] })) };
const zi = groups.findIndex(x => /^Group Z/.test(x.title)); groups.splice(zi, 0, P, R);
let n = 0; const cnt = {}; groups.forEach(G => G.rows.forEach(r => { n++; const k = r.tag || 'Unchanged'; cnt[k] = (cnt[k] || 0) + 1; }));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/`/g, '');
const cls = { Updated: 'u', 'Bug recheck': 'r', Moved: 'm', Skipped: 's', Blocked: 'b', 'Built, see P': 'k', New: 'n', 'Still missing': 'b', Recheck: 'r' };
let h = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>A4 Workflow Cases</title><style>
:root{--bg:#fff;--fg:#1d1d1f;--mu:#666;--bd:#ddd;--hd:#f4f4f6;--u:#0b62c4;--r:#b3261e;--m:#7a5b00;--s:#777;--b:#a14a00;--k:#1e7d32;--n:#5b3cc4}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#17181a;--fg:#e8e8ea;--mu:#9a9aa0;--bd:#33353a;--hd:#202226;--u:#6aa8ff;--r:#ff8a80;--m:#e0c060;--s:#9a9aa0;--b:#ffb070;--k:#7bd389;--n:#b39dff}}
body{background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,Segoe UI,sans-serif;padding:16px;max-width:1200px;margin:auto}h1{font-size:22px}h2{font-size:16px;margin-top:28px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid var(--bd);padding:5px 7px;vertical-align:top;text-align:left}th{background:var(--hd)}.wrap{overflow-x:auto}
.t{font-size:12px;font-weight:600;white-space:nowrap}.u{color:var(--u)}.r{color:var(--r)}.m{color:var(--m)}.s{color:var(--s)}.b{color:var(--b)}.k{color:var(--k)}.n{color:var(--n)}.mu{color:var(--mu)}
</style></head><body><h1>A4 Workflow Rules: case list</h1><p class="mu">Desk automation order, Part A4 · NDC-Staging · 11 Nov 2026 · from docs/desk-workflow-rules/spec-desk-workflow-rules.md (12 Oct), updated for the current build · ${n} rows · local only, not published</p>
<p>${Object.entries(cnt).map(([k, v]) => `<span class="t ${cls[k] || ''}">${k}: ${v}</span>`).join(' · ')}</p>
<h2>Run setup</h2><ul><li>Department QA AO Dept A, prefix "QA AO WF", every rule guarded by Subject starts with "QA AO WF ".</li><li>Tickets is at the 50-rule limit. Free slots by deleting our 8 old QA rules (4 "QA AS6 WF" from 6 Nov, 4 "QA 2205" from 10 Nov). The 41 "QA NDC" rules are the kept NDC reference setup and "test workflow" is someone else's; both stay untouched.</li><li>All 50 rules are inactive, so no other rule fires on QA tickets.</li><li>Each row deletes its rule after use, so at most 8 QA rules exist at once.</li><li>Evidence only for failures, annotated against Zoho (help pages labelled "not live"; techsolutionsegypt read-only).</li></ul>`;
for (const G of groups) {
  h += `<h2>${esc(G.title)} (${G.rows.length})</h2><div class="wrap"><table><tr><th>Id</th><th>Scenario</th><th>Expected</th><th>Status</th><th>Note</th></tr>`;
  for (const r of G.rows) { const k = r.tag || 'Unchanged'; h += `<tr><td>${esc(r.id)}</td><td>${esc(r.sc)}</td><td>${esc(r.exp)}</td><td class="t ${cls[k] || 'mu'}">${k}</td><td>${esc(r.note)}</td></tr>`; }
  h += '</table></div>';
}
fs.writeFileSync(path.join(__dirname, '../a4-workflow-case-list.html'), h + '</body></html>');
console.log(n, JSON.stringify(cnt), groups.map(G => G.title.split(' ')[1] + ':' + G.rows.length).join(' '));
