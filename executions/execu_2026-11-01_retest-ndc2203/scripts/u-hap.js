// Read-only: open Desk Settings, find "Customer Happiness", open it; record the API calls (GET/PUT paths + short bodies) and the page state. Nothing is changed.
const calls = [];
page.on('response', async r => { const u = r.url(); if (/\/api\/v1\//.test(u) && /happiness|setting/i.test(u)) { let t = ''; try { t = (await r.text()).slice(0, 400); } catch (e) { } calls.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^.*\/api\/v1/, '') + ' ' + t); } });
await page.goto(H + '/settings', { waitUntil: 'domcontentloaded', timeout: 150000 }); await sleep(10000);
const link = page.locator('a, button', { hasText: /Customer Happiness|Happiness/i }).first();
const found = await link.count(); if (found) { await link.click(); await sleep(8000); }
await shot('hap-1-settings.png');
const t = await text();
return { found, url: page.url(), page: (t.match(/(Customer Happiness|Happiness)[\s\S]{0,700}/) || [''])[0].replace(/\s+/g, ' ').slice(0, 700), calls };
