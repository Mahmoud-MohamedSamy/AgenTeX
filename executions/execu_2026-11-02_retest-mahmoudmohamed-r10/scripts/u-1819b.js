// NDC-1819 part B (behaviour): header menu sort / pin / hide (+ reload), Manage Columns search + × + pin, resize + Reset Column Size, Clip Text at min width, row menu, period list + counts, filter search + ×, Related Modules group, field-type conditions.
const st = {};
const open = async () => {
  await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(4000);
};
const heads = async () => (await page.locator('table thead th').allInnerTexts()).map(x => x.trim()).filter(Boolean);
const col = name => page.locator('table thead th').filter({ has: page.getByText(name, { exact: true }) }).first();
const menu = async name => { const th = col(name); await th.hover(); await sleep(500); await th.locator('button').last().click(); await sleep(1200); };
const item = async label => { await page.getByText(label, { exact: true }).last().click(); await sleep(2500); };
const firstCol = async name => { const i = (await page.locator('table thead th').allInnerTexts()).map(x => x.trim()).indexOf(name); return (await page.locator('table tbody tr').evaluateAll((rs, i) => rs.map(r => (r.children[i] && r.children[i].innerText || '').trim()), i)); };
await open();
st.cols0 = await heads();
// 1. header click does not sort; menu sort does
const before = await firstCol('Subject');
await col('Subject').locator('span, div').first().click().catch(() => {}); await sleep(2500);
st.headerClickSorts = JSON.stringify(await firstCol('Subject')) !== JSON.stringify(before);
await menu('Subject'); await shot('1819-b1-menu.png'); st.menuItems = (await page.getByRole('menuitem').allInnerTexts()).map(x => x.trim()); await item('Sort descending');
const desc = await firstCol('Subject'); st.descOk = JSON.stringify(desc) === JSON.stringify([...desc].sort((a, b) => b.localeCompare(a))); st.desc = desc.map(x => x.slice(0, 18));
await menu('Subject'); await item('Sort ascending'); const asc = await firstCol('Subject'); st.ascOk = JSON.stringify(asc) === JSON.stringify([...asc].sort((a, b) => a.localeCompare(b)));
// 2. pin Status
await menu('Status'); await item('Pin column'); await shot('1819-b2-pinned.png'); st.afterPin = await heads();
st.pinnedSticky = await col('Status').evaluate(e => getComputedStyle(e).position);
// 3. hide Priority, reload, bring back via Manage Columns
await menu('Priority'); await item('Hide column'); st.afterHide = await heads();
await open(); st.afterReload = await heads(); await shot('1819-b3-after-reload.png');
await page.mouse.click(1562, 143); await sleep(1500); await shot('1819-b3b-settings.png'); await page.getByText('Manage Columns', { exact: true }).last().click(); await sleep(2500);
const dlg = page.locator('text=Manage Columns').locator('xpath=ancestor::*[.//button[normalize-space()="Apply"]][1]');
await dlg.getByPlaceholder(/Search columns/i).fill('Prio'); await sleep(1200); await shot('1819-b4-mc-search.png');
st.mcSearch = (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 300);
st.mcClearBtn = await dlg.getByRole('button', { name: /clear/i }).count();
if (st.mcClearBtn) { await dlg.getByRole('button', { name: /clear/i }).first().click(); await sleep(800); st.mcAfterClear = await dlg.getByPlaceholder(/Search columns/i).inputValue(); }
await dlg.getByPlaceholder(/Search columns/i).fill(''); await sleep(800);
const pr = dlg.locator('div').filter({ hasText: /^Priority/ }).last(); await pr.getByRole('button', { name: 'Show' }).click().catch(e => st.showErr = String(e).slice(0, 80)); await sleep(800);
await dlg.getByRole('button', { name: 'Apply' }).click(); await sleep(3000); st.afterShow = await heads(); await shot('1819-b5-after-show.png');
return st;
