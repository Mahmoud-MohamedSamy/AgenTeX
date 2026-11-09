const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/views/all/tickets/6062d48c-1ea8-47c6-a99c-5d2178f87144', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA RT 2794/.test(t) && /Team/.test(t)) break; }
await sleep(3000); const t = (await txt()).replace(/\s+/g, ' ');
o.team = t.match(/Team.{0,60}/g)?.slice(0, 4); o.owner = t.match(/(Ticket Owner|Owner).{0,50}/g)?.slice(0, 3);
o.shot = await shot('rt/2794-ticket');
const h = page.locator('text=/^History$/').first(); if (await h.count()) { await h.click().catch(() => {}); await sleep(3000); o.hist = (await txt()).replace(/\s+/g, ' ').match(/.{0,80}(Team|team|Owner|owner).{0,120}/g)?.slice(0, 6); o.shot2 = await shot('rt/2794-history'); }
return JSON.stringify(o);
