const o = {}; const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 260) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 400) : undefined });
o.tag = sh(await api('DELETE', '/desk/tags/80f2da0d-b632-4eb2-b85d-7313344c7b32?confirm=true'));
const df = await api('POST', '/audit/recycle-bin/delete', { ids: ['5b609881-03f1-47ed-94d4-28a5b6f235cf'] }); o.deleteForever = sh(df);
const bi2 = await api('GET', '/audit/recycle-bin/items?limit=50&app=desk'); o.stillInBin = arr(bi2.j && bi2.j.data).some(i => i.id === '5b609881-03f1-47ed-94d4-28a5b6f235cf');
const g = await api('GET', '/modules/' + T + '/records/3008a52d-6f69-48bb-90ba-bac134c7aa56'); o.recordAfter = g.s;
return done(o);
