// Renders the BP-P2-1..4 API logs (evidence/raw/P2-api.json + P2-active.json) as 1600x1000 PNG panels with numbered markers.
const path = require('path'), fs = require('fs');
const P = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RAW = path.join(P, 'executions/execu_2026-11-01_desk-blueprint/evidence/raw');
const E = JSON.parse(fs.readFileSync(path.join(RAW, 'P2-api.json'), 'utf8'));
const A = JSON.parse(fs.readFileSync(path.join(RAW, 'P2-active.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const blk = (n, label, body) => `<div class="blk hl"><span class="mark">${n}</span><div class="lbl">${esc(label)}</div><pre>${body}</pre></div>`;
const ok = s => `<span class="ok">${s}</span>`, bad = s => `<span class="bad">${s}</span>`;
const pick = s => ({ slaDueAt: s.slaDueAt, warning_due_at: s.warning_due_at, auto_due_at: s.auto_due_at, autoTransitionAt: s.autoTransitionAt, activeStates: s.activeStates });
const PANELS = {
  'P2-1-api.png': [
    blk(1, 'POST /api/v1/modules/{tickets}/blueprints — state "Open" time limit and warning (minutes)', E.P2_1.map(c => `${esc(JSON.stringify(c.sent)).padEnd(52)} → ${ok(c.status + ' Created')}  saved ${esc(JSON.stringify(c.saved))}`).join('\n')),
    blk(2, 'Same mistake, blueprint made active (isActive: true) + a matching QA ticket', `${ok(A.P2_1.create + ' Created')}, isActive ${A.P2_1.isActive}, ticket entered: ${A.P2_1.entered}\nticket timers: ${esc(JSON.stringify(pick(A.P2_1.state)))}\n${bad('warning_due_at: null — the warning is silently dropped')}`)],
  'P2-2-api.png': [
    blk(1, 'POST /api/v1/modules/{tickets}/blueprints — state "Open"', `${esc(JSON.stringify(E.P2_2.sent))} → ${ok(E.P2_2.status + ' Created')}  saved slaMinutes: ${bad(E.P2_2.saved)}\n(earlier run: 0 is saved too; 1.5 and "abc" are refused)`),
    blk(2, 'Same mistake, blueprint made active + a matching QA ticket', `${ok(A.P2_2.create + ' Created')}, isActive ${A.P2_2.isActive}, ticket entered: ${A.P2_2.entered}\nticket timers: ${esc(JSON.stringify(pick(A.P2_2.state)))}\n${bad('no due time at all — the -1 limit is silently ignored')}`)],
  'P2-3-api.png': [
    blk(1, 'POST blueprint — state "Open" auto-move points at "esc2", a transition from Escalated → Closed', `${esc(JSON.stringify(E.P2_3.sent))}\n→ ${ok(E.P2_3.status + ' Created')}  saved ${esc(JSON.stringify(E.P2_3.saved))}`),
    blk(2, 'Same mistake, active, auto-move after 1 minute + a matching QA ticket, checked after 100 s', `${ok(A.P2_3.create + ' Created')}, isActive ${A.P2_3.isActive}, ticket entered: ${A.P2_3.entered}\nticket timers: ${esc(JSON.stringify(pick(A.P2_3.state)))}\n${bad('auto_due_at: null, ticket still at Open — the auto-move never runs')}`),
    blk(3, 'Control: the same wrong transition in "When the customer replies"', `${esc(JSON.stringify(E.P2_3.control.sent))} → ${bad(E.P2_3.control.status)}\n"${esc(E.P2_3.control.body.error.details[0].message)}"`)],
  'P2-4-api.png': [
    blk(1, 'POST /api/v1/workflow/rules — QA rule, active', `trigger: ${esc(E.P2_4.rule.trigger)}, criteria: subject starts with "QA BP EV4 "\naction: ${esc(E.P2_4.rule.action)}  → ${ok(E.P2_4.rule.status + ' Created')} (no warning that Status is controlled by a blueprint)`),
    blk(2, 'QA ticket in the blueprint — direct API change of Status', `before: status ${esc(E.P2_4.before.status)}, blueprint state ${esc(E.P2_4.before.blueprintState)}\nPATCH status = Closed → ${ok(E.P2_4.directPatch.status)} "${esc(E.P2_4.directPatch.body.error.message)}"`),
    blk(3, 'Run transition "QA go" (Open → Escalated), wait 12 s', `POST …/blueprint-transitions/go → ${ok(E.P2_4.transition.status)}\nthen the workflow rule runs: status ${bad(E.P2_4.after.status)}, blueprint state ${bad(E.P2_4.after.blueprintState === null ? 'none (left the blueprint)' : E.P2_4.after.blueprintState)}`)],
};
const page = (title, blocks) => `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1600px;height:1000px;background:#0f172a;color:#e2e8f0;font:21px/1.45 Consolas,monospace;padding:36px;box-sizing:border-box}
h1{font:600 28px "Segoe UI",sans-serif;color:#fff;margin:0 0 20px}.blk{background:#1e293b;border-radius:10px;padding:18px 24px;margin-bottom:22px;position:relative}
.lbl{font:600 21px "Segoe UI",sans-serif;color:#94a3b8;margin-bottom:8px}.ok{color:#4ade80;font-weight:700}.bad{color:#fb7185;font-weight:700}
.mark{position:absolute;right:-14px;top:-14px;width:44px;height:44px;border-radius:50%;background:#ff2d55;color:#fff;font:700 24px "Segoe UI";display:flex;align-items:center;justify-content:center}
.hl{outline:4px solid #ff2d55;border-radius:6px}pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}</style></head><body><h1>${esc(title)}</h1>${blocks.join('')}</body></html>`;
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] }); const pg = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  for (const [f, blocks] of Object.entries(PANELS)) {
    await pg.setContent(page('TAVI Desk API — staging-desk.taviportal.com, org Anyware, QA WF Dept R, 2 Nov 2026 (QA records, deleted after)', blocks));
    await pg.screenshot({ path: path.join(RAW, f) }); console.log('ok', f);
  }
  await b.close();
})();
