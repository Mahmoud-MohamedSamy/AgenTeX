const o = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3029.json', 'utf8'));
const ev = await api('GET', '/audit/events?app_key=desk&limit=200'); const Lx = L(ev.j?.data);
const mine = Lx.filter(x => x.occurred_at >= o.start && x.occurred_at < '2026-11-16T09:01');
o.full = mine.map(x => ({ at: x.occurred_at.slice(11, 19), a: x.action, tt: x.target_type, tl: x.target_label, tid: x.target_id === o.id, actor: x.actor_label ? 'len' + x.actor_label.length + ':' + x.actor_label.replace(/@.*/, '@…') : null, ip: x.source_ip ? 'present' : null, ch: x.source_channel, parent: x.target_parent_type, changes: JSON.stringify(x.changes).slice(0, 300), meta: JSON.stringify(x.metadata).slice(0, 300) }));
fs.writeFileSync(RUN + '/scripts/bp/3029.json', JSON.stringify(o, null, 1));
return o.full;
