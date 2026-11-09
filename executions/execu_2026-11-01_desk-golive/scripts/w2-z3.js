const o = {}; const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 260) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 300) : undefined });
const D2 = 'ca81f7da-cd75-49e3-953a-43d120bd43c2';
o.tag = sh(await api('DELETE', '/desk/tags/80f2da0d-b632-4eb2-b85d-7313344c7b32', { confirm: true }));
o.dept = sh(await api('DELETE', `/desk/departments/${D2}`, { transfer_to_department_id: DQ }));
const bi = await api('GET', '/audit/recycle-bin/items?limit=50&app=desk'); const items = arr(bi.j && bi.j.data);
const base = items.find(i => i.record_id === '3008a52d-6f69-48bb-90ba-bac134c7aa56'); o.baseItem = base && base.id;
if (base) { const df = await api('POST', '/audit/recycle-bin/delete', { item_ids: [base.id] }); o.deleteForever = sh(df); const bi2 = await api('GET', '/audit/recycle-bin/items?limit=50&app=desk'); o.stillInBin = arr(bi2.j && bi2.j.data).some(i => i.id === base.id); }
const dl = await api('GET', '/desk/departments'); o.deptsNow = arr(dl.j && dl.j.data).map(d => d.name);
return done(o);
