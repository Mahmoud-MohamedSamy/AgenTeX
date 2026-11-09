// Builds report-full-run.html from the two specs plus the recorded results (8–9 Nov 2026).
const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const RUN = P + '/executions/execu_2026-11-08_desk-automation-order';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`([^`]+)`/g, '<code>$1</code>');
function rows(file, prefix) {
  const L = fs.readFileSync(file, 'utf8').split(/\r?\n/); let grp = ''; const out = [];
  for (const l of L) {
    const h = l.match(/^## (.+)/); if (h) grp = h[1];
    const m = l.match(new RegExp('^\\|\\s*(' + prefix + '-\\d+)\\s*\\|(.*)\\|\\s*$'));
    if (m) { const c = m[2].split('|').map(s => s.trim()); out.push({ id: m[1], grp, scn: c[0], exp: c[1], tag: c[2] || '' }); }
  }
  return out;
}
const sla = rows(P + '/docs/desk-sla-escalation/spec-desk-sla-escalation.md', 'SL');
const nt = rows(P + '/docs/desk-automation-execution-order/spec-desk-automation-order.md', 'NT');
const R = {}; const set = (ids, st, note) => ids.forEach(i => R[i] = [st, note || '']);
const ids = (p, a) => a.map(n => p + '-' + String(n).padStart(2, '0'));

// SLA
set(ids('SL', [1, 2, 3, 6, 8, 9, 10, 13, 14, 19, 23, 24, 26, 28, 31, 32, 33, 34, 41, 45, 47, 48, 50, 52, 56, 59, 66]), 'PASS');
R['SL-04'] = ['PASS', 'Create, Update and Field Update triggers covered.'];
R['SL-11'] = ['PASS', 'Behaviour recorded; compare with Zoho before treating it as settled.'];
R['SL-25'] = ['PASS', 'Behaviour recorded; compare with Zoho before treating it as settled.'];
R['SL-35'] = ['PASS', 'Passed on re-run after a test fix (account_name field).'];
R['SL-36'] = ['PASS', 'Accounts dialog and delete confirmation, screen and API.'];
R['SL-37'] = ['PASS', 'Partial.'];
R['SL-49'] = ['PASS', 'Audit log records SLA changes.'];
R['SL-07'] = ['PASS', 'Partial: comment scope (public, private, both) only.'];
R['SL-39'] = ['PASS', 'Partial: valid contract only.'];
R['SL-43'] = ['PASS', 'Partial: Overdue, Response Overdue and SLA Violated views exist on screen; their contents were not checked.'];
R['SL-63'] = ['PASS', 'Ticket feed shows sla.applied, breached and escalated.'];
R['SL-12'] = ['FAIL', 'Target conditions offer 9 text-style operators only; no number or date operators (less than, greater than, between, is before, is after). Missing-list item 9; annotated image built.'];
R['SL-30'] = ['FAIL', 'With Create + Update selected, updating a ticket does not restart its SLA (execution stays 1, due time unchanged). Zoho\'s SLA article says it resets on each update. Live Zoho not checked yet.'];
R['SL-17'] = ['FINDING', 'Business mode with no hours set saves through the API, and the ticket then gets no SLA at all. Not tried on screen, so it may fall under the API-only rule.'];
R['SL-21'] = ['FINDING', 'Owner notified; the contact mail arrived in Gmail (#1493). Named agents and department agents who cannot see the ticket are skipped with no_access, shown only in the ticket feed. Manager skipped with no_manager. The contact needs the ticket email field, otherwise no_address.'];
R['SL-54'] = ['FINDING', 'A "before due" level longer than the target saves (e.g. 2 h before a 30 min target). Levels out of order are refused.'];
R['SL-05'] = ['API ONLY', 'API accepts Update and Field Update together; the screen says either-or. Not a bug under the API-only rule.'];
set(ids('SL', [15, 16, 20, 53, 65]), 'BLOCKED', 'Admin gets 403 on business hours; owner needed. Owner sign-in is now allowed; not run yet.');
set(ids('SL', [18, 22, 27, 29, 38, 40, 42, 44, 46, 51, 55, 57, 58, 60, 61, 62, 64, 67]), 'NOT RUN');

// Notifications
set(ids('NT', [2, 14, 18, 27, 28, 29]), 'PASS');
R['NT-01'] = ['PASS', 'Agent role only.'];
R['NT-03'] = ['PASS', '37 rules, 19 on: contact 6, CC 7, agent 12, department 3, team 9.'];
R['NT-05'] = ['PASS', 'Rules on: comment and closed mails arrived in Gmail (#1546); added/edited/removed comment mails arrived (#1673). Rules off: nothing. Received and reply events need inbound mail, not covered.'];
R['NT-08'] = ['PASS', 'Assigned and mentioned events only.'];
R['NT-11'] = ['PASS', 'Moved ticket only.'];
R['NT-12'] = ['PASS', 'One team member checked.'];
R['NT-13'] = ['PASS', 'A private comment sends no customer mail.'];
R['NT-15'] = ['PASS', 'Template binding works; script is stripped on save; preview flags unknown placeholders. Inactive bound template sent its mail with tokens filled (#1679).'];
R['NT-20'] = ['PASS', 'Bell filters shown; the @Mentions tab opens (contents not proven).'];
R['NT-21'] = ['PASS', 'Personal preferences page; muting is respected. NDC-2389: bell Settings now opens /settings/notifications/preferences (no longer reproduces).'];
R['NT-25'] = ['PASS', 'Assignment only.'];
R['NT-04'] = ['FINDING', 'Other departments unaffected and the screen updates at once, but an agent notice still fired right after the rule was switched off; it stopped within 60 s. Exact delay not measured.'];
R['NT-07'] = ['FINDING', 'Agent addresses are refused as CC. With the +qaao alias: the "added to ticket" mail arrived (#1678), but no closed mail reached the CC.'];
R['NT-16'] = ['FINDING', 'Likely bug. With a custom template bound to "ticket closed", closing logs no mail and Gmail shows none for that ticket (made between #1673 and #1678).'];
R['NT-23'] = ['FINDING', 'Closing through the record API sends no closed mail; the close route does. Screen and bulk not tried, so API-only for now.'];
R['NT-19'] = ['BLOCKED', 'Tenant-wide switches. You said yes on 9 Nov; not run yet.'];
R['NT-22'] = ['BLOCKED', '403 for admin (needs notify:policy:manage). Owner sign-in now allowed; not run yet.'];
set(ids('NT', [6, 9, 10, 17, 24, 26, 30]), 'NOT RUN');

const cls = { PASS: 'ok', FAIL: 'bad', FINDING: 'warn', 'API ONLY': 'grey', BLOCKED: 'grey', 'NOT RUN': 'info' };
const count = a => { const c = {}; a.forEach(r => { const s = (R[r.id] || ['NOT RUN'])[0]; c[s] = (c[s] || 0) + 1; }); return c; };
const table = a => {
  let g = '', h = '';
  for (const r of a) {
    if (r.grp !== g) { g = r.grp; h += `<tr class="grp"><td colspan="4">${esc(g)}</td></tr>`; }
    const [s, n] = R[r.id] || ['NOT RUN', ''];
    h += `<tr><td><b>${r.id}</b></td><td>${esc(r.scn)}<div class="exp">Expected: ${esc(r.exp)}</div></td><td><span class="pill ${cls[s]}">${s}</span></td><td>${esc(n)}</td></tr>`;
  }
  return `<div class="tbl"><table class="rows"><tr><th>Id</th><th>Scenario</th><th>Result</th><th>Notes</th></tr>${h}</table></div>`;
};
const pills = c => ['PASS', 'FAIL', 'FINDING', 'API ONLY', 'BLOCKED', 'NOT RUN'].filter(k => c[k]).map(k => `<span class="pill ${cls[k]}">${k} ${c[k]}</span>`).join(' ');
const cs = count(sla), cn = count(nt);
const run = (c, n) => n - (c['NOT RUN'] || 0) - (c.BLOCKED || 0);
let html = fs.readFileSync(RUN + '/scripts/full-report-template.html', 'utf8');
const rep = { SLA_PILLS: pills(cs), NT_PILLS: pills(cn), SLA_TABLE: table(sla), NT_TABLE: table(nt), SLA_RUN: run(cs, sla.length), SLA_N: sla.length, NT_RUN: run(cn, nt.length), NT_N: nt.length };
for (const [k, v] of Object.entries(rep)) html = html.split('{{' + k + '}}').join(String(v));
fs.writeFileSync(RUN + '/report-full-run.html', html);
console.log('SLA', JSON.stringify(cs), 'NT', JSON.stringify(cn), 'rows', sla.length, nt.length);
