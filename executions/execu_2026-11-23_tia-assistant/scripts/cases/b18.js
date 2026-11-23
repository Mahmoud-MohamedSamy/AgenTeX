result('B-17', 'Pass', 'Deploy after deactivate → deployed v15; RST available again, answers, past chat 365d89db still listed');
const del = await api('DELETE', `/agents/${AGENT}`);
const g = await api('GET', `/agents/${AGENT}`); const list = arr((await api('GET', '/agents')).j?.data);
const rb = await api('GET', '/audit/recycle-bin/items?limit=50');
const items = arr(rb.j?.data); const it = items.find(x => JSON.stringify(x).includes(AGENT) || /tia/i.test(x.name || x.title || x.display_name || ''));
fs.writeFileSync(RUN + '/out/b18-recycle.json', JSON.stringify({ del: del.s, item: it, first: items[0] }, null, 1));
return { del: del.s, delErr: del.j?.error, get: g.s, inList: list.some(a => a.id === AGENT), rb: rb.s, n: items.length, item: it && { id: it.id, name: it.name || it.title || it.display_name, type: it.entity_type || it.type || it.kind, app: it.app_key } };
