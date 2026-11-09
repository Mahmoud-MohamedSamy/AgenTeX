page.on('dialog', d => d.accept().catch(() => {}));
await api('GET', '/desk/departments');
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('workflow-rule-draft')).forEach(k => localStorage.removeItem(k)));
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 12000);
const fresh = page.getByRole('button', { name: 'Start fresh' }); if (await fresh.count()) { await fresh.click(); await sleep(1500); }
// WHEN: Field Changed with 3 fields + Any/All
await page.getByText('This rule will be executed', { exact: false }).first().click(); await sleep(1200);
await page.getByRole('button', { name: 'Field Changed', exact: true }).click(); await sleep(1000);
for (let i = 0; i < 2; i++) { const b = page.getByText('+ Add a field', { exact: true }); if (!(await b.count())) break; await b.click({ force: true }); await sleep(800); const sel = page.getByRole('button', { name: '— select field —' }); if (await sel.count()) { await sel.last().click({ force: true }); await sleep(800); const o = page.locator("[role='option']"); await o.nth(i + 2).click({ force: true }); await sleep(800); } }
await shot('d3-watch-3-fields');
const when = (await txt()).split('\n').filter(l => /watch|any of|all of|add a field|fields change/i.test(l)).slice(0, 10);
const addMore = await page.getByText('+ Add a field', { exact: true }).count();
await page.getByRole('button', { name: 'Done', exact: true }).first().click({ force: true }); await sleep(800);
// action picker
await page.getByRole('button', { name: 'Add action', exact: true }).first().click({ force: true }); await sleep(1500); await shot('b-action-picker');
const acts = (await txt()).split('\n').filter(l => /custom action|slack|teams|google chat|instant|whatsapp/i.test(l)).slice(0, 10);
await page.keyboard.press('Escape'); await sleep(500);
return fin({ when, addMoreAfterTwo: addMore, acts });
