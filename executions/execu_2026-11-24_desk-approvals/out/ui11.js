// Part 1: change B's locale (capture the save request), check /approvals in Arabic with new formats.
const o = { saves: [] };
page.on('request', r => { if (['PUT', 'PATCH', 'POST'].includes(r.method()) && /\/api\/v1\//.test(r.url()) && !/notifications\/read|heartbeat|presence|telemetry|events/.test(r.url())) o.saves.push(r.method() + ' ' + r.url().replace(H, '') + ' ' + (r.postData() || '').slice(0, 400)); });
await go('/settings/personal/locale'); await sleep(5000);
const main = page.locator('main').first(); const sel = main.locator('select');
o.before = await sel.evaluateAll(es => es.map(e => e.value));
o.tzBefore = await main.getByPlaceholder(/time zone/i).first().inputValue().catch(() => 'n/a');
await sel.nth(2).selectOption('YYYY-MM-DD'); await sel.nth(3).selectOption('12h');
const tz = main.getByPlaceholder(/time zone/i).first();
if (await tz.count()) { await tz.click(); await tz.fill('Dubai'); await sleep(1500); const opt = page.getByRole('option', { name: /Dubai/ }).first(); if (await opt.count()) await opt.click(); else await page.getByText(/Asia\/Dubai|Dubai/).first().click().catch(() => {}); await sleep(800); }
await sel.nth(0).selectOption('ar'); await sleep(1000);
await shot('ui11-B-locale-changed');
const save = main.getByRole('button', { name: /Save changes|حفظ/ }).first(); await save.click(); await sleep(4000);
o.afterSaveText = (await main.innerText().catch(() => '')).slice(-300);
await go('/approvals'); await sleep(6000);
o.dir = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
o.lang = await page.evaluate(() => document.documentElement.lang);
o.pageText = (await page.locator('[data-testid="approvals-page"]').innerText().catch(() => '')).slice(0, 1400);
o.dateSamples = (o.pageText.match(/\d{4}-\d{2}-\d{2}[^\n\t]{0,12}|\d{2}\/\d{2}\/\d{4}[^\n\t]{0,12}/g) || []).slice(0, 4);
o.hasArabicLabels = /[؀-ۿ]{3,}/.test(o.pageText.replace(/QA PA[^\n]*/g, ''));
o.englishLeft = (o.pageText.replace(/QA PA[^\n]*/g, '').match(/\b(Approvals|Waiting for me|Requested by me|Decided by me|Approve|Reject|Source|Overdue|Pending|Manual|Web form|Blueprint)\b/g) || []);
await shot('ui11-B-approvals-ar');
await page.setViewportSize({ width: 400, height: 860 }); await go('/approvals'); await sleep(4000); o.phoneScrollX = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); await shot('ui11-B-approvals-ar-phone');
return o;
