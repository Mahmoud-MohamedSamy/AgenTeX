await page.goto(H + '/activities', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Add Activity/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: 'Search in this view' }).click(); await sleep(800);
await page.keyboard.type('QA RT16 2635 task'); await page.keyboard.press('Enter'); await sleep(6000);
const info = await page.$$eval('input[type=checkbox]', cs => cs.map(c => ({ al: c.getAttribute('aria-label'), row: (c.closest('li,tr,[role=row],a,div[class]')||c.parentElement).innerText.slice(0, 60) })));
log(info);
const cbs = page.locator('input[type=checkbox]');
for (let i = 0; i < await cbs.count(); i++) { const t = info[i].al + ' ' + info[i].row; if (/task [BC]/.test(t)) await cbs.nth(i).check({ force: true }); }
await sleep(1500); log('bar:', (await text()).match(/selected[\s\S]{0,160}/));
await shot('2635-bulk-bar.png');
await page.getByRole("button", { name: "More", exact: true }).last().click(); await sleep(1500); log("more menu:", await page.locator("[role=menuitem]").allInnerTexts(), (await text()).slice(-300)); await shot("2635-bulk-more.png");
const del = page.getByRole("menuitem", { name: /Delete/ }).first(); log("delete item", await del.count());
if (await del.count()) { await del.click(); await sleep(1500); log('confirm:', (await page.locator('[role=alertdialog],[role=dialog]').last().innerText().catch(() => '')).slice(0, 300)); await shot('2635-bulk-confirm.png');
  await page.locator('[role=alertdialog],[role=dialog]').last().getByRole('button', { name: /delete/i }).last().click(); await sleep(5000); await shot('2635-bulk-after.png'); log('after rows:', ((await text()).match(/QA RT16 2635 task [ABC]/g) || [])); }
