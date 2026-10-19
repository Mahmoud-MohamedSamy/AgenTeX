// NDC-1819: evidence — Phone hidden from its header menu → "Show" disabled in Manage Columns; then restore (reset + show Company).
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000); await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500); };
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean).join(', ');
const mc = async () => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: 'Manage Columns' }).first().click(); await sleep(1500); return page.locator('[role=dialog]').last(); };
await openML();
await page.getByRole('button', { name: 'Column options: Phone' }).click(); await sleep(800); await shot('NDC-1819-f-phone-header-hide'); await page.getByRole('menuitem', { name: /Hide column/ }).click(); await sleep(2500);
out.afterHide = await heads();
let d = await mc(); out.phoneShowDisabled = await d.getByRole('button', { name: 'Show Phone column' }).isDisabled(); out.phoneHideDisabledNote = 'Full Name/Phone hide buttons are disabled when visible';
await shot('NDC-1819-f-mc-show-disabled');
await d.getByRole('button', { name: 'Reset to default columns' }).click(); await sleep(600); await d.getByRole('button', { name: 'Show Company column' }).click(); await sleep(400); await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2500);
out.restored = await heads();
return done(out);
