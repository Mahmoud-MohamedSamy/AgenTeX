const o = {}; const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 260) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 200) : undefined });
const D2 = 'ca81f7da-cd75-49e3-953a-43d120bd43c2';
o.tag = sh(await api('DELETE', '/desk/tags/80f2da0d-b632-4eb2-b85d-7313344c7b32'));
const tg = await api('GET', '/desk/tags/80f2da0d-b632-4eb2-b85d-7313344c7b32/impact'); o.tagImpact = sh(tg);
o.tagDel2 = sh(await api('DELETE', '/desk/tags/80f2da0d-b632-4eb2-b85d-7313344c7b32?force=true'));
const tt = await api('GET', `/desk/departments/${D2}/transfer-targets`); o.targets = sh(tt);
o.deptDelete = sh(await api('DELETE', `/desk/departments/${D2}`, { transfer_department_id: DQ, target_department_id: DQ }));
if (o.deptDelete.s >= 400) { o.disable = sh(await api('POST', `/desk/departments/${D2}/disable`, { transfer_department_id: DQ, target_department_id: DQ })); o.deptDelete2 = sh(await api('DELETE', `/desk/departments/${D2}`)); }
const bi = await api('GET', '/audit/recycle-bin/items?limit=30&app=desk'); const items = arr(bi.j && bi.j.data); o.binShape = JSON.stringify(items[0] || {}).slice(0, 500);
o.binQA = items.filter(i => /QA GL W2/.test(JSON.stringify(i))).map(i => i.id).slice(0, 15);
return done(o);
