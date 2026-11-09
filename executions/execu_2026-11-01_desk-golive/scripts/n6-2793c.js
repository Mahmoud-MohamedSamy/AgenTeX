const o = {};
await page.goto(H + '/settings/automation/workflow-rules/7ec0307b-5417-4db6-babf-b4d8bff3f50e', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(1500); const t = await txt(); if (/WHEN/.test(t) && /QA RT 2793/.test(t)) break; }
await sleep(2000); await page.locator('text=/This rule will be executed/').first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(4000);
o.watch = await page.$$eval('select, [role=combobox], button', es => es.filter(e => e.offsetParent).map(e => (e.value || e.innerText || '').trim()).filter(t => /priority|Priority|pick a field/.test(t)).slice(0, 5));
const cb = page.getByText('Also run when a record is created', { exact: true }).first(); o.cb = await cb.count();
if (o.cb) { await cb.click(); await sleep(800); }
o.checked = await page.evaluate(() => { const l = [...document.querySelectorAll('label')].find(x => /Also run when a record is created/.test(x.innerText)); const i = l && (l.querySelector('input') || document.getElementById(l.htmlFor)); return i ? i.checked : null; });
o.before = await shot('rt/2793-ticked');
await page.locator('button', { hasText: /^Done$/ }).first().click().catch(() => {}); await sleep(800);
o.when = (await txt()).replace(/\s+/g, ' ').match(/This rule will be executed[^.]{0,200}/)?.[0];
await page.locator('button', { hasText: /^\s*Save\s*$/ }).last().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(4000);
o.msg = (await txt()).replace(/\s+/g, ' ').match(/.{0,60}(saved|Saved|updated|error|Error).{0,60}/)?.[0];
o.after = await shot('rt/2793-saved');
return JSON.stringify(o);
