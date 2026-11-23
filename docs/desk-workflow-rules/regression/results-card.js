// Builds the results card for runs 1 + 2 (required by make-plan-html.js).
module.exports = function (d, RES, esc) {
  const tally = {}; for (const c of d.cases) { const v = (RES[c.id] || {}).verdict || 'NOT RUN'; tally[v] = (tally[v] || 0) + 1; }
  const order = Object.fromEntries(d.cases.map((c, i) => [c.id, i]));
  const pick = v => Object.values(RES).filter(r => r.verdict === v && order[r.id] !== undefined).sort((a, b) => order[a.id] - order[b.id]);
  const row = r => `<tr><td>${esc(r.id)}</td><td>${esc(r.note)}</td></tr>`;
  const fixed = [
    ['AT-06', 'Add followers on an On Create rule — now adds the follower (run 1 FAIL)'],
    ['OB-03', 'Execution History filter by record id — now returns the rows (run 1 finding)'],
    ['OB-05', '"No match" runs are now logged and shown (run 1 finding)'],
    ['OB-06', 'Ticket history now lists each field a rule changed (run 1 finding)'],
    ['TC-04', 'Date-Time rule conditions are now read at fire time and after edits — fixed on the 23 Nov retest (8/8 tickets; failed in run 2)'],
    ['AC-07', 'Role round robin works with Desk roles — corrected 23 Nov (the earlier fail used the CRM role list)'],
    ['RG-07', 'October B-1…B-9 all fixed or working (B-5 n/a)'],
  ].map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('');
  const shared = [
    ['Business hours (tenant)', '24/7 → custom 01:00–23:00 for ~3 min at 23:19 Cairo, then back to 24/7 (verified)'],
    ['Holiday list for today on the default profile', 'created for ~3 min, then deleted'],
    ['Customer Happiness', 'ON for QA AO Dept B only for ~2 min, restored (diff [])'],
    ['Direct assignment switch', 'ON for ~25 s for IN-01, restored OFF (verified)'],
    ['Owner account UI language', 'switched to Arabic for UX-03, back to English (verified)'],
  ].map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('');
  let clean = 'Cleanup of run 2 in progress.'; try { const c = require('../../../executions/execu_2026-11-22_desk-wf-regression/out/cleanup2.json'); clean = `Run 2 cleanup: rules ${c.rules.ok}/${c.rules.of}, tickets ${c.tickets.ok + c.tickets.gone}/${c.tickets.of}, contacts ${c.contacts.ok}/${c.contacts.of}, tasks ${c.tasks.ok}/${c.tasks.of}, team, skills, assignment rules, macro, blueprint, tags removed; ${c.binPurged} Recycle Bin items purged. Left: ${c.verify.qaRulesLeft} QA rules, ${c.verify.binLeft} bin items; business hours ${c.verify.hours}, happiness ${c.verify.happinessOn ? 'ON' : 'OFF'}, direct switch ${c.verify.directSwitch ? 'ON' : 'OFF'}.`; } catch (e) { }
  let drafts = ''; try { const D = require('./bug-drafts.js'); const recTxt = { file: 'Ready to file', check: 'Check one thing first', decide: 'Your decision / Zoho check' }; const li = a => '<ol>' + a.map(x => `<li>${esc(x)}</li>`).join('') + '</ol>';
    drafts = `<h3 style="margin-top:12px">Plane drafts — ${D.length} (not filed)</h3><p class="sub">Titles follow "Feature | Descriptive Bug Title". Priority is a suggestion.</p>` + D.map(b => `<details style="margin:6px 0;border:1px solid #ddd;border-radius:8px;padding:6px 10px"><summary><b>${esc(b.id)}${b.also ? ' + ' + esc(b.also) : ''}</b> · ${esc(b.kind)} · ${esc(b.pri)} · <i>${esc(recTxt[b.rec] || b.rec)}</i> — ${esc(b.title)}</summary><p><b>Steps</b></p>${li(b.steps)}<p><b>Expected:</b> ${esc(b.expected)}</p><p><b>Actual:</b> ${esc(b.actual)}</p>${b.check ? `<p><b>Before filing:</b> ${esc(b.check)}</p>` : ''}<p class="sub">Environment: NDC-Staging, Desk → Tickets. ${esc(b.evidence)}</p></details>`).join(''); } catch (e) { drafts = '<p>drafts error ' + esc(e.message) + '</p>'; }
  return `<section class="card">
  <h2>Results — run 1 (22 Nov) + run 2 (22–23 Nov) + fail retest (23 Nov 2026), NDC-Staging, API + browser</h2>
  <div class="stats">
    <div class="stat"><b>${d.cases.length - (tally['NOT RUN'] || 0)}</b><span>cases with a result, of ${d.cases.length}</span></div>
    <div class="stat"><b>${tally.PASS || 0}</b><span>pass</span></div>
    <div class="stat"><b>${tally.FAIL || 0}</b><span>fail (bug candidates)</span></div>
    <div class="stat"><b>${tally.FINDING || 0}</b><span>findings to decide</span></div>
    <div class="stat"><b>${(tally.PARTIAL || 0) + (tally.INCONCLUSIVE || 0)}</b><span>partial / inconclusive</span></div>
    <div class="stat"><b>${tally.BLOCKED || 0}</b><span>blocked</span></div>
    <div class="stat"><b>${tally['N/A'] || 0}</b><span>not applicable</span></div>
  </div>
  <p style="margin-top:10px">All cases ran through the API on QA departments (QA RT19 WF Dept, QA AO Dept B) with the guard <code>Subject starts with "QA WF "</code>, plus browser passes for the list, editor, settings, Arabic, permissions (as a Desk Agent) and Execution History. Customer ratings were given through the ticket's rating link (acting as the customer). Zoho was not checked live: "Check Zoho" items are recorded as behaviour. ${esc(clean)}</p>
  <h3 style="margin-top:12px">Fail (all retested 23 Nov)</h3><div class="scroll"><table class="res"><tbody>${pick('FAIL').map(row).join('')}</tbody></table></div>
  <h3 style="margin-top:12px">Findings</h3><div class="scroll"><table class="res"><tbody>${pick('FINDING').map(row).join('')}</tbody></table></div>
  <h3 style="margin-top:12px">Fixed since run 1 / since October</h3><div class="scroll"><table><tbody>${fixed}</tbody></table></div>
  <h3 style="margin-top:12px">Partial / inconclusive</h3><div class="scroll"><table class="res"><tbody>${[...pick('PARTIAL'), ...pick('INCONCLUSIVE')].map(row).join('')}</tbody></table></div>
  <h3 style="margin-top:12px">Blocked (needs you or a connection)</h3><div class="scroll"><table class="res"><tbody>${pick('BLOCKED').map(row).join('')}</tbody></table></div>
  <h3 style="margin-top:12px">Shared settings changed for the tests (all restored)</h3><div class="scroll"><table><tbody>${shared}</tbody></table></div>
  ${drafts}
  <p class="sub" style="margin-top:8px">Nothing is filed in Plane. Filter by result in the bar above to see each case with its note.</p>
</section>`;
};
