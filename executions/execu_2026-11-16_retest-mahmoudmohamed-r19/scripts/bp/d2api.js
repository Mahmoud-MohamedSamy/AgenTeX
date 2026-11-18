const ev = L((await api('GET', '/audit/events?limit=300')).j?.data).filter(x => x.occurred_at >= '2026-11-16');
const m = ip => String(ip).replace(/^(\d+\.\d+)\.\d+\.\d+/, '$1.x.x');
const by = {}; for (const x of ev) { const k = x.action.replace('audit.action.', '') + ' (' + x.app_key + ')'; by[k] = by[k] || {}; by[k][m(x.source_ip)] = (by[k][m(x.source_ip)] || 0) + 1; }
return { n: ev.length, by, chan: [...new Set(ev.map(x => x.action.replace('audit.action.', '') + ':' + x.source_channel))] };
