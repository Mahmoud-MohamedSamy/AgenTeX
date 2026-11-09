// NDC-1819 Work Queue: what is there now — filter panel, header menu (Asc/Desc/Pin/Hide), Manage Columns pin, row Add Note, period counts, category view.
const st = {}; const reqs = [];
page.on('response', r => { const u = r.url(); if (/work-?queue|activities\/counts|periods/i.test(u) && /api\/v1/.test(u)) reqs.push(r.status() + ' ' + u.replace(/^.*api\/v1/, '').slice(0, 160)); });
await page.goto(H + '/', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 30 && !(await page.getByRole('link', { name: 'Work Queue' }).count()); i++) await sleep(2000); await page.getByRole('link', { name: 'Work Queue' }).first().click(); st.url0 = 1;
for (let i = 0; i < 40; i++) { await sleep(3000); const t = await text(); if (/My Open Activities|Work Queue/.test(t) && !/Loading\.\.\./.test(t) && /Subject|Due/.test(t)) break; }
await sleep(4000); st.url = page.url(); await shot('1819-1-wq.png');
st.rail = (await text()).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 80).join(' | ').slice(0, 1500);
// header menu of first data column
const ths = page.locator('table thead th'); st.cols = (await ths.allInnerTexts()).map(x => x.trim());
const th = ths.filter({ hasText: /Subject|Due/ }).first(); await th.hover(); await sleep(800);
const menuBtn = th.locator('button').last(); if (await menuBtn.count()) { await menuBtn.click(); await sleep(1500); await shot('1819-2-header-menu.png'); st.headerMenu = (await page.locator('[role=menu], [role=listbox], [data-radix-popper-content-wrapper]').allInnerTexts()).join(' | ').replace(/\s+/g, ' ').slice(0, 300); await page.keyboard.press('Escape'); }
// filter
const fb = page.getByRole('button', { name: /Filter/i }).first(); if (await fb.count()) { await fb.click(); await sleep(2500); await shot('1819-3-filter.png'); st.filter = (await text()).match(/(System Defined|Filter By Fields|Filter By Related|Add filter|Filter).{0,500}/s)?.[0].replace(/\s+/g, ' '); await page.keyboard.press('Escape'); await sleep(800); }
// table settings
const gear = page.getByRole('button', { name: /settings|Table settings|columns/i }).last(); if (await gear.count()) { await gear.click(); await sleep(1500); await shot('1819-4-table-settings.png'); st.settings = (await page.locator('[role=menu]').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' '); const mc = page.getByRole('menuitem', { name: /Manage Columns/i }); if (await mc.count()) { await mc.click(); await sleep(2500); await shot('1819-5-manage-columns.png'); st.manage = (await page.getByRole('dialog').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); await page.keyboard.press('Escape'); } }
// row hover
const row = page.locator('table tbody tr').first(); if (await row.count()) { await row.hover(); await sleep(1200); await shot('1819-6-row-hover.png'); st.rowBtns = await row.locator('button, [role=button]').evaluateAll(a => a.map(x => x.getAttribute('aria-label') || x.title || x.innerText.trim()).filter(Boolean)); }
st.reqs = reqs.slice(0, 20);
return st;
