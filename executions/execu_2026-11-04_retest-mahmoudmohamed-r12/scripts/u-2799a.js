const o = {}; const reqs = [];
page.on('response', async r => { if (['PUT', 'POST'].includes(r.request().method()) && /blueprints/.test(r.url())) reqs.push(r.request().method() + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 200)); });
await page.goto(H + '/settings/automation/blueprints/b1d51be9-6ef1-4c31-9a7e-d5293af29985', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Save and Publish/.test(await text())) break; } await sleep(5000);
// (a) custom mandatory on QA go
await page.getByRole('button', { name: 'QA go', exact: true }).first().click(); await sleep(3000);
const req = page.locator('select').filter({ hasText: 'Required for some agents and teams' }).first(); await req.selectOption({ label: 'Required for some agents and teams' }); await sleep(2000);
o.afterReq = (await page.locator('xpath=//*[normalize-space(text())="What the agent fills in"]/ancestor::*[self::div][2]').first().innerText()).slice(0, 700);
o.reqSelects = await page.locator('select:visible').evaluateAll(a => a.map(x => [...x.options].slice(0, 5).map(y => y.text).join('|')));
const pick = page.locator('select:visible').filter({ hasText: 'Add an agent or team' }).last(); await pick.selectOption({ label: 'Customer Experience Specialists 2' }); await sleep(1500); await shot('2799-a-custom-mandatory.png');
await page.getByRole('button', { name: 'Save transition' }).click(); await sleep(2500);
await page.locator('.react-flow__node').filter({ hasText: /^s*Open/ }).first().click(); await sleep(3000); await shot('2799-b-state-open.png');
o.statePanel = (await page.locator('xpath=//*[contains(normalize-space(.),"Time limit")]/ancestor::*[self::div][3]').last().innerText().catch(() => '')).slice(0, 1800);
o.stateCtl = await page.locator('select:visible, input:visible, button:visible').evaluateAll(a => a.map(x => x.tagName + ':' + (x.getAttribute('aria-label') || x.placeholder || (x.tagName === 'SELECT' ? [...x.options].slice(0, 4).map(y => y.text).join('|') : x.innerText) || '').slice(0, 50)).filter(t => !/^BUTTON:(QA|Open|Escalated|Closed|On Hold)/.test(t)).slice(-40));
return o;
