const mods = L((await api('GET', '/modules')).j?.data); let ex = null;
for (const m of mods) { const r = await api('GET', `/modules/${m.id}/views?kind=kanban`); const v = L(r.j?.data); if (v.length) { ex = { m: m.moduleKey, v: v[0] }; break; } }
log(ex ? ex.m : 'none', JSON.stringify(ex?.v).slice(0, 1200));
