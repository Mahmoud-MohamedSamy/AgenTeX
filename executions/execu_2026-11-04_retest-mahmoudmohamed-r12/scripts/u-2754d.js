const o = {}; const reqs = [];
page.on('request', r => { if (['PUT', 'POST', 'PATCH'].includes(r.method()) && /blueprints/.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace(/^.*api\/v1/, '')); });
page.on('response', async r => { if (['PUT', 'POST', 'PATCH'].includes(r.request().method()) && /blueprints/.test(r.url())) reqs.push('→ ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 300)); });
await page.goto(H + '/settings/automation/blueprints/45e045b1-2991-46dc-9af0-5b158de25ea8', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Save and Publish/.test(await text())) break; } await sleep(5000);
// advanced: strict mode + dynamic owners
await page.getByRole('button', { name: 'Edit', exact: true }).first().click(); await sleep(3000);
const tick = async lbl => { const c = page.getByRole('checkbox', { name: new RegExp(lbl, 'i') }); if (await c.count()) { if (!(await c.first().isChecked())) await c.first().check(); return 'checkbox'; } const s = page.getByRole('switch', { name: new RegExp(lbl, 'i') }); if (await s.count()) { await s.first().click(); return 'switch'; } await page.getByText(new RegExp('^' + lbl), { exact: false }).first().click(); return 'text'; };
o.strict = await tick('Strict Mode'); await sleep(1500); o.strictPanel = (await text()).match(/Strict Mode[\s\S]{0,700}/)?.[0];
await shot('2754-e-strict.png');
o.dyn = await tick('Dynamic Transition Owner Assignment'); await sleep(1000);
await page.getByRole('button', { name: 'Done', exact: true }).first().click().catch(() => {}); await sleep(2000);
await page.getByRole('button', { name: 'Save Draft' }).first().click(); await sleep(6000);
o.reqs = reqs;
return o;
