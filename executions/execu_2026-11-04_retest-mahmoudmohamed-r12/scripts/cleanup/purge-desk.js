const A = 'b8941829-5e08-43e1-b8e0-89c33bb9903c', B = 'e95c1c91-00e6-41d1-ae35-7aef0c80db9b'; const o = { purge: [] };
const bin = []; let cur = ''; for (let i = 0; i < 20; i++) { const r = await api('o', 'GET', `desk:/audit/recycle-bin/items?app_key=desk&limit=200${cur ? '&cursor=' + cur : ''}`); bin.push(...arr(r.j?.data)); cur = r.j?.meta?.next_cursor; if (!cur) break; }
const ids = bin.filter(x => /^QA RT1[12] /.test(x.record_label || '')).map(x => x.id); o.toPurge = ids.length; o.other = bin.filter(x => !/^QA RT1[12] /.test(x.record_label || '')).map(x => x.record_label);
for (let i = 0; i < ids.length; i += 25) { const r = await api('o', 'POST', 'desk:/audit/recycle-bin/delete', { ids: ids.slice(i, i + 25) }); o.purge.push(r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 150) : '')); }
await sleep(5000);
o.team = (await api('o', 'DELETE', 'desk:/desk/teams/02586334-de4a-4428-b8df-22183ff9e244')).t.slice(0, 200) || 'ok';
for (const [n, id] of [['A', A], ['B', B]]) { const d = (await api('o', 'GET', `desk:/desk/departments/${id}`)).j?.data; o['dept' + n + 'before'] = 'tickets=' + d?.ticket_count + ' agents=' + (d?.agent_user_ids || []).length; const r = await api('o', 'DELETE', `desk:/desk/departments/${id}`); o['dept' + n] = r.s + ' ' + (r.t || '').slice(0, 300); }
return o;
