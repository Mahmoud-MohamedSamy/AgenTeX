const I = JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/out/ids-sc21.json', 'utf8'));
await page.goto(H + '/reports/view/' + I.rep, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/QA RT21 SC A/.test(await text())) break; }
await sleep(2500); await shot('F05-1-report.png');
const t = await text(); const i = t.indexOf('QA RT21 SC'); log('REPORT ' + new Date().toISOString() + ' ' + t.slice(Math.max(0, i - 300), i + 300).replace(/\n/g, ' | '));
await page.goto(H + '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/' + I.A, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/QA RT21 SC A/.test(await text())) break; }
await sleep(2500);
const sc = page.getByText('Score', { exact: true }).first(); if (await sc.count()) { await sc.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); log('scoreBox ' + JSON.stringify(await sc.boundingBox())); }
await shot('F05-2-lead-A.png');
const t2 = await text(); const j = t2.indexOf('\nScore\n'); log('LEAD ' + new Date().toISOString() + ' ' + (j >= 0 ? t2.slice(j, j + 40).replace(/\n/g, ' | ') : 'no Score label'));
