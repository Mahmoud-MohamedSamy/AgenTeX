// Results card for the 24 Nov 2026 run (used by make-plan-html.js).
const fs = require('fs'); const path = require('path');
module.exports = function (d, esc) {
  const file = path.join(__dirname, '../../../executions/execu_2026-11-24_desk-bp-regression/out/results.jsonl');
  const RES = {}; try { for (const l of fs.readFileSync(file, 'utf8').trim().split(/\r?\n/)) { const r = JSON.parse(l); RES[r.id] = r; } } catch (e) { }
  const ids = new Set(d.cases.map(c => c.id));
  const tally = {}; for (const c of d.cases) { const v = (RES[c.id] || {}).verdict || 'NOT RUN'; tally[v] = (tally[v] || 0) + 1; }
  const pick = v => d.cases.filter(c => (RES[c.id] || {}).verdict === v);
  const row = c => `<tr><td>${esc(c.id)}</td><td>${esc(c.title)}<div class="sub">${esc((RES[c.id] || {}).note || '')}</div></td></tr>`;
  const extras = Object.values(RES).filter(r => !ids.has(r.id) && !/^P4-RESTORE/.test(r.id));
  const bugs = [
    ['TU-06 / TU-12 / TU-18', 'High', 'Blueprint | A value typed in a transition form skips the field\'s own checks (text length, pick-list options, contact exists)', 'A normal ticket edit refuses 400 characters in a 255-character field, "zzz-not-an-option" in Category and a contact id that does not exist; the same values typed in a transition form are saved.'],
    ['API-07', 'Low', 'Blueprint API | A blueprint body of the wrong shape returns internal .NET type names', 'e.g. "The JSON value could not be converted to MetadataEngine.Modules.Records.Application.Blueprint.RequiredForRule. Path: $.transitions[0]…" (same class as NDC-3069, which is fixed for owner ids).'],
  ];
  const finds = [
    ['E2E-01', 'Named transition owner who cannot edit the ticket (Desk Agent, ticket owned by someone else) is not offered the step, and running it says "You are not an owner of this transition" — the real reason is missing edit access (same class as NDC-3117).'],
    ['IN-01', 'Workflow rules that set Status on a ticket in a blueprint are skipped correctly (ticket stays in its state), but the execution log says "Fired" for every run.'],
    ['TB-12', 'A transition owner listed under another department who is not an agent of that department is saved with no warning and never sees the step.'],
    ['ST-05 / ST-07', 'The API saves a per-state business-hours id and an escalation-level template id that do not exist (the designer only warns).'],
    ['CV-06 / API-01', 'The API saves a transition with no name and a 2,000-item checklist (the designer flags the name).'],
    ['TF-X1', 'Create-task after-action with an unknown assignee mode is saved and treated as "ticket owner".'],
    ['EN-13', 'A ticket created in a middle status (Escalated) enters at the start state and its status is reset to Open (Zoho enters at that status).'],
    ['TF-07 note', '{{subject}} in a custom-action input is sent as the literal text (merge tokens work in notification titles).'],
    ['UX-01 / RS-01', 'Arabic ticket: progress bar shows "Open"/"Closed" untranslated; History shows one owner change as two lines.'],
  ];
  const tbl = a => `<div class="scroll"><table><tbody>${a.join('')}</tbody></table></div>`;
  return `<section class="card" id="results">
  <h2>Results — run of 24 Nov 2026 (NDC-Staging, QA BP Reg Dept)</h2>
  <div class="stats">
    <div class="stat"><b>${d.cases.length - (tally['NOT RUN'] || 0)}</b><span>cases with a result, of ${d.cases.length}</span></div>
    <div class="stat"><b>${tally.PASS || 0}</b><span>pass</span></div>
    <div class="stat"><b>${tally.FAIL || 0}</b><span>fail</span></div>
    <div class="stat"><b>${tally.FINDING || 0}</b><span>findings</span></div>
    <div class="stat"><b>${(tally.PARTIAL || 0) + (tally.INCONCLUSIVE || 0)}</b><span>partial / inconclusive</span></div>
    <div class="stat"><b>${tally.BLOCKED || 0}</b><span>blocked</span></div>
    <div class="stat"><b>${tally['NOT RUN'] || 0}</b><span>not run</span></div>
  </div>
  <p style="margin-top:10px">API checks as owner, Agent A (Desk Agent), Agent B (Desk Admin), a Tech supervisor, a view-only member and the Anyware owner (cross-tenant, read only); screens in Edge as Agent B (the owner's browser sign-in failed again). Customer ratings sent through the ticket rating link. Business hours (Mon–Fri + holiday) and Customer Happiness (QA department only) were changed for a few minutes and restored; final diff clean. Automation saved in <code>automation/desk-blueprint-regression/</code> (runner, library, 40 check scripts).</p>
  <h3 class="h3">Plane drafts — not filed</h3>
  <div class="scroll"><table><thead><tr><th>Cases</th><th>Priority</th><th>Title</th><th>What happens</th></tr></thead><tbody>${bugs.map(([a, p, t, w]) => `<tr><td>${esc(a)}</td><td>${esc(p)}</td><td>${esc(t)}</td><td>${esc(w)}</td></tr>`).join('')}</tbody></table></div>
  <h3 class="h3">Findings to decide</h3>
  <div class="scroll"><table><tbody>${finds.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</tbody></table></div>
  <h3 class="h3">Fail</h3>${tbl(pick('FAIL').map(row))}
  <h3 class="h3">Blocked</h3>${tbl(pick('BLOCKED').map(row))}
  <h3 class="h3">Inconclusive / partial</h3>${tbl([...pick('INCONCLUSIVE'), ...pick('PARTIAL')].map(row))}
  <h3 class="h3">Not run</h3>${tbl(pick('NOT RUN').filter(c => RES[c.id]).map(row))}
  <h3 class="h3">Plane tickets re-checked</h3><p class="sub">Still fixed: ${esc(d.cases.filter(c => c.group === 'RG' && (RES[c.id] || {}).verdict === 'PASS').map(c => c.bug).join(', '))}. Fixed since last check: NDC-2537 (internal webhook URLs now refused). Not proven this run: ${esc(d.cases.filter(c => c.group === 'RG' && (RES[c.id] || {}).verdict !== 'PASS').map(c => c.bug + ' (' + ((RES[c.id] || {}).verdict || 'not run').toLowerCase() + ')').join(', '))}.</p>
  ${extras.length ? `<h3 class="h3">Extra checks (not in the case list)</h3>${tbl(extras.map(r => `<tr><td>${esc(r.id)}</td><td>${esc(r.verdict)} — ${esc(r.note)}</td></tr>`))}` : ''}
</section>`;
};
module.exports.res = function () { const file = path.join(__dirname, '../../../executions/execu_2026-11-24_desk-bp-regression/out/results.jsonl'); const RES = {}; try { for (const l of fs.readFileSync(file, 'utf8').trim().split(/\r?\n/)) { const r = JSON.parse(l); RES[r.id] = r; } } catch (e) { } return RES; };
