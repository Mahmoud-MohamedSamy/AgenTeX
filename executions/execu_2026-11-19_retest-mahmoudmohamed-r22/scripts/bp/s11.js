const ev = await api('GET', '/audit/events?limit=500'); const Lx = L(ev.j?.data);
const mask = ip => { if (!ip) return 'none'; const s = String(ip); if (/172\.|10\.|127\.|::1/.test(s)) return s; return s.split('.').slice(0, 2).join('.') + '.x.x'; };
const today = Lx.filter(x => x.occurred_at >= '2026-11-17');
const by = {}; for (const x of today) { const k = (/login|logout|sign/i.test(x.action) ? 'auth' : 'change') + ' ' + mask(x.source_ip).replace(/\.x\.x$/, '.x.x'); by[k] = (by[k] || 0) + 1; }
const mine = today.filter(x => /QA RT20 BP/.test(JSON.stringify(x))).slice(0, 8).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' ' + x.target_type + ' ip=' + mask(x.source_ip) + ' app=' + x.app_key);
const keys = Object.keys(Lx[0] || {});
const changeIps = {}; for (const x of today.filter(x => !/login|logout|sign/i.test(x.action))) { const k = mask(x.source_ip); changeIps[k] = (changeIps[k] || 0) + 1; }
const authIps = {}; for (const x of today.filter(x => /login|logout|sign/i.test(x.action))) { const k = mask(x.source_ip); authIps[k] = (authIps[k] || 0) + 1; }
return { s: ev.s, n: Lx.length, today: today.length, oldest: Lx.length && Lx[Lx.length - 1].occurred_at, keys, changeIps, authIps, mine };
