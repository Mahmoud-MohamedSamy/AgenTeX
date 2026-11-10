const T=['fffcde56-f91b-40f9-a22b-7cd894a77921','e74924f9-6bb4-49ee-85ff-ebdf795d669f'];
const DP=['6a7a38a8-aaf5-4a9b-aa99-b5eaa676e7e7','b67c190b-0acf-4d15-9047-4df89daff1d2','76ba390d-3b2c-47f1-be3d-71417b21ff50','d852798e-94ef-4855-9dc0-112578f3a490'];
out.del={};
for(const id of T){const dr=await api('DELETE',`/desk/tickets/${id}/drafts/mine`);const r=await api('DELETE',`/modules/${TK}/records/${id}`);out.del[id]=r.s+(r.s>=300?' '+r.t.slice(0,200):'');log(`DELETE ticket ${id} → ${r.s}`);}
for(const id of DP){const r=await api('DELETE','/desk/departments/'+id);out.del[id]=r.s+(r.s>=300?' '+r.t.slice(0,200):'');log(`DELETE department ${id} → ${r.s}`);}
await sleep(4000);
const ids=[...T,...DP];const bin=arr((await api('GET','/audit/recycle-bin/items')).j);const mine=bin.filter(i=>ids.includes(i.record_id)||/QA RC 1865/.test(JSON.stringify(i)));out.binFound=mine.map(i=>i.id+' '+(i.record_id||'')+' '+(i.name||i.title||i.display_name||''));
if(mine.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:mine.map(i=>i.id)});out.purge=p.s+' '+p.t.slice(0,200);log(`PURGE recycle-bin items ${mine.map(i=>i.id).join(',')} → ${p.s}`);}
await sleep(3000);
out.verify={};for(const id of T){out.verify[id]=(await api('GET',`/modules/${TK}/records/${id}`)).s;}for(const id of DP){out.verify[id]=(await api('GET','/desk/departments/'+id)).s;}
const bin2=arr((await api('GET','/audit/recycle-bin/items')).j);out.binLeft=bin2.filter(i=>ids.includes(i.record_id)||/QA RC 1865/.test(JSON.stringify(i))).length;
const c=await api('GET',`/modules/${CT}/records/${C}`);out.contactStillThere=c.s;
return out;
