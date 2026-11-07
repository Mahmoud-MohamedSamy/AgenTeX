const o = {}; const reqs = [];
page.on('request', r => { if (['PUT', 'POST'].includes(r.method()) && /blueprints/.test(r.url())) { const b = r.postData() || ''; const i = b.indexOf('"Escalated"'); reqs.push(r.method() + ' ' + r.url().replace(/^.*blueprints/, '') + ' ' + (i >= 0 ? b.slice(i - 20, i + 260) : '')); } });
await page.goto(H + '/settings/automation/blueprints/b1d51be9-6ef1-4c31-9a7e-d5293af29985', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Save and Publish/.test(await text())) break; } await sleep(5000);
await page.locator('.react-flow__node').filter({ hasText: 'Escalated' }).first().click(); await sleep(3000);
const panel = page.locator('xpath=//*[normalize-space(text())="Time limit"]/ancestor::*[self::div][2]').first();
await page.getByPlaceholder('No limit').first().fill('8'); await sleep(800);
await page.getByRole('button', { name: 'Business hours', exact: true }).first().click(); await sleep(1500);
o.selects = await page.locator('select:visible').evaluateAll(a => a.map(x => [...x.options].map(y => y.text).join('|')));
const bh = page.locator('select:visible').filter({ hasText: 'QA RT12 2799 BH' }).first(); o.hasPicker = await bh.count();
if (o.hasPicker) { await bh.selectOption({ label: 'QA RT12 2799 BH' }); await sleep(1500); }
o.example = ((await text()).match(/A ticket that enters[^\n]*/) || [''])[0];
await shot('2799-g-bh-set.png');
await page.getByRole('button', { name: 'Save state' }).click(); await sleep(2000);
await page.getByRole('button', { name: 'Save Draft' }).first().click(); await sleep(4000); await page.getByRole('button', { name: 'Save and Publish' }).first().click(); await sleep(6000);
o.reqs = reqs.slice(-3); return o;
