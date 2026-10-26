const readOpts = () => page.evaluate(() => { const c = document.querySelector('[data-radix-popper-content-wrapper], [role=listbox], [role=menu]'); if (!c) return []; return [...new Set([...c.querySelectorAll('[role=option], [role=menuitemcheckbox], [role=menuitem], label, li')].map(e => e.innerText.trim()).filter(Boolean))]; });
const panelText = () => page.evaluate(() => (document.querySelector('[data-radix-popper-content-wrapper]') || {}).innerText || '');
if (!(await page.getByPlaceholder('Search…').count())) { await page.getByRole('button', { name: 'Module', exact: true }).last().click(); await sleep(1200); }
const s = page.getByPlaceholder('Search…').last(); const res = {};
for (const q of ['pipeline', 'review', 'assignment', 'action', 'zzqq']) { await s.fill(q); await sleep(700); res[q] = { opts: await readOpts(), text: (await panelText()).replace(/\n/g, ' | ').slice(0, 120) }; }
await s.fill(''); await sleep(500);
await page.getByText(/^Leads \(\d+\)$/).first().click(); await sleep(1000);
await page.getByRole('button', { name: /^Leads|^Module/ }).filter({ hasNot: page.locator('xx') }).first().click().catch(() => {}); await sleep(1000);
const afterSel = await readOpts(); await shot('1601-01-after-select-leads');
await page.keyboard.press('Escape'); await sleep(400);
const db = page.getByRole('button', { name: 'Deleted by', exact: true }); await db.click(); await sleep(1000); const users = await readOpts(); await shot('1600-01-deleted-by');
await page.keyboard.press('Escape');
return done({ res, afterSelCount: afterSel.length, afterSelSample: afterSel.slice(0, 6), users });
