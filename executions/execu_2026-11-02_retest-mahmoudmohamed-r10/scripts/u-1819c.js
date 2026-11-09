// NDC-1819 part C: restore pin/order, filter panel (search ×, Related Modules group, options per field type), periods list + counts, row menu, Reset Column Size, Clip Text at min width.
const st = {};
const open = async () => {
  await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(4000);
};
const heads = async () => (await page.locator('table thead th').allInnerTexts()).map(x => x.trim()).filter(Boolean);
const col = name => page.locator('table thead th').filter({ has: page.getByText(name, { exact: true }) }).first();
const menu = async name => { const th = col(name); await th.hover(); await sleep(500); await th.locator('button').last().click(); await sleep(1200); };
const item = async label => { await page.getByText(label, { exact: true }).last().click(); await sleep(2500); };
await open();
// restore: unpin Status
await menu('Status'); st.statusMenu = (await page.locator('[role=menu]').allInnerTexts().catch(() => [])).join(' ').replace(/\s+/g, ' ');
if (/Unpin/i.test(st.statusMenu)) await item('Unpin column'); else await page.keyboard.press('Escape');
st.afterUnpin = await heads();
// filter panel
await page.mouse.click(1530, 143); await sleep(2500);
const fp = page.locator('text=Filter Tasks by').locator('xpath=ancestor::*[.//input][1]');
await fp.getByPlaceholder(/Search filters/i).fill('Due'); await sleep(1200); await shot('1819-c1-filter-search.png');
st.filterSearch = (await fp.innerText()).replace(/\s+/g, ' ').slice(0, 200);
st.filterClear = await fp.getByRole('button', { name: /clear/i }).count();
if (st.filterClear) { await fp.getByRole('button', { name: /clear/i }).first().click(); await sleep(800); st.filterAfterClear = await fp.getByPlaceholder(/Search filters/i).inputValue(); }
st.groups = ((await fp.innerText()).match(/SYSTEM DEFINED FILTERS|FIELDS|RELATED MODULES|FILTER BY RELATED MODULES|RELATED/g) || []);
// option sets per type: Due date (date), Subject (text), Status (pick list)
for (const f of ['Due date', 'Subject', 'Status']) {
  await fp.getByText(f, { exact: true }).first().click(); await sleep(1500);
  const sel = fp.locator('select').last(); st['ops_' + f] = (await sel.count()) ? await sel.evaluate(x => [...x.options].map(o => o.text).join('|')) : (await fp.innerText()).replace(/\s+/g, ' ').slice(0, 300);
  await shot('1819-c2-' + f.replace(' ', '') + '.png');
  await fp.getByText(f, { exact: true }).first().click(); await sleep(800);
}
// scroll to bottom of the filter list for related modules
await fp.hover(); for (let k = 0; k < 6; k++) { await page.mouse.wheel(0, 600); await sleep(400); } await shot('1819-c3-filter-bottom.png');
st.filterBottom = (await fp.innerText()).replace(/\s+/g, ' ').slice(-400);
await page.mouse.click(1530, 143); await sleep(1500);
// periods
await page.locator('text=My Open Activities').locator('xpath=following::select[1]').evaluate(x => [...x.options].map(o => o.text)).then(v => st.periods = v).catch(async () => {
  await page.getByText('All open', { exact: true }).first().click(); await sleep(1500); st.periods = (await page.getByRole('option').allInnerTexts()).map(x => x.trim()); await shot('1819-c4-periods.png'); await page.keyboard.press('Escape'); });
// row menu
const row = page.locator('table tbody tr').first(); await row.hover(); await row.locator('button').first().click(); await sleep(1500); await shot('1819-c5-row-menu.png');
st.rowMenu = (await page.locator('[role=menu]').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' '); await page.keyboard.press('Escape');
// column resize: drag Due date border narrow, Clip Text; check label + cell clip; then Reset Column Size
await page.mouse.click(1562, 143); await sleep(1200); st.resetDisabledBefore = await page.getByText('Reset Column Size', { exact: true }).last().evaluate(e => !!(e.closest('[aria-disabled=true],[data-disabled],button:disabled'))).catch(() => 'n/a');
await page.getByText('Clip Text', { exact: true }).last().click(); await sleep(1500);
const th = col('Due date'); const b = await th.boundingBox();
await page.mouse.move(b.x + b.width - 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + 10, b.y + b.height / 2, { steps: 10 }); await page.mouse.up(); await sleep(1500);
st.minWidth = (await th.boundingBox()).width; await shot('1819-c6-min-width-clip.png');
st.minHeaderVisible = await th.evaluate(e => { const s = [...e.querySelectorAll('span,div')].find(x => x.innerText.trim() === 'Due date'); return s ? s.scrollWidth <= s.clientWidth + 1 || getComputedStyle(s).textOverflow : 'none'; });
st.cellOverflow = await page.locator('table tbody tr').first().evaluate((r, i) => { const c = r.children[i]; return c ? { sw: c.scrollWidth, cw: c.clientWidth, ws: getComputedStyle(c.firstElementChild || c).whiteSpace, to: getComputedStyle(c.firstElementChild || c).textOverflow } : null; }, (await heads()).indexOf('Due date'));
await page.mouse.click(1562, 143); await sleep(1200); st.resetDisabledAfter = await page.getByText('Reset Column Size', { exact: true }).last().evaluate(e => !!(e.closest('[aria-disabled=true],[data-disabled],button:disabled'))).catch(() => 'n/a');
await page.getByText('Reset Column Size', { exact: true }).last().click(); await sleep(1500); st.widthAfterReset = (await col('Due date').boundingBox()).width;
await page.mouse.click(1562, 143); await sleep(1000); await page.getByText('Wrap Text', { exact: true }).last().click(); await sleep(1000);
st.final = await heads(); await shot('1819-c7-final.png');
return st;
