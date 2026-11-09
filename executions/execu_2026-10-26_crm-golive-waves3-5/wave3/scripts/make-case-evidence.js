// Builds annotated evidence for every failed Wave 3 case (approved TAVI-vs-Zoho layout), a skipped-cases card and
// after/case-list.json. Facts come only from the logged results (after/failed-raw.json, after/skipped-raw.json,
// w3retest run 2/3 logs) and the classification in results.md. Usage: node make-case-evidence.js
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const W3 = path.join(P, 'executions/execu_2026-10-26_crm-golive-waves3-5/wave3');
const RAW = path.join(W3, 'evidence/raw'), ANN = path.join(W3, 'evidence/annotated'), SPECS = path.join(W3, 'scripts/specs');
const failed = JSON.parse(fs.readFileSync(path.join(W3, 'after/failed-raw.json'), 'utf8'));
const skipped = JSON.parse(fs.readFileSync(path.join(W3, 'after/skipped-raw.json'), 'utf8'));
const ENV = 'staging-crm.taviportal.com (CRM Admin A / B, Supervisor, test user 2; API) vs Zoho CRM org943261092 (read-only)';
const ZBOX = [250, 60, 1590, 940];

// class -> header label, header colour key, row pill
const CLS = {
  ticket: ['STILL FAILS', 'FAIL', 'FAIL', 'Ticket still failing'],
  gap: ['GAP', 'GAP', 'GAP', 'Gap still open: the feature is missing (NDC-2294 / NDC-2030 / NDC-1486 list), not a regression'],
  inprog: ['IN PROGRESS – NOT JUDGED', 'BLOCKED', 'BLOCKED', 'Linked to a ticket that is In Progress: recorded only, not judged'],
  testdef: ['TEST DEFECT', 'INFO', 'INFO', 'Known test-side defect (listed 25 Oct): the test expectation is out of date — the app is not blamed'],
  blocked: ['BLOCKED BY NDC-2621', 'BLOCKED', 'BLOCKED', 'Blocked by the pipeline bug NDC-2621 (W2-B4 / NDC-2382)'],
  cand: ['NEW CANDIDATE', 'FAIL', 'FAIL', 'New candidate bug'],
  triage: ['NEEDS TRIAGE', 'PARTIAL', 'PARTIAL', 'Still failing, never filed (also failed 18 Oct): needs developer triage'],
};

// id -> [class, ticket, zoho image or null, zoho row text, reuse image]
const CASES = {
  'W3-2510': ['ticket', 'NDC-2510', null, '', 'NDC-2510-retest.png'],
  'W3-2511': ['ticket', 'NDC-2511', null, '', 'NDC-2511-retest.png'],
  'Z2': ['gap', 'NDC-2294', 'z-import.png', 'Import screen shown. The test spec says Zoho holds imported leads in Approve Leads; not checked live (it would save in Zoho)'],
  'Z3': ['gap', 'NDC-2294', 'z-rule-a.png', 'Workflow rule editor shown (trigger choices). Score / Notes triggers: not checked live beyond this screen'],
  'Z4': ['gap', 'NDC-2294', 'z-rule-actions-menu.png', 'Rule actions menu shown (Zoho offers more instant actions than TAVI)'],
  'Z5': ['gap', 'NDC-2294', 'z-assignment.png', 'Assignment rules screen shown. Owner assignment by an assignment rule inside a workflow: not checked live'],
  'Z6': ['gap', 'NDC-2294', 'z-review.png', 'Review process screen shown. Per-event review functions: not checked live'],
  'Z7': ['gap', 'NDC-2294', 'z-approvals.png', 'Approval processes screen shown. "Anyone / Everyone" approver option: not checked live'],
  'Z8': ['gap', 'NDC-2294', 'z-approvals.png', 'Approval processes screen shown. Call Function final action: not checked live'],
  'Z9': ['gap', 'NDC-2294', 'z-blueprint.png', 'Blueprint screen shown. Convert / Function / Tags / Create Record after-actions: not checked live'],
  'W3-GAPS': ['gap', 'NDC-2294, NDC-2030, NDC-1486', 'z-schedules.png', 'Schedules page shown (Zoho also has Scoring Rules and Cadences: z-scoring.png, z-cadences.png in evidence/raw)'],
  'W3-2294-13': ['gap', 'NDC-2294 item 13', null, 'Not checked live (API trigger parameter)'],
  'G-04': ['gap', 'NDC-2294 item 1', 'z-import.png', 'Import screen shown. Whether processes run on import with automation off: not checked live'],
  'B-19': ['gap', 'NDC-2294', 'z-review.png', 'Review process screen shown. API-channel holding: not checked live'],
  'F-01': ['inprog', 'NDC-2309', 'z-review.png', 'Review process screen shown; not judged (ticket In Progress)'],
  'H-05': ['inprog', 'NDC-2323', null, 'Not checked live (ticket In Progress)'],
  'G-16': ['inprog', 'NDC-2321', null, 'The test spec says Zoho\'s Timeline shows the order each process ran; not checked live (ticket In Progress)'],
  'G-12': ['inprog', 'NDC-2419', 'z-assignment.png', 'Assignment rules screen shown; not judged (waits for NDC-2419)'],
  'J-01': ['testdef'], 'E-15': ['testdef'], 'E2E-5': ['testdef'], 'E-18': ['testdef'], 'C-11': ['testdef'], 'C-09': ['testdef'],
  'A-08': ['testdef'], 'D-17': ['testdef'], 'C-12': ['testdef'], 'H-04': ['testdef'], 'D-05': ['testdef'], 'D-06': ['testdef'],
  'C-10': ['blocked', 'NDC-2621', null, 'Not checked live'],
  'A-14': ['cand', 'W3-C1', null, '', 'W3-C1-candidate.png'],
  'B-18': ['cand', 'W3-C2', null, '', 'W3-C2-candidate.png'],
  'G-07': ['triage', '', null, 'Not checked live'],
  'G-10': ['triage', 'NDC-2334 area (In Progress)', null, 'Not checked live'],
};
for (const id of Object.keys(CASES)) if (CASES[id][0] === 'testdef') CASES[id] = ['testdef', '', null, 'Not compared: the case is a test-side defect'];

// plain one-line results where the summary row is not the final word (W3RetestTest runs 2/3, results.md)
const RESULT_OVERRIDE = {
  'W3-2510': 'Rule with a Task action taskStatus "Task Closed" saved 201; a lead was created; the run is logged Fired with no error and 0 tasks exist.',
  'W3-2511': 'The Tasks date rule (due_date + 0) ran on time (reminder created); /audit/events has no entry naming the rule after the due time.',
  'W3-2294-13': 'The control lead got the rule, and a lead created with "trigger": [] also got it (description "QA W3 G13 ran") — an empty trigger list does not stop workflows.',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const K = { ok: '#16a34a', bad: '#dc2626', info: '#2563eb', '': '#111827' };
const wrap = (s, n = 112) => { const out = []; let t = String(s); while (t.length > n) { let i = t.lastIndexOf(' ', n); if (i < 40) i = n; out.push(t.slice(0, i)); t = t.slice(i).trimStart(); } out.push(t); return out; };

// Renders a card and returns {h, groups:{name:[x1,y1,x2,y2]}} measured from the page.
async function card(browser, out, title, lines) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;width:1600px;background:#fff;font:22px/1.55 Consolas,monospace;color:#111827}
h1{margin:0;padding:22px 32px;font:600 26px "Segoe UI",sans-serif;background:#f3f4f6;border-bottom:1px solid #d1d5db}.l{padding:6px 32px 6px 64px;white-space:pre-wrap}</style></head><body>
<h1>${esc(title)}</h1><div style="padding:14px 0">${lines.map(([t, k, g]) => `<div class="l" data-g="${g || ''}" style="color:${K[k || '']};${k === 'bad' ? 'font-weight:700' : ''}">${esc(t)}</div>`).join('')}</div></body></html>`;
  const pg = await browser.newPage({ viewport: { width: 1600, height: 400 } });
  await pg.setContent(html);
  const h = await pg.evaluate(() => document.body.scrollHeight);
  await pg.setViewportSize({ width: 1600, height: h });
  const groups = await pg.evaluate(() => { const g = {}; document.querySelectorAll('.l[data-g]').forEach(e => { const n = e.dataset.g; if (!n) return; const r = e.getBoundingClientRect();
    const b = g[n] || [r.left + 40, r.top, r.right - 16, r.bottom]; g[n] = [Math.min(b[0], r.left + 40), Math.min(b[1], r.top), Math.max(b[2], r.right - 16), Math.max(b[3], r.bottom)]; }); return g; });
  await pg.screenshot({ path: path.join(RAW, out) }); await pg.close();
  return { h, groups };
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const list = [];
  for (const [id, [cls, ticket, zimg, ztext, reuse]] of Object.entries(CASES)) {
    const f = failed[id]; const [label, verdict, pill, clsText] = CLS[cls];
    const test = f ? f.test.replace('.', '#') : ''; const what = f ? f.desc : '';
    const result = RESULT_OVERRIDE[id] || (f ? f.err : '');
    const entry = { id, status: 'FAILED', class: label, test, what, result: result.length > 400 ? result.slice(0, 400) + ' …' : result, ticket: ticket || '', evidence: reuse || `case-${id}.png` };
    list.push(entry);
    if (reuse) continue;
    const lines = [[`Case ${id} · ${test}`, 'info'], [`Checks: ${what}`, '', 'what']];
    wrap('Logged result: ' + result.slice(0, 700)).forEach(t => lines.push([t, cls === 'testdef' ? '' : 'bad', 'res']));
    lines.push([`Classification: ${clsText}${ticket ? ' (' + ticket + ')' : ''}`, 'info', 'cls']);
    lines.push([`Source: after/${(f && f.src || '').replace('-summary.json', '.log')} (26 Oct 2026, automated, no screen)`, 'info']);
    const c = await card(browser, `card-case-${id}.png`, `TAVI — ${id} (${test.split('#')[0]}), 26 Oct 2026`, lines);
    const tBoxes = [{ b: c.groups.res, n: 1 }, { b: c.groups.cls, n: 2, color: '#2563eb' }];
    const panels = [{ img: `card-case-${id}.png`, w: 1600, h: c.h, crop: [0, 0, 1600, c.h], caption: `TAVI — logged result of the automated test ${test}.`, boxes: tBoxes }];
    if (!zimg) { const z = await card(browser, `zoho-notchecked-${id}.png`, 'Zoho CRM — no live screen for this case', [['Not checked live', 'info', 'z'], ...wrap(ztext || 'Not checked live', 60).map(t => [t, '', 'z'])]);
      panels.push({ img: `zoho-notchecked-${id}.png`, w: 1600, h: z.h, crop: [0, 0, 1600, z.h], caption: 'Zoho — not checked live for this case (nothing is ever saved in Zoho).', boxes: [{ b: z.groups.z, n: 1, color: '#16a34a' }] }); }
    if (zimg) panels.push({ img: zimg, w: 1600, h: 950, crop: [0, 0, 1600, 950], caption: `Zoho — ${ztext.split('.')[0]} (read-only).`, boxes: [{ b: ZBOX, n: 1, color: '#16a34a' }] });
    const spec = { out: `case-${id}.png`, ticket: id, verdict, label, title: what || id, env: ENV, date: '26 Oct 2026', panels,
      rows: [
        ['1', what || 'What the test checks', ztext || 'Not checked live', result.length > 260 ? result.slice(0, 260) + ' …' : result, pill],
        ['2', 'Classification', '—', clsText + (ticket ? ` (${ticket})` : ''), 'INFO'],
      ] };
    fs.writeFileSync(path.join(SPECS, `case-${id}.json`), JSON.stringify(spec, null, 1));
    execFileSync('node', [path.join(W3, 'scripts/annotate-vs-zoho.js'), path.join(SPECS, `case-${id}.json`)], { stdio: 'pipe' });
    console.log('built', spec.out);
  }

  // skipped / not run: one grouped card
  const SKIP_GROUP = {
    'Owner account reserved for the other lanes': ['D-10', 'D-18', 'I-08', 'I-09', 'K-09', 'K-13'],
    'Needs your OK: would change a shared account': ['A-10', 'A-17'],
    'Would fire a teammate\'s rule': ['J-04'],
    'Environment: public web form answers 404': ['A-02', 'E2E-1', 'G-08'],
    'Environment: no API channel (API creates are "manual")': ['G-02', 'G-15'],
    'Environment: Leads has no unique field': ['A-13'],
    'Environment: deal conversion / mass convert': ['H-01', 'H-07'],
    'Environment: SLA below 1 hour refused': ['B-13'],
    'Environment: no inbox to see the email': ['E-04'],
    'Not applicable (your earlier decision)': ['B-22'],
    'Other inconclusive': ['E-16', 'F-04', 'G-13', 'Z1', 'G-18', 'K-09 (layout)'],
  };
  const lines = [];
  for (const [g, ids] of Object.entries(SKIP_GROUP)) {
    lines.push([g + ` (${ids.length})`, 'info']);
    for (const id of ids) {
      const s = id === 'K-09 (layout)' ? { test: 'GroupKZRegressionGapsTest.k09ApprovalStatusFieldLockedInLayout', desc: 'Approval Status field is a locked system field in the layout (read-only check, nothing changed)', err: 'INCONCLUSIVE: approval_status not found in the layout JSON - cannot tell whether it is hidden from the builder or named differently (UI check)' } : skipped[id]; const reason = s ? s.err.replace(/^(NOT RUN|INCONCLUSIVE)[:\s–-]*/i, '') : '';
      wrap(`  ${id}  ${reason}`, 118).forEach((t, i) => lines.push([i ? '      ' + t.trimStart() : t, '']));
      list.push({ id, status: 'SKIPPED', class: g, test: s ? s.test.replace('.', '#') : '', what: s ? s.desc : '', result: s ? s.err : '', ticket: '', evidence: 'skipped-cases.png' });
    }
  }
  // K-09 has two tests (owner-only edit and layout JSON check); both are listed under their logged reason
  const sc = await card(browser, 'skipped-cases-card.png', 'Wave 3 — 26 cases not run or inconclusive (no screenshots: they did not run), 26 Oct 2026', lines);
  fs.copyFileSync(path.join(RAW, 'skipped-cases-card.png'), path.join(ANN, 'skipped-cases.png'));
  await browser.close();
  fs.writeFileSync(path.join(W3, 'after/case-list.json'), JSON.stringify(list, null, 1));
  console.log('cases', list.length, 'failed', list.filter(x => x.status === 'FAILED').length, 'skipped', list.filter(x => x.status === 'SKIPPED').length, 'skip card h', sc.h);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
