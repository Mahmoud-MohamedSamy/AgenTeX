const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const res = {};
await page.goto(H + '/views/all/tickets/157e7204-0030-4208-98c6-4106d07a320e', { waitUntil: 'domcontentloaded' });
await page.getByText(/QA BP RT19/).first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(4000);
await page.getByRole('tab', { name: /History/i }).first().click().catch(async () => page.getByText(/^History$/).first().click()); await sleep(5000);
const auto = page.getByText(/Moved by QA BP RT19 D3 3066 cont automatically/).nth(1); await auto.scrollIntoViewIfNeeded(); await page.evaluate(() => {}); await sleep(800);
await auto.evaluate(e => e.scrollIntoView({ block: 'start' })); await sleep(1000);
await page.screenshot({ path: RAW + '3066-5-4699-history-auto.png' });
// 3070: Active switch on list sends revision (request blocked)
const seen = [];
await ctx.route(/\/api\/v1\/modules\/[^/]+\/blueprints\/ff6ef3d5[^?]*/, async r => { const m = r.request().method(); if (m === 'GET') return r.continue(); seen.push({ m, url: r.request().url().split('/api/v1')[1], body: (r.request().postData() || '').slice(0, 300).replace(/"definition":\{.*\}(,|$)/, '"definition":{…}$1'), hasRev: /"revision"\s*:\s*\d+/.test(r.request().postData() || ''), rev: ((r.request().postData() || '').match(/"revision"\s*:\s*(\d+)/) || [])[1] }); await r.abort(); });
await page.goto(H + '/settings/automation/blueprints', { waitUntil: 'domcontentloaded' }); await sleep(10000);
const row = page.locator('tr, [role=row], li, div').filter({ hasText: 'QA BP RT19 D3 3070 renamed by A' }).last();
await row.scrollIntoViewIfNeeded().catch(() => {});
res.rowText = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
const sw = row.getByRole('switch').first(); res.swCount = await row.getByRole('switch').count();
await page.screenshot({ path: RAW + '3070-1-list-before.png' });
if (res.swCount) { await sw.click(); await sleep(4000); }
await page.screenshot({ path: RAW + '3070-2-list-switch-blocked.png' });
res.seen = seen; res.after = (await text()).replace(/\s+/g, ' ').match(/.{0,120}(error|failed|could not|Couldn).{0,120}/i)?.[0] || '';
return res;
