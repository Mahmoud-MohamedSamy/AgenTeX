const CC=await crmMod('contacts');
const r1=await setPref('Never delete the corresponding CRM contact','Delete the corresponding CRM contact');out.set=r1;
log(`CHANGE ATTEMPT pref "On deleting a Desk contact": "Never delete…" (keep) → "Delete the corresponding CRM contact": ${r1.saved}; now ${JSON.stringify(r1.prefs)}; calls ${JSON.stringify(r1.calls)}`);
await shot('p4-desk-contact-delete-set');
if(r1.prefs.on_desk_contact_delete!=='keep'){
 const c=await api('POST',`/modules/${CT}/records`,{data:[{field:'first_name',value:S('QA')},{field:'last_name',value:S('QA PREF D2')}]});const did=c.j&&c.j.data&&(c.j.data.id||c.j.data.recordId);out.create=c.s+' '+did;log(`CREATED Desk contact ${did} (QA PREF D2) → ${c.s}`);
 let L=null;for(let i=0;i<30&&!L;i++){await sleep(4000);L=await linkOf(did);if(L&&!L.crm_record_id)L=null;}
 out.link=L&&L.crm_record_id;if(L)log(`SYNCED to CRM contact ${L.crm_record_id}`);
 if(L){const d=await api('DELETE',`/modules/${CT}/records/${did}`);out.del=d.s;log(`DELETE Desk contact ${did} → ${d.s}`);
  let g=null;for(let i=0;i<25;i++){await sleep(4000);g=await crm('GET',`/modules/${CC}/records/${L.crm_record_id}`);if(g.s!==200)break;}
  out.crmAfter=g.s;const cb=carr((await crm('GET','/audit/recycle-bin/items')).j).filter(i=>i.record_id===L.crm_record_id);out.crmBin=cb.map(i=>i.id);
  log(`CRM copy ${L.crm_record_id} after Desk delete: GET ${g.s}; in CRM bin: ${cb.map(i=>i.id).join(',')||'no'}`);}
}
const r2=await setPref('Delete the corresponding CRM contact','Never delete the corresponding CRM contact');out.restore=r2;
log(`RESTORED pref "On deleting a Desk contact" → Never delete: ${r2.saved}; now ${JSON.stringify(r2.prefs)}`);
return out;
