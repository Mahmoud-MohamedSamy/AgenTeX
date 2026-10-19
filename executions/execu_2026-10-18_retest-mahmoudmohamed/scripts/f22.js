// NDC-1819: hide the Add Note utility column on My Leads — effect, reload, Manage Columns, and recovery (reset + show Company).
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000); await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500); };
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean).join(', ');
const mc = async () => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: 'Manage Columns' }).first().click(); await sleep(1500); return page.locator('[role=dialog]').last(); };
await openML();
await page.locator('main thead th').nth(0).locator('button').first().click(); await sleep(800); await shot('NDC-1819-f-util-col1-menu'); await page.getByRole('menuitem', { name: /Hide column/ }).click(); await sleep(2500);
out.afterHide = await heads(); await page.locator('main tbody tr').first().hover(); await sleep(600);
out.rowButtons = await page.locator('main tbody tr').first().locator('button').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label') || b.innerText.trim()));
await shot('NDC-1819-f-util-rowactions-hidden');
await openML(); out.afterReload = await heads();
let d = await mc(); out.mcText = (await d.innerText()).replace(/\n+/g, ' | ').slice(0, 450); out.mcMentionsAddNote = /Add Note/.test(out.mcText); await shot('NDC-1819-f-util-mc');
await d.getByRole('button', { name: 'Reset to default columns' }).click(); await sleep(600); await d.getByRole('button', { name: 'Show Company column' }).click(); await sleep(400); await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2500);
out.afterReset = await heads();
return done(out);
