// NDC-1819: reproduce — a column hidden from the header menu cannot be shown again from Manage Columns. Then restore Company + Phone.
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000); await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500); };
const heads = async () => (await page.locator('main thead th').allInnerTexts()).map(s => s.trim()).filter(Boolean).join(', ');
const mc = async () => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: 'Manage Columns' }).first().click(); await sleep(1500); return page.locator('[role=dialog]').last(); };
const dis = async d => d.locator('button').evaluateAll(bs => bs.filter(b => b.disabled).map(b => b.getAttribute('aria-label')));
const hideFromHeader = async c => { await page.getByRole('button', { name: 'Column options: ' + c }).click(); await sleep(800); await page.getByRole('menuitem', { name: /Hide column/ }).click(); await sleep(2500); };
await openML();
let d = await mc(); await d.getByRole('button', { name: 'Show Company column' }).click(); await sleep(400); out.disBeforeApply = await dis(d); await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2500); out.start = await heads();
await hideFromHeader('Lead Status'); out.afterHeaderHide = await heads();
d = await mc(); out.disabledAfterHeaderHide = await dis(d); out.mcText = (await d.innerText()).replace(/\n+/g, ' | ').slice(0, 420); await shot('NDC-1819-f-mc-show-disabled');
const sb = d.getByRole('button', { name: 'Show Lead Status column' }); out.showLeadStatusDisabled = await sb.isDisabled();
if (!out.showLeadStatusDisabled) { await sb.click(); await sleep(400); await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2500); }
else { await d.getByRole('button', { name: 'Cancel' }).click(); await sleep(800); }
out.afterTry = await heads();
await openML(); out.afterReload = await heads(); d = await mc(); out.disabledAfterReload = await dis(d); await d.getByRole('button', { name: 'Cancel' }).click(); await sleep(800);
return done(out);
