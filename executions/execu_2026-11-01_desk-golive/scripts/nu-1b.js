const tk = IDS.base; const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket edited/, 90); await sleep(2000);
const hist = page.locator('[role=tab]', { hasText: /HISTORY/i }).first(); await hist.click().catch(() => {}); await sleep(5000);
for (let i = 0; i < 15; i++) { await page.mouse.move(700, 500); await page.mouse.wheel(0, 2500); await sleep(700); }
const th = await txt(); const re = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g; let m; o.ctx = [];
while ((m = re.exec(th)) && o.ctx.length < 4) o.ctx.push(th.slice(Math.max(0, m.index - 220), m.index + 60).replace(/\s+/g, ' '));
o.tail = th.slice(-900).replace(/\s+/g, ' ');
const el = page.locator('text=/97be04b6-0a08/').first(); if (await el.count()) { await el.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); o.shot = await shot('../wave2n/ui-history-uuid'); }
return done(o);
