const o = {}; const SBT = 'a8b4da7e-8445-4a95-8bd6-dbe5f5ea1bde';
const g = (await api.O('GET', '/desk/data/backups/' + ST.BK)).j?.data; const parts = (g?.parts || []).filter(p => p.rows > 0); o.backupParts = parts.map(p => p.name + '=' + p.rows).slice(0, 15).join(', ');
const mods = arr((await api.O('GET', '/modules', undefined, { 'x-tenant-id': SBT })).j?.data); o.sbModules = mods.length;
const tk = mods.find(m => m.moduleKey === 'desk_tickets');
if (tk) { const r = await api.O('GET', `/modules/${tk.id}/records?page_size=100`, undefined, { 'x-tenant-id': SBT }); o.sbTickets = r.s + ' n=' + arr(r.j?.data).length + ' total=' + (r.j?.meta?.total_count ?? '?'); o.sample = arr(r.j?.data).slice(0, 3).map(x => (x.data || []).find(f => f.field === 'subject')?.value?.value); }
o.sbOpen = E(await api.O('GET', '/desk/data/sandboxes/' + ST.SB + '/open')) ;
return o;
