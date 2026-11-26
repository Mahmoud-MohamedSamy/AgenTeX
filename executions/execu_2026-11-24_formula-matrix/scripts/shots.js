// One evidence PNG per finding card in findings.html (element screenshots).
const path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation'; const RUN = P + '/executions/execu_2026-11-24_formula-matrix';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
(async () => { const b = await chromium.launch({ headless: true, channel: 'msedge' }); const p = await b.newPage({ viewport: { width: 1150, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('file:///' + RUN + '/findings.html'); await p.waitForTimeout(1500);
  const names = { B1: 'B1-plus-joins-text', B2: 'B2-default-user-empty-in-formula', B3: 'B3-edit-fails-with-rollup', B4: 'B4-import-lookup-by-name', A1: 'NDC-3221-extra-types-empty', A2: 'NDC-3224-date-text-vs-zoho', G1: 'G1-no-type-check-vs-zoho', G2: 'G2-empty-fields-vs-zoho', G3: 'G3-empty-checkbox-vs-zoho', G4: 'G4-divide-by-zero-vs-zoho', S1: 'NDC-3219-same-as-zoho', S2: 'NDC-3227-same-as-zoho', S3: 'NDC-3229-formula-on-formula-zoho', S4: 'NDC-3217-workflow-pass' };
  for (const [id, n] of Object.entries(names)) { const el = p.locator('#' + id); try { await el.screenshot({ path: RUN + '/screenshots/annotated/' + n + '.png' }); console.log('ok', n); } catch (e) { console.log('fail', n, e.message.split('\n')[0]); } }
  await b.close(); })();
