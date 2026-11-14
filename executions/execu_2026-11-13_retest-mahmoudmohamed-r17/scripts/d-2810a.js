const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4'; const S=v=>({kind:'string',value:v}); const out={}; I.S10=I.S10||{};
const st=await api('GET','/desk/integrations/crm/status'); out.status=SR(st)+' '+st.t.slice(0,300);
for (const k of ['A','B']) { const r=await api('POST','/modules/'+CT+'/records',{data:[{field:'last_name',value:S('QA RT17 2810 '+k)},{field:'name',value:S('QA RT17 2810 '+k)},{field:'email',value:S('qa.rt17.2810'+k.toLowerCase()+'@example.com')}]}); const id=r.j&&r.j.data&&r.j.data.id; out[k]=SR(r); if(id){I.S10[k]={id};SAVE();LED('Desk contact QA RT17 2810 '+k+' '+id);} }
await sleep(45000);
let links=[]; for (let p=1;p<=15;p++){ const r=await api('GET','/desk/integrations/crm/links?page_size=100&page='+p); const a=arr(r.j&&r.j.data); links=links.concat(a); if(a.length<100) break; }
for (const k of ['A','B']) { const l=links.find(x=>x.desk_record_id===I.S10[k].id); I.S10[k].crm=l&&l.crm_record_id; out[k+'link']=l?l.sync_status+' crm '+l.crm_record_id:'no link'; if(l&&l.crm_record_id) LED('CRM contact (synced) QA RT17 2810 '+k+' '+l.crm_record_id); }
SAVE(); return out;
