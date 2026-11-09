const r = await call('GET', `/modules/${MODS.leads}/records/13a598a6-aba9-4836-a0fd-beb34528b8d2`); return { outsideOwned: r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 160) : 'visible') };
