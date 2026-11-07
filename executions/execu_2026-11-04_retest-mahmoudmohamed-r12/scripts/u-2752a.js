const o = {};
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Skills/.test(await text())) break; }
await page.getByText('Skills', { exact: true }).first().click(); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Skill Types/.test(await text())) break; } await sleep(3000);
o.url = page.url(); o.tabs = (await page.getByRole('tab').allInnerTexts()).map(s => s.trim());
const dsel = page.locator('select').filter({ hasText: 'QA RT11 Dept A' }).first(); if (await dsel.count()) { await dsel.selectOption({ label: 'QA RT11 Dept A' }); await sleep(4000); } else { const cb = page.getByRole('combobox').first(); await cb.click().catch(() => {}); await page.keyboard.type('QA RT11 Dept A'); await sleep(1500); await page.getByRole('option', { name: 'QA RT11 Dept A' }).first().click().catch(() => {}); await sleep(4000); }
await shot('2752-a-skills.png');
const t = await text(); o.page = t.slice(t.lastIndexOf('Skills') - 100, t.lastIndexOf('Skills') + 1500);
o.controls = await page.locator('main select, main input, main button').evaluateAll(a => a.map(x => x.tagName + ':' + (x.getAttribute('aria-label') || x.placeholder || (x.tagName === 'SELECT' ? [...x.options].slice(0, 4).map(y => y.text).join('|') : x.innerText) || '').slice(0, 50)).slice(0, 40));
const search = page.getByPlaceholder(/Search/i).last(); if (await search.count()) { await search.fill('qa_rt12'); await sleep(2500); o.searchRows = (await page.locator('main table tbody tr, main li').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 70)).slice(0, 8); await shot('2752-b-search.png'); }
// delete warning for the used skill
const row = page.locator('main tr, main li').filter({ hasText: 'qa_rt12_2752_sk1' }).first();
await row.getByRole('button', { name: /Delete|Remove/i }).first().click().catch(async () => { await row.locator('button').last().click().catch(() => {}); await sleep(800); await page.getByRole('menuitem', { name: /Delete/i }).first().click().catch(() => {}); });
await sleep(2500); o.deleteDialog = (await page.getByRole('dialog').last().innerText().catch(() => '')).slice(0, 500); await shot('2752-c-delete-warning.png');
await page.getByRole('button', { name: 'Cancel' }).last().click().catch(() => {});
return o;
