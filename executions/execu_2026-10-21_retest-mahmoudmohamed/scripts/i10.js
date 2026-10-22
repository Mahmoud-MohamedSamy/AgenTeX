const seen = {}; const log = []; const until = new Date('2026-10-21T11:32:00Z').getTime(); let lastShot = 0;
while (Date.now() < until) {
  try {
    const r = await api('GET', '/notifications?unread_only=false&limit=30&category=reminder');
    const items = arr(r.j?.data?.data || r.j?.data);
    let fresh = false;
    for (const n of items) { const key = JSON.stringify(n).length + '|' + n.id + '|' + (n.updated_at || n.created_at) + '|' + (n.type || n.kind || n.event_type || n.title); if (!seen[key]) { seen[key] = 1; fresh = true; log.push({ seenAt: new Date().toISOString().slice(11, 19), raw: JSON.stringify(n).slice(0, 900) }); } }
    if (fresh && Date.now() - lastShot > 30000) { lastShot = Date.now(); await page.mouse.click(963, 28); await sleep(2500); await shot('1332-panel-' + new Date().toISOString().slice(11, 19).replace(/:/g, '')); await page.keyboard.press('Escape'); }
  } catch (e) { log.push({ err: String(e.message).slice(0, 80), at: new Date().toISOString().slice(11, 19) }); }
  await sleep(15000);
}
return done({ log });
