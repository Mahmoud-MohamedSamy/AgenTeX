// TAVI ticket import of one file (FILE, TAG set via env). Automation left OFF. Screenshots to RUN/screenshots/raw via shot().
const FILE = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/data/' + process.env.FILE;
const TAG = process.env.TAG;
const T0 = '88e8ea44-1658-4df3-9930-d0902b91073d';
const body0 = async () => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const clk = async re => { const b = page.getByRole('button', { name: re }).last(); await b.click({ timeout: 15000 }); await sleep(5000); };
await page.setViewportSize({ width: 1600, height: 1100 });
await page.goto(H + '/settings/data/import?module=' + T0, { waitUntil: 'commit' }); for (let i = 0; i < 30; i++) { await sleep(3000); if (/Start import|Start over|Browse/i.test(await body0())) break; }
const so = page.getByRole('button', { name: /^Start over$/ }); if (await so.count()) { log('start over'); await so.first().click(); await sleep(5000); }
await page.getByRole('button', { name: 'Browse', exact: true }).waitFor({ timeout: 60000 }); await sleep(3000);
await page.locator('input[type=file]').last().setInputFiles(FILE, { timeout: 20000 });
{ const nx = page.getByRole('button', { name: /^Next$/ }).last(); for (let i = 0; i < 30 && await nx.isDisabled().catch(() => true); i++) await sleep(2000); } await sleep(2000);
await shot('IMP-' + TAG + '-1-upload.png');
await clk(/^Next$/); await shot('IMP-' + TAG + '-2-step2.png', { fullPage: true });
await clk(/^Next$/); await shot('IMP-' + TAG + '-3-map.png', { fullPage: true });
log('map', (await body0()).slice(0, 2500));
await clk(/^Next$/);
const t = await body0(); const i = t.indexOf('Trigger automation'); log('assignStep', t.slice(Math.max(0, i - 600), i + 600));
await shot('IMP-' + TAG + '-4-assign.png', { fullPage: true });
if (process.env.AUTO === '1') { await page.getByRole('checkbox').first().check({ timeout: 8000 }).catch(async () => { await page.getByText('Trigger automation and process management').click(); }); await sleep(800); log('auto', await page.getByRole('checkbox').first().isChecked().catch(() => 'n/a')); }
await clk(/^Save & next$/);
await page.getByText('I confirm I have permission').click({ timeout: 90000 }); await sleep(800);
const sb = page.getByRole('button', { name: /^Submit$/ }).last(); const t1 = Date.now(); while (Date.now() - t1 < 30000 && await sb.isDisabled().catch(() => true)) await sleep(1500);
await shot('IMP-' + TAG + '-5-review.png', { fullPage: true });
await sb.click({ timeout: 15000 }); const t0 = Date.now(); let tt = '';
while (Date.now() - t0 < 90000) { await sleep(3000); tt = await body0(); if (/(records? (created|added)|created \d|added \d|\d+ (created|added|imported)|Undo|complete)/i.test(tt.slice(-900)) && !/Review and submit/.test(tt)) break; }
log('result', tt.slice(-500)); await shot('IMP-' + TAG + '-6-result.png', { fullPage: true });
return 'ok';
