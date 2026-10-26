// NDC-2399: confirm Connect, wait for the initial runs, then look for a notice (bell, page banner/toast).
await page.evaluate(() => { window.__msgs = []; const seen = new Set(); new MutationObserver(() => { document.querySelectorAll('[role=status],[role=alert],[data-sonner-toast],[class*=toast],[class*=Toast]').forEach(e => { const t = e.innerText.trim(); if (t && !seen.has(t)) { seen.add(t); window.__msgs.push(t); } }); }).observe(document.body, { subtree: true, childList: true, characterData: true }); });
const d = page.locator('[role=dialog],[role=alertdialog]').last();
await d.getByRole('button', { name: 'Connect', exact: true }).click(); const tCon = new Date().toISOString(); await sleep(4000); await shot('2399-r2-04-connected');
let runs = []; for (let i = 0; i < 24; i++) { await sleep(5000); const r = await api('GET', '/desk/integrations/crm/runs?limit=4'); runs = arr(r.j?.data).filter(x => (x.started_at || x.created_at) > tCon.slice(0, 19)); if (runs.length >= 2 && runs.every(x => x.finished_at || x.completed_at)) break; }
await sleep(20000);
const msgs = await page.evaluate(() => window.__msgs);
const st = (await api('GET', '/desk/integrations/crm/status')).j?.data;
const n = await api('GET', '/notifications?limit=10'); const u = await api('GET', '/notifications/unread-count');
return done({ tCon, enabled: st?.enabled, paused: st?.paused, runs: runs.map(r => ({ kind: r.kind, status: r.status, at: r.started_at, done: r.finished_at || r.completed_at, counts: r.counts || r.stats || r.summary })), msgs, unread: u.j?.data, newNotif: arr(n.j?.data).filter(x => x.created_at > tCon.slice(0, 19)).map(x => ({ title: x.title || x.message, body: (x.body || '').slice(0, 200), at: x.created_at })) });
