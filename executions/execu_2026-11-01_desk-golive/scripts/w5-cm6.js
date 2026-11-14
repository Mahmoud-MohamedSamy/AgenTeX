const MID = '01f7df91-4300-495f-ae3e-5de49189195a', RID = 'b61a4c9d-f39a-42f4-a7b4-27618aa12874';
out.delRec = (await api('DELETE', '/modules/' + MID + '/records/' + RID)).s; await sleep(1500);
out.delMod1 = (await api('DELETE', '/modules/' + MID)).s;
if (out.delMod1 >= 300) { const rb = await api('GET', '/audit/recycle-bin/items?limit=50&app=desk'); const it = arr(D(rb.j)).find(i => i.record_id === RID); out.inBin = !!it; if (it) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: [it.id], ids: [it.id] })).s; await sleep(1500); out.delMod2 = (await api('DELETE', '/modules/' + MID)).s + ' ' + (await api('GET', '/modules/' + MID + '/records?limit=1')).s; }
await go('/settings/modules-and-fields', 10000); out.listed = (await mtxt()).includes('QA GL W5 Modules');
return fin({ out });
