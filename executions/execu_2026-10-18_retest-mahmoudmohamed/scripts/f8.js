// NDC-1819: restore My Leads columns (reset + show Company), Full Name header menu items, and a Tasks sample for the period check.
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000); await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500); };
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean).join(', ');
const mc = async () => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: 'Manage Columns' }).first().click(); await sleep(1500); return page.locator('[role=dialog]').last(); };
await openML();
let d = await mc(); await d.getByRole('button', { name: 'Reset to default columns' }).click(); await sleep(600); await d.getByRole('button', { name: 'Show Company column' }).click(); await sleep(400); await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2500);
out.restored = await heads();
await page.getByRole('button', { name: 'Column options: Full Name' }).click(); await sleep(800);
out.fullNameMenu = await page.locator('[role=menu] [role^=menuitem]').evaluateAll(es => es.map(e => e.innerText.trim() + (e.getAttribute('aria-disabled') === 'true' || e.disabled ? ' [disabled]' : '')));
await shot('NDC-1819-f-fullname-menu'); await page.keyboard.press('Escape'); await sleep(400);
await page.getByRole('button', { name: 'Column options: Phone' }).click(); await sleep(800);
out.phoneMenu = await page.locator('[role=menu] [role^=menuitem]').evaluateAll(es => es.map(e => e.innerText.trim() + (e.getAttribute('aria-disabled') === 'true' || e.disabled ? ' [disabled]' : '')));
await page.keyboard.press('Escape');
const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
const r = await api('GET', '/modules/' + T + '/records?page=1&per_page=2'); out.taskSample = JSON.stringify(arr(r.j && r.j.data)[0]).slice(0, 1500); out.taskTotal = r.j && (r.j.meta || r.j.pagination) && JSON.stringify(r.j.meta || r.j.pagination).slice(0, 200);
return done(out);
