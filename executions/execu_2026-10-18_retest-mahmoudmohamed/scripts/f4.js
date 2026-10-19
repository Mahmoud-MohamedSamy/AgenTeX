// NDC-1819 functional pass C: Wrap vs Clip on a narrowed column, Reset Column Size, Manage Columns Show Phone, restore 10 rows.
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
  for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000);
  await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500); };
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean);
const ts = async label => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: label }).first().click(); await sleep(2000); };
const drag = async (name, dx) => { const b = await page.getByRole('separator', { name: 'Resize column: ' + name }).boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + dx, b.y + b.height / 2, { steps: 8 }); await page.mouse.up(); await sleep(1500); };
const meas = async () => page.locator('main tbody tr').first().evaluate(r => { const tds = [...r.children]; const c = tds.find(td => /\d\d\/\d\d\/\d{4}/.test(td.innerText)); const inner = c && (c.querySelector('span,div,p') || c); return { rowH: Math.round(r.getBoundingClientRect().height), cellLines: c ? c.innerText.split('\n').length : -1, overflow: inner ? getComputedStyle(inner).textOverflow + '/' + getComputedStyle(inner).whiteSpace + '/' + getComputedStyle(inner).overflow : '', clipped: inner ? inner.scrollWidth > inner.clientWidth : null }; });
await openML();
await drag('Created At', -60); out.createdW = Math.round((await page.locator('main thead th', { hasText: 'Created At' }).first().boundingBox()).width);
await ts('Wrap Text'); out.wrap = await meas(); await shot('NDC-1819-f-wrap');
await ts('Clip Text'); out.clip = await meas(); await shot('NDC-1819-f-clip');
// Reset Column Size restores both resized columns
await ts('Reset Column Size'); out.afterReset = { status: Math.round((await page.locator('main thead th', { hasText: 'Lead Status' }).first().boundingBox()).width), created: Math.round((await page.locator('main thead th', { hasText: 'Created At' }).first().boundingBox()).width) };
// Manage Columns: Show Phone
await ts('Manage Columns'); const dlg = page.locator('[role=dialog]').last();
const row = dlg.locator('li, [role=listitem], div', { hasText: /^Phone\s*Show$/ }).last(); out.phoneRow = await row.count();
if (out.phoneRow) await row.getByRole('button', { name: /Show/ }).click(); else await dlg.getByRole('button', { name: /Show Phone|Show/ }).nth(5).click();
await sleep(600); out.mcAfter = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 400);
await dlg.getByRole('button', { name: 'Apply' }).click(); await sleep(2500); out.heads = await heads();
// back to 10 rows
await page.locator('main select').last().selectOption('10'); await sleep(2500); out.rows = await page.locator('main tbody tr').count();
return done(out);
