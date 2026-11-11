const TID='13676fb2-97f3-4691-b7bd-9311eb605948', A='51e64f8c-13dc-4f96-a1f9-cf0a103ad1ce';
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + TID, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA RT16 2635 ticket/.test(await text()) && /ACTIVIT/i.test(await text())) break; } await sleep(3000);
log('tabs:', await page.locator('[role=tab]').allInnerTexts());
await shot('2635-ticket-tabs.png');
const tab = page.locator('[role=tab]', { hasText: /activit/i }).first(); if (await tab.count()) { await tab.click(); await sleep(4000); await shot('2635-ticket-activity-tab.png'); log('activity tab text:', (await text()).match(/QA RT16 2635 task[\s\S]{0,40}/g)); }
await page.goto(H + '/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/records/' + A, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA RT16 2635 task A/.test(await text())) break; } await sleep(3000);
log('task page buttons:', await page.$$eval('main button, [role=main] button', bs => bs.map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(Boolean)));
await shot('2635-task-page.png');
const more = page.getByRole('button', { name: /more|actions|⋮/i }).first(); if (await more.count()) { await more.click(); await sleep(1500); log('menu:', await page.locator('[role=menuitem]').allInnerTexts()); await shot('2635-task-page-menu.png'); }
