// NDC-1819: Manage Columns Show/Hide works for Email; does "Reset to default columns" bring Phone back?
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000); await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500); };
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean).join(', ');
const mc = async () => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: 'Manage Columns' }).first().click(); await sleep(1500); return page.locator('[role=dialog]').last(); };
await openML();
let d = await mc(); await d.getByRole('button', { name: 'Show Email column' }).click(); await sleep(500); await shot('NDC-1819-f-mc-show-email'); await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2500); out.afterShowEmail = await heads();
await openML(); out.emailAfterReload = await heads();
d = await mc(); await d.getByRole('button', { name: 'Hide Email column' }).click(); await sleep(500); await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2500); out.afterHideEmail = await heads();
d = await mc(); await d.getByRole('button', { name: 'Reset to default columns' }).click(); await sleep(1000); out.afterResetDlg = (await d.innerText()).replace(/\n+/g, ' | ').slice(0, 400);
await shot('NDC-1819-f-mc-reset');
const ap = d.getByRole('button', { name: 'Apply' }); if (await ap.count()) { await ap.click(); await sleep(2500); }
out.afterReset = await heads();
await openML(); out.afterResetReload = await heads();
return done(out);
