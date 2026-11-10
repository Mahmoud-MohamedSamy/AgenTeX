const CC=await crmMod('contacts');const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const HR='97be04b6-0a08-4883-aa51-e1650b11cab7';
const res={};let cur='Keep the Desk contact and flag its link for review';
const mk=async(name)=>{const c=await crm('POST',`/modules/${CC}/records`,{data:[{field:'first_name',value:S('QA')},{field:'last_name',value:S(name)}]});const id=c.j&&c.j.data&&(c.j.data.id||c.j.data.recordId);log(`CREATED CRM contact ${id} (${name}) → ${c.s}`);
 let L=null;for(let i=0;i<30&&!L;i++){await sleep(4000);L=await linkOfCrm(id);if(L&&!L.desk_record_id)L=null;}if(L)log(`SYNCED to Desk contact ${L.desk_record_id} (link ${L.id})`);return {id,s:c.s,t:c.s>=300?c.t.slice(0,200):'',L};};
const after=async(r)=>{let g=null;for(let i=0;i<20;i++){await sleep(4000);g=await api('GET',`/modules/${CT}/records/${r.L.desk_record_id}`);if(g.s!==200)break;}
 const l=await api('GET','/desk/integrations/crm/links?page_size=200');const lk=arr(l.j).find(x=>x.desk_record_id===r.L.desk_record_id);
 return {deskGet:g.s,link:lk?{status:lk.sync_status,needs_attention:lk.needs_attention,crm:lk.crm_record_id}:'none'};};
const scen=[
 ['C1','Delete the corresponding Desk contact',false],
 ['C2','Delete the Desk contact only if nothing is linked to it',true],
 ['C3','Delete the Desk contact only if nothing is linked to it',false],
 ['C4','Keep the Desk contact but unlink it from the CRM',false],
 ['C5','Keep the Desk contact and flag its link for review',false]];
try{
for(const [tag,opt,withTicket] of scen){
 if(opt!==cur){const r=await setPref(cur,opt);log(`CHANGED pref "On deleting a CRM contact": "${cur}" → "${opt}": ${r.saved}; now on_crm_delete=${r.prefs.on_crm_delete}`);cur=opt;res[tag+' pref']=r.prefs.on_crm_delete;}
 const r=await mk('QA PREF '+tag);if(!r.L){res[tag]={create:r.s+' '+r.t,synced:false};continue;}
 if(withTicket){const t=await api('POST',`/modules/${TK}/records`,{data:[{field:'subject',value:S('QA PREF '+tag+' linked ticket')},{field:'department',value:S(HR)},{field:'status',value:S('Open')},{field:'contact_id',value:S(r.L.desk_record_id)}]});const tid=t.j&&t.j.data&&(t.j.data.id||t.j.data.recordId);log(`CREATED ticket ${tid} (QA PREF ${tag} linked ticket, HR, contact ${r.L.desk_record_id}) → ${t.s}`);r.ticket=tid;}
 const d=await crm('DELETE',`/modules/${CC}/records/${r.id}`);log(`DELETE CRM contact ${r.id} → ${d.s}`);
 const a=await after(r);res[tag]={opt,crmId:r.id,deskId:r.L.desk_record_id,ticket:r.ticket,crmDel:d.s,...a};log(`RESULT ${tag}: Desk contact GET ${a.deskGet}; link ${JSON.stringify(a.link)}`);
}
}finally{
 if(cur!=='Keep the Desk contact and flag its link for review'){const r=await setPref(cur,'Keep the Desk contact and flag its link for review');log(`RESTORED pref "On deleting a CRM contact" → "Keep the Desk contact and flag its link for review": ${r.saved}; now ${JSON.stringify(r.prefs)}`);res.restored=r.prefs;}
}
await page.goto(H+'/settings/integrations/crm',{waitUntil:'commit',timeout:120000});await wt(/Parked/);await page.getByText('Failure Log',{exact:true}).first().click().catch(()=>{});await page.waitForTimeout(6000);await shot('p6-failure-log-after-crm-deletes');
res.failureTop=(await body()).split('\n').filter(l=>/QA PREF|review|unlink|deleted/i.test(l)).slice(0,12);
return res;
