// NDC-1819: header menus of the utility columns (row actions / Add Note on Leads; actions / complete-checkbox on Tasks).
const out = {};
const openML = async () => { await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000); await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500); };
const optBtns = async () => page.locator('main thead button[aria-label^="Column options"]').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label')));
const thInfo = async () => page.locator('main thead th').evaluateAll(ths => ths.slice(0, 3).map(th => ({ text: th.innerText.trim(), aria: th.getAttribute('aria-label'), btns: [...th.querySelectorAll('button')].map(b => b.getAttribute('aria-label') || b.innerText.trim()) })));
await openML();
out.leadsOptionButtons = await optBtns(); out.leadsFirstHeaders = await thInfo();
const first = page.locator('main thead th').first().locator('button').first();
await first.click(); await sleep(900); out.leadsCol1Menu = await page.locator('[role=menu] [role^=menuitem]').allInnerTexts(); await shot('NDC-1819-f-util-col1-menu'); await page.keyboard.press('Escape'); await sleep(500);
const second = page.locator('main thead th').nth(1).locator('button').first();
await second.click(); await sleep(900); out.leadsCol2Menu = await page.locator('[role=menu] [role^=menuitem]').allInnerTexts(); await shot('NDC-1819-f-util-col2-menu'); await page.keyboard.press('Escape'); await sleep(500);
// Tasks
await page.getByRole('button', { name: /^Tasks\b/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500);
out.tasksOptionButtons = await optBtns(); out.tasksFirstHeaders = await thInfo();
await page.locator('main thead th').nth(1).locator('button').first().click(); await sleep(900); out.tasksCol2Menu = await page.locator('[role=menu] [role^=menuitem]').allInnerTexts(); await shot('NDC-1819-f-util-tasks-col2-menu'); await page.keyboard.press('Escape');
return done(out);
