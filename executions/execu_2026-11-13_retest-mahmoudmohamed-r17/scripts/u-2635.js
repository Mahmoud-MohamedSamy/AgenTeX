const I = JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-13_retest-mahmoudmohamed-r17/out/ids.json', 'utf8')).A35;
await page.goto(H + '/views/all/tickets/' + I.ticket, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA RT17 2635 ticket/.test(await text())) break; } await sleep(4000);
const t = await text(); log('tabs', (t.match(/\d*\s*(CONVERSATION|TIME ENTRY|ACTIVITY|ACTIVITIES|HISTORY|RESOLUTION|APPROVAL)[^\n]*/gi) || []).slice(0, 8));
await shot('2635-ticket-tabs.png');
const tabA = page.locator('[role=tab]', { hasText: /activit/i }).first(); if (await tabA.count()) { await tabA.click(); await sleep(4000); await shot('2635-ticket-activity-tab.png'); log('activity tab rows', (await text()).match(/QA RT17 2635 task [A-C]/g)); }
await page.goto(H + '/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/records/' + I.tasks[0], { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA RT17 2635 task A/.test(await text())) break; } await sleep(3000);
log('task url', page.url());
const btns = await page.$$eval('main button, [role=main] button, header button', bs => bs.map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(Boolean));
log('task page buttons', [...new Set(btns)].slice(0, 40));
await shot('2635-task-page.png');
const more = page.locator('button[aria-label*="More" i], button[aria-label*="actions" i], button:has-text("•••"), button:has-text("⋯")').first();
if (await more.count()) { await more.click(); await sleep(1200); log('more menu', await page.locator('[role=menuitem]').allInnerTexts()); await shot('2635-task-more.png'); await page.keyboard.press('Escape'); }
log('has Delete text', /\bDelete\b/.test(await text()));
