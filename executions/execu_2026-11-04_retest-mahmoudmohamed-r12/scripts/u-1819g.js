// NDC-1819 r12: related-module filter — panel Clear (+Apply), Clear filters, reload persistence. Each step guarded so one miss doesn't stop the rest.
const st = {}; const reqs = []; require(require('path').join(process.cwd(), 'hook.js'))(page, reqs);
const total = async () => ((await text()).match(/Total Records\s*([\d,]+)/) || [])[1];
const waitTotal = async (prev) => { for (let i = 0; i < 20; i++) { await sleep(1500); const t = await total(); if (t && t !== prev) return t; } return await total(); };
const step = async (k, f) => { try { st[k] = await f(); } catch (e) { st[k] = 'ERR ' + e.message.split('\n')[0].slice(0, 120); } };
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(3000);
await page.getByRole('button', { name: 'My Leads, 51 records' }).first().click(); await sleep(9000);
const sel = page.locator('select').filter({ hasText: 'With any Tasks' });
const applyWith = async () => { if (!(await page.getByText('Filter Leads by').count())) { await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(2000); }
  if (!(await sel.count())) { await page.locator('text=FILTER BY RELATED MODULES').locator('xpath=following::*[normalize-space(text())="Tasks"][1]').click(); await sleep(1200); }
  const before = await total(); await sel.selectOption({ label: 'With any Tasks' }); await sleep(600); await page.getByRole('button', { name: 'Apply Filter' }).click(); return waitTotal(before); };
await step('with1', applyWith); await shot('1819-g1-with.png');
await step('panelClear', async () => { await page.getByRole('button', { name: 'Clear', exact: true }).last().click(); await sleep(3000); return { total: await total(), sel: await sel.count() ? await sel.inputValue() : 'collapsed' }; });
await step('panelClearApply', async () => { await page.getByRole('button', { name: 'Apply Filter' }).click(); const t = await waitTotal('4'); await shot('1819-g2-clear-apply.png'); return t; });
await step('with2', applyWith);
await step('clearFilters', async () => { const cf = page.getByRole('button', { name: /Clear filters/ }); await cf.first().click(); const t = await waitTotal('4'); await shot('1819-g3-clear-filters.png'); return t; });
await step('with3', applyWith);
await step('afterReload', async () => { await page.reload({ waitUntil: 'commit' }); for (let i = 0; i < 50; i++) { await sleep(3000); const t = await text(); if (/Total Records\s*\d/.test(t)) break; } await sleep(4000); await shot('1819-g4-reload.png'); return total(); });
await step('cleanup', async () => { const cf = page.getByRole('button', { name: /Clear filters/ }); if (await cf.count()) { await cf.first().click(); await sleep(4000); } return total(); });
st.reqs = reqs.filter(x => /records\?/.test(x)).map(x => x.replace(/^.*total=(\d*).*filters=/, 't=$1 ')).slice(-10); return st;
