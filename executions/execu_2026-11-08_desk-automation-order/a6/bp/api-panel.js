// Renders the NDC-2758 API log (evidence/raw/NDC-2758-api.json) as a 1600x1000 PNG panel with numbered markers.
const path = require('path'), fs = require('fs');
const P = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RUN = path.join(P, 'executions/execu_2026-11-01_desk-blueprint');
const j = JSON.parse(fs.readFileSync(path.join(RUN, 'evidence/raw/NDC-2758-api.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const crit = JSON.stringify(j.request.entryCriteria, null, 2);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1600px;height:1000px;background:#0f172a;color:#e2e8f0;font:26px/1.45 Consolas,monospace;padding:40px;box-sizing:border-box}
h1{font:600 30px "Segoe UI",sans-serif;color:#fff;margin:0 0 20px}.blk{background:#1e293b;border-radius:10px;padding:20px 26px;margin-bottom:22px;position:relative}
.lbl{font:600 22px "Segoe UI",sans-serif;color:#94a3b8;margin-bottom:8px}.ok{color:#4ade80;font-weight:700}.mark{position:absolute;right:-14px;top:-14px;width:44px;height:44px;border-radius:50%;background:#ff2d55;color:#fff;font:700 24px "Segoe UI";display:flex;align-items:center;justify-content:center}
.hl{outline:4px solid #ff2d55;border-radius:6px}pre{margin:0;white-space:pre-wrap}</style></head><body>
<h1>TAVI Desk API — staging-desk.taviportal.com, org Anyware, 1 Nov 2026 (QA records, deleted after)</h1>
<div class="blk hl"><span class="mark">1</span><div class="lbl">Request</div><pre>POST /api/v1/modules/{tickets}/blueprints   isActive: true
name: "QA BP NDC-2758 evidence", department: QA WF Dept R
entryCriteria: ${esc(crit)}</pre></div>
<div class="blk hl"><span class="mark">1</span><div class="lbl">Response</div><pre><span class="ok">${j.response.status} Created</span> — criteria saved as sent, no error</pre></div>
<div class="blk hl"><span class="mark">2</span><div class="lbl">Ticket created in the same department</div><pre>subject: "${esc(j.ticket.subject)}"  (does NOT start with "QA BP N2-ONLY ")
GET …/records/{id}/blueprint-state → blueprint "QA BP NDC-2758 evidence", state ${esc(j.ticket.blueprintState.activeStates.join(','))}</pre></div>
</body></html>`;
(async () => { const b = await chromium.launch({ headless: true, channel: 'msedge' }); const pg = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await pg.setContent(html); await pg.screenshot({ path: path.join(RUN, 'evidence/raw/NDC-2758-api.png') }); await b.close(); console.log('ok'); })();
