const CC=await crmMod('contacts');
// 1 change pref
const r1=await setPref('On deleting a Desk contact','Delete the corresponding CRM contact');out.set=r1;log(`CHANGED pref "On deleting a Desk contact": "Never delete the corresponding CRM contact" (on_desk_contact_delete=keep) → "Delete the corresponding CRM contact" (${r1.saved}; now ${JSON.stringify(r1.prefs)})`);
await shot('p2-desk-contact-delete-set');
// 2 create Desk contact
const c=await api('POST',`/modules/${CT}/records`,{data:[{field:'first_name',value:S('QA')},{field:'last_name',value:S('QA PREF D1')}]});const did=c.j&&c.j.data&&(c.j.data.id||c.j.data.recordId);out.create=c.s+' '+did;log(`CREATED Desk contact ${did} (QA PREF D1) → ${c.s}`);
let L=null;for(let i=0;i<30&&!L;i++){await sleep(4000);L=await linkOf(did);if(L&&!L.crm_record_id)L=null;}
out.link=L&&{crm:L.crm_record_id,status:L.sync_status};if(L)log(`SYNCED to CRM contact ${L.crm_record_id} (link ${L.id})`);
if(L){// 3 delete Desk contact
 const d=await api('DELETE',`/modules/${CT}/records/${did}`);out.del=d.s;log(`DELETE Desk contact ${did} → ${d.s}`);
 let g=null;for(let i=0;i<20;i++){await sleep(4000);g=await crm('GET',`/modules/${CC}/records/${L.crm_record_id}`);if(g.s!==200)break;}
 out.crmAfter=g.s+' '+(g.s===200?'still exists':g.t.slice(0,150));
 const cb=carr((await crm('GET','/audit/recycle-bin/items')).j).filter(i=>i.record_id===L.crm_record_id);out.crmBin=cb.map(i=>i.id);
 if(cb.length)log(`CRM copy ${L.crm_record_id} is in CRM Recycle Bin (item ${cb.map(i=>i.id).join(',')})`);
 out.linkAfter=JSON.stringify(await linkOf(did)).slice(0,250);}
// 4 restore
const r2=await setPref('On deleting a Desk contact','Never delete the corresponding CRM contact');out.restore=r2.prefs;log(`RESTORED pref "On deleting a Desk contact" → "Never delete the corresponding CRM contact" (${JSON.stringify(r2.prefs)})`);
out.calls=[...new Set(calls)];return out;
