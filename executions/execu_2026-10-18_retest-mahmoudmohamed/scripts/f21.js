// NDC-1819: at minimum width, does a truncated cell show its full value (title / tooltip) on hover? Then Reset Column Size.
const out = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500);
const ts = async label => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: label }).first().click(); await sleep(1800); };
const drag = async (name, dx) => { const b = await page.getByRole('separator', { name: 'Resize column: ' + name }).boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + dx, b.y + b.height / 2, { steps: 15 }); await page.mouse.up(); await sleep(1200); };
for (const c of ['Full Name', 'Lead Owner']) await drag(c, -600);
const cell = page.locator('main tbody tr').first().locator('td', { hasText: 'QA RT' }).first();
out.titles = await cell.evaluate(td => [td, ...td.querySelectorAll('*')].map(e => e.getAttribute('title')).filter(Boolean));
await cell.hover(); await sleep(1500);
out.tooltip = (await page.locator('[role=tooltip]').allInnerTexts().catch(() => [])).join(' | ');
await shot('NDC-1819-f-width-min-hover');
await ts('Reset Column Size');
return done(out);
