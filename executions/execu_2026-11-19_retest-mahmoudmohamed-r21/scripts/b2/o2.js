const fs = require('fs'); const J = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/b2/3065.json', 'utf8'));
const out = {};
await page.goto(H + '/settings/automation/blueprints/' + J.vo, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA onlyA/.test(await text())) break; }
let t = (await text()).replace(/\s+/g, ' '); out.warn = (t.match(/[^.]{0,60}no active owner[^.]{0,40}/gi) || []).slice(0, 2);
await page.getByText('QA onlyA', { exact: true }).first().click(); await sleep(3000);
t = (await text()).replace(/\s+/g, ' '); let i = t.search(/Transition Owners|TRANSITION OWNERS/i); out.owners = t.slice(i, i + 300).replace(/[\w.+-]+@[\w.-]+/g, '<mail>');
const sel = page.locator('select', { has: page.locator('option', { hasText: /Add owner/ }) }).first();
out.opts = await sel.evaluate(s => [...s.options].map(o => o.text)).catch(e => 'ERR ' + e.message.slice(0, 80));
const ro = page.getByText(/Read only/).first(); if (await ro.count()) { await ro.scrollIntoViewIfNeeded(); await sleep(600); }
await shot('3065-b2-designer-vo.png');
await page.goto(H + '/views/all/tickets/' + J.t.D1, { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 B2 dyn D1').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(6000);
await page.getByRole('button', { name: 'Assign owners' }).first().click();
const dlg = page.getByRole('dialog');
for (let k = 0; k < 30; k++) { await sleep(2000); if (!/Loading departments/.test(await dlg.innerText().catch(() => 'Loading departments'))) break; }
out.dlg = (await dlg.innerText()).replace(/\s+/g, ' ').replace(/[\w.+-]+@[\w.-]+/g, '<mail>').slice(0, 600);
out.selects = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] select')].map(s => [...s.options].map(o => o.text)));
const cb = page.locator('[role=dialog] [role=combobox], [role=dialog] input').first(); if (await cb.count()) { await cb.click().catch(() => {}); await sleep(1500); out.opts2 = (await page.locator('[role=option]').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').replace(/[\w.+-]+@[\w.-]+/g, '<mail>')).slice(0, 20); }
await shot('3065-b2-assign-owners-D1.png');
return out;
