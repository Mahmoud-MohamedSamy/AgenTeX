const o = {}; const reqs = [];
page.on('request', r => { if (['PUT', 'POST'].includes(r.method()) && /blueprints/.test(r.url())) { const b = r.postData() || ''; const i = b.indexOf('scalation'); reqs.push(r.method() + ' ' + r.url().replace(/^.*blueprints/, '') + ' esc=' + (i >= 0 ? b.slice(Math.max(0, i - 300), i + 500) : 'none')); } }); page.on('response', async r => { if (['PUT', 'POST'].includes(r.request().method()) && /blueprints/.test(r.url())) reqs.push('→ ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 250)); });
await page.goto(H + '/settings/automation/blueprints/b1d51be9-6ef1-4c31-9a7e-d5293af29985', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Save and Publish/.test(await text())) break; } await sleep(5000);
await page.locator('.react-flow__node').filter({ hasText: 'Start' }).first().click(); await sleep(3000);
o.title = (await page.locator('xpath=//*[normalize-space(text())="Time limit"]/preceding::*[1]').first().innerText().catch(() => ''));
await page.getByRole('button', { name: 'Add escalation level' }).click(); await sleep(2000);
const lev = page.locator('xpath=//*[normalize-space(text())="Escalation levels"]/ancestor::*[self::div][2]').first();
o.level = (await lev.innerText()).slice(0, 1200);
o.levelCtl = await lev.locator('select, input, button').evaluateAll(a => a.map(x => x.tagName + ':' + (x.getAttribute('aria-label') || x.placeholder || (x.tagName === 'SELECT' ? [...x.options].map(y => y.text).join('|') : x.innerText) || '').slice(0, 90)));
await lev.locator('select').filter({ hasText: 'Before the limit' }).first().selectOption({ label: 'At the limit' }); await sleep(800);
await lev.locator('select').filter({ hasText: 'Agents' }).first().selectOption({ label: 'ndc-staging-owner' }); await sleep(1200); o.saveEnabled = await page.getByRole('button', { name: 'Save state' }).isEnabled(); await shot('2799-c-level.png');
if (!o.saveEnabled) { o.levelNow = (await lev.innerText()).slice(-700); return o; } await page.getByRole('button', { name: 'Save state' }).click(); await sleep(2500);
await page.getByRole('button', { name: 'Save Draft' }).first().click(); await sleep(5000); await page.getByRole('button', { name: 'Save and Publish' }).first().click(); await sleep(5000); await shot('2799-d-publish.png');
const conf = page.getByRole('button', { name: /Publish|Confirm/ }).last(); if (await page.getByRole('dialog').count()) { o.dialog = (await page.getByRole('dialog').last().innerText()).slice(0, 300); await conf.click().catch(() => {}); await sleep(5000); }
o.reqs = reqs; o.after = ((await text()).match(/d+ issues? to fix[sS]{0,300}/) || [''])[0];
return o;
