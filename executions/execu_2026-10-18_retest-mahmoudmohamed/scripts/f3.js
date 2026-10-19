// NDC-1819 functional pass B (19 Oct): sort via column menu, Manage Columns search/show, records per page, wrap/clip, resize persistence.
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000);
  await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500); };
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean);
const col = async name => { const h = await page.locator('main thead th').allInnerTexts(); const i = h.findIndex(s => s.trim() === name); if (i < 0) return []; return page.locator('main tbody tr').evaluateAll((rs, i) => rs.map(r => (r.children[i] && r.children[i].innerText || '').trim().replace(/\s+/g, ' ')), i); };
const sortBy = async (c, dir) => { await page.getByRole('button', { name: 'Column options: ' + c }).click(); await sleep(800); await page.getByRole('menuitemradio', { name: 'Sort ' + dir }).click(); await sleep(3500); };
const sorted = (a, cmp) => a.every((x, i) => i === 0 || cmp(a[i - 1], x) <= 0);
const dt = s => { const m = s.match(/(\d\d)\/(\d\d)\/(\d{4}) (\d+):(\d\d) (AM|PM)/); if (!m) return 0; let h = +m[4] % 12 + (m[6] === 'PM' ? 12 : 0); return Date.UTC(+m[3], +m[2] - 1, +m[1], h, +m[5]); };
await openML();
await sortBy('Full Name', 'ascending'); out.asc = await col('Full Name'); out.ascOk = sorted(out.asc, (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })); await shot('NDC-1819-f-sort-asc');
await sortBy('Full Name', 'descending'); out.desc = await col('Full Name'); out.descOk = sorted(out.desc, (a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' })); await shot('NDC-1819-f-sort-desc');
await sortBy('Created At', 'ascending'); out.cAsc = (await col('Created At')).slice(0, 4); out.cAscOk = sorted(await col('Created At'), (a, b) => dt(a) - dt(b));
await page.getByRole('button', { name: 'Column options: Created At' }).click(); await sleep(800);
out.checkedAfterSort = await page.locator('[role=menuitemradio][aria-checked=true]').allInnerTexts(); await page.keyboard.press('Escape'); await sleep(500);
await openML(); out.sortAfterReload = (await col('Created At')).slice(0, 4);
// Manage Columns: search, then show Phone again
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.getByRole('menuitem', { name: 'Manage Columns' }).click(); await sleep(1500);
const dlg = page.locator('[role=dialog]').last(); const s = dlg.locator('input[type=search], input[placeholder*="earch"]').first();
out.mcAll = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 500);
await s.fill('pho'); await sleep(800); out.mcFiltered = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 300);
const ph = dlg.getByRole('checkbox', { name: /Phone/ }).first(); out.phoneCb = await ph.count(); if (out.phoneCb) { out.phoneChecked = await ph.isChecked().catch(() => 'n/a'); if (out.phoneChecked === false) { await ph.click(); await sleep(500); } }
await shot('NDC-1819-f-manage-columns');
const clr = dlg.getByRole('button', { name: /Clear search/i }); out.clear = await clr.count(); if (out.clear) { await clr.click(); await sleep(600); out.afterClear = await s.inputValue(); }
const ap = dlg.getByRole('button', { name: /^(Apply|Save|Done)$/ }); out.applyBtn = await ap.allInnerTexts(); if (await ap.count()) await ap.first().click(); await sleep(2500);
out.headsAfterManage = await heads();
// Records per page
const rpp = page.locator('main select').last();
await rpp.selectOption('25'); await sleep(3500); out.rows25 = await page.locator('main tbody tr').count();
out.pager25 = ((await txt()).match(/\d+–\d+ of \d+/) || [''])[0];
await openML(); out.rowsAfterReload = await page.locator('main tbody tr').count();
// Wrap / Clip
const ws = async () => page.locator('main tbody tr td').nth(4).evaluate(e => { const c = e.querySelector('*') || e; return getComputedStyle(c).whiteSpace + '/' + getComputedStyle(e).whiteSpace; });
out.wsBefore = await ws();
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); out.tsItems = await page.locator('[role=menu] [role^=menuitem]').evaluateAll(es => es.map(e => e.getAttribute('role') + ':' + e.innerText.trim() + ':' + (e.getAttribute('aria-checked') || '')));
const wrap = page.locator('[role=menu] [role^=menuitem]', { hasText: /Wrap/ }).first(); if (await wrap.count()) await wrap.click(); await sleep(1500); out.wsWrap = await ws(); await shot('NDC-1819-f-wrap');
await page.keyboard.press('Escape');
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); const clip = page.locator('[role=menu] [role^=menuitem]', { hasText: /Clip/ }).first(); if (await clip.count()) await clip.click(); await sleep(1500); out.wsClip = await ws(); await page.keyboard.press('Escape');
// Resize persistence
const th = page.locator('main thead th', { hasText: 'Lead Status' }).first(); const w0 = (await th.boundingBox()).width;
const sep = page.getByRole('separator', { name: 'Resize column: Lead Status' }); const b = await sep.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + 100, b.y + b.height / 2, { steps: 8 }); await page.mouse.up(); await sleep(1500);
out.width = [Math.round(w0), Math.round((await th.boundingBox()).width)];
await openML(); out.widthAfterReload = Math.round((await page.locator('main thead th', { hasText: 'Lead Status' }).first().boundingBox()).width); await shot('NDC-1819-f-resize-reload');
return done(out);
