const seen = {}; const log = [];
const until = new Date('2026-10-21T11:31:30Z').getTime();
let shots = 0;
while (Date.now() < until) {
  const r = await api('GET', '/notifications?unread_only=false&limit=30&category=reminder');
  const items = arr(r.j?.data?.data || r.j?.data);
  for (const n of items) { const key = n.id + '|' + (n.type || n.event_type || n.kind) + '|' + (n.updated_at || n.created_at); if (!seen[key]) { seen[key] = 1; log.push({ at: new Date().toISOString(), raw: JSON.stringify(n).slice(0, 700) }); } }
  const c = await api('GET', '/notifications/unread-count?category=reminder');
  const cnt = c.j?.data?.count;
  if (items.length && shots < 6 && log.length > shots) { await page.mouse.click(963, 28); await sleep(2500); await shot('1332-panel-' + new Date().toISOString().slice(11, 19).replace(/:/g, '')); await page.keyboard.press('Escape'); shots = log.length; }
  log.push({ t: new Date().toISOString().slice(11, 19), n: items.length, unread: cnt });
  await sleep(20000);
}
return done({ log: log.filter(x => x.raw || x.n) });
