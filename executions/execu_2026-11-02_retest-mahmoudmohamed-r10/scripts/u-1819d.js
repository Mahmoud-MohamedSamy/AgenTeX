// NDC-1819 part D: period list + counts, apply a field filter (Due date Tomorrow), Contacts queue A–Z rail (+ filter together), Manage Queue Category View (Cancel discards), restore columns to default.
const st = {};
const open = async () => {
  await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(4000);
};
const total = async () => ((await text()).match(/Total Records\s*(\d+)/) || [])[1];
await open();
// periods
const pc = page.locator('text=My Open Activities').locator('xpath=following::*[self::button or self::select or @role="combobox"][1]');
st.pcTag = await pc.evaluate(e => e.tagName + ' ' + (e.getAttribute('role') || ''));
if (st.pcTag.startsWith('SELECT')) { st.periods = await pc.evaluate(x => [...x.options].map(o => o.text)); }
else { await pc.click(); await sleep(1500); await shot('1819-d1-periods.png'); st.periods = (await page.getByRole('option').allInnerTexts()).map(x => x.trim()); if (!st.periods.length) st.periods = (await page.locator('[role=listbox],[role=menu]').allInnerTexts()).join('|').split('\n'); await page.keyboard.press('Escape'); }
st.counts = {};
for (const p of ['Tomorrow', 'Next Week', 'Today & Overdue', 'This Month']) {
  const hit = (st.periods || []).find(x => x.toLowerCase().startsWith(p.toLowerCase())); if (!hit) { st.counts[p] = 'not offered'; continue; }
  if (st.pcTag.startsWith('SELECT')) await pc.selectOption({ label: hit }); else { await pc.click(); await sleep(1000); await page.getByRole('option', { name: hit }).first().click().catch(() => page.getByText(hit, { exact: true }).last().click()); }
  await sleep(5000); const t = await text(); st.counts[p] = { rail: (t.match(/Tasks\s*\n?\s*(\d+)/) || [])[1], total: await total() };
  if (p === 'Tomorrow') await shot('1819-d2-tomorrow.png');
}
// back to All open
if (st.pcTag.startsWith('SELECT')) await pc.selectOption({ label: 'All open' }); else { await pc.click(); await sleep(1000); await page.getByText('All open', { exact: true }).last().click(); }
await sleep(4000);
// apply Due date filter = Tomorrow
await page.mouse.click(1530, 143); await sleep(2500);
const fp = page.locator('text=Filter Tasks by').locator('xpath=ancestor::*[.//input][1]');
await fp.getByText('Due date', { exact: true }).first().click(); await sleep(1500);
await fp.locator('select').last().selectOption({ label: 'Tomorrow' }); await sleep(800);
const apply = page.getByRole('button', { name: /Apply Filter|Apply/ }); st.applyBtns = await apply.count(); if (st.applyBtns) await apply.last().click(); await sleep(5000);
st.filterTomorrowTotal = await total(); await shot('1819-d3-filter-tomorrow.png');
const clr = page.getByRole('button', { name: /Clear|Reset/ }); if (await clr.count()) { await clr.first().click(); await sleep(4000); } st.afterClearTotal = await total();
await page.mouse.click(1530, 143); await sleep(1500);
// Contacts queue + A–Z
await page.getByText('Contacts created today', { exact: true }).first().click(); await sleep(8000); await shot('1819-d4-contacts-queue.png');
const t2 = await text(); st.contactsQueue = { total: await total(), rail: /\bA\b[\s\S]{0,40}\bB\b[\s\S]{0,40}\bC\b/.test(t2), hasAll: /\bAll\b/.test(t2) };
// Manage Queue → Category View → Cancel
const gear = page.locator('text=My Work Queues').locator('xpath=following::button[1]'); await gear.click(); await sleep(2500); await shot('1819-d5-manage-queue.png');
st.manageQueue = (await page.getByRole('dialog').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
const cv = page.getByText(/Category View/i).first(); if (await cv.count()) { await cv.click(); await sleep(2000); await shot('1819-d6-category-view.png'); st.mqAfterCategory = (await page.getByRole('dialog').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); st.leftBeforeSave = (await text()).match(/My Work Queues[\s\S]{0,200}/)?.[0].replace(/\s+/g, ' '); const cancel = page.getByRole('dialog').getByRole('button', { name: 'Cancel' }); if (await cancel.count()) await cancel.click(); await sleep(2000); st.leftAfterCancel = (await text()).match(/My Work Queues[\s\S]{0,200}/)?.[0].replace(/\s+/g, ' '); }
await page.keyboard.press('Escape');
return st;
