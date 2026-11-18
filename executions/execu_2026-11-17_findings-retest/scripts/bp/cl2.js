const o = {}; const F4 = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f04.json', 'utf8')); const F7 = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f07.json', 'utf8')); const F9 = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f09.json', 'utf8'));
const mine = [F4.k1, F4.c1, F7.x];
const b = await api('GET', '/audit/recycle-bin/items?app_key=desk&q=QA%20RT21%20BP&limit=100'); o.bin = E(b);
const items = L(b.j?.data).filter(x => mine.includes(x.record_id || x.entity_id)); o.found = items.map(x => (x.record_id || x.entity_id).slice(0, 8) + ' ' + (x.name || x.label || x.title || ''));
if (items.length) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: items.map(x => x.id) }); o.purge = E(r); LED('recycle bin purged ' + items.length + ' BP tickets: ' + r.s); }
for (const id of [F4.bpId, F9.id]) { const r = await api('DELETE', `/modules/${TK}/blueprints/${id}`); o['bpdel' + id.slice(0, 8)] = E(r); LED('blueprint delete ' + id + ': ' + E(r)); }
for (const k of ['dB', 'dA']) { const r = await api('DELETE', '/desk/departments/' + F7[k]); o['deptdel' + k] = E(r); LED('department delete ' + F7[k] + ' (' + k + '): ' + E(r)); }
return o;
