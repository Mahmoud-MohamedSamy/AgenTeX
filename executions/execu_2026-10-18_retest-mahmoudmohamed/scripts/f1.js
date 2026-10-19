// NDC-1819 functional pass A (19 Oct): My Leads — column menu sort/hide, records per page, wrap/clip, resize persistence.
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000);
  await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && !(await page.locator('main tbody tr').count()); i++) await sleep(1000); await sleep(1500); };
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean);
const col = async name => { const h = await page.locator('main thead th').allInnerTexts(); const i = h.findIndex(s => s.trim() === name); if (i < 0) return []; return (await page.locator('main tbody tr').evaluateAll((rs, i) => rs.map(r => (r.children[i] && r.children[i].innerText || '').trim()), i)); };
const rows = async () => page.locator('main tbody tr').count();
const lp = async () => { const r = await api('GET', '/workqueue/queues'); return r.s; };
const menuItem = async (colName, item) => { await page.getByRole('button', { name: 'Column options: ' + colName }).click(); await sleep(800); const m = page.getByRole('menuitem', { name: item }); out['has_' + colName + '_' + item] = await m.count(); if (await m.count()) await m.first().click(); else await page.keyboard.press('Escape'); await sleep(2500); };
await openML();
out.heads0 = await heads(); out.rows0 = await rows(); out.total = ((await txt()).match(/Total Records\s*\d+/) || [''])[0];
// Sort via column menu
await menuItem('Full Name', /ascending/i); out.nameAsc = await col('Full Name'); await shot('NDC-1819-f-sort-asc');
await menuItem('Full Name', /descending/i); out.nameDesc = await col('Full Name'); await shot('NDC-1819-f-sort-desc');
await menuItem('Created At', /descending/i); out.createdDesc = await col('Created At');
// Hide column, then reload
await menuItem('Phone', /hide/i); out.headsAfterHide = await heads(); await shot('NDC-1819-f-hide-phone');
await openML(); out.headsAfterReload = await heads();
// Records per page
const rpp = page.getByRole('combobox', { name: /rows per page/i }).first(); out.rppCombo = await rpp.count();
if (!out.rppCombo) { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); out.tsMenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\n+/g, ' | '); await page.keyboard.press('Escape'); }
out.url = page.url();
return done(out);
