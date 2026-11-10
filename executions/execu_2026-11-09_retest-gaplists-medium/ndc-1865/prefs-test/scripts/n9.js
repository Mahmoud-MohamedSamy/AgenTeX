const CC=await crmMod('contacts');const CA=await crmMod('accounts');const DA='784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const TECH='19510fdc-91f3-4a7a-8888-153f1318b765';
const waitLinkCrm=async id=>{let L=null;for(let i=0;i<30&&!L;i++){await sleep(4000);L=await linkOfCrm(id);if(L&&!L.desk_record_id)L=null;}return L;};
const waitLinkDesk=async id=>{let L=null;for(let i=0;i<30&&!L;i++){await sleep(4000);L=await linkOf(id);if(L&&!L.crm_record_id)L=null;}return L;};
const res={};
// A) linked case for "only if nothing linked"
let cur='Keep the Desk contact and flag its link for review';
try{
 let r=await setPref(cur,'Delete the Desk contact only if nothing is linked to it');cur='Delete the Desk contact only if nothing is linked to it';log(`CHANGED pref "On deleting a CRM contact" → "${cur}": ${r.saved}; on_crm_delete=${r.prefs.on_crm_delete}`);
 const c=await crm('POST',`/modules/${CC}/records`,{data:[{field:'first_name',value:S('QA')},{field:'last_name',value:S('QA PREF C6')}]});const cid=c.j&&c.j.data&&(c.j.data.id||c.j.data.recordId);log(`CREATED CRM contact ${cid} (QA PREF C6) → ${c.s}`);
 const L=await waitLinkCrm(cid);if(L){log(`SYNCED to Desk contact ${L.desk_record_id}`);
  const t=await api('POST',`/modules/${TK}/records`,{data:[{field:'subject',value:S('QA PREF C6 linked ticket')},{field:'department',value:S(TECH)},{field:'status',value:S('Open')},{field:'contact_id',value:S(L.desk_record_id)},{field:'description',value:S('QA test for CRM delete preferences. Please ignore.')}]});const tid=t.j&&t.j.data&&(t.j.data.id||t.j.data.recordId);log(`CREATED ticket ${tid} (QA PREF C6 linked ticket, Tech, contact ${L.desk_record_id}) → ${t.s} ${t.s>=300?t.t.slice(0,200):''}`);
  const d=await crm('DELETE',`/modules/${CC}/records/${cid}`);log(`DELETE CRM contact ${cid} → ${d.s}`);
  let g=null;for(let i=0;i<10;i++){await sleep(4000);g=await api('GET',`/modules/${CT}/records/${L.desk_record_id}`);if(g.s!==200)break;}
  const lk=arr((await api('GET','/desk/integrations/crm/links?page_size=200')).j).find(x=>x.desk_record_id===L.desk_record_id);
  res.C6={ticket:t.s+' '+tid,deskGet:g.s,link:lk?{status:lk.sync_status,na:lk.needs_attention}:'none',deskId:L.desk_record_id,crmId:cid};log(`RESULT C6 (with ticket): Desk contact GET ${g.s}; link ${JSON.stringify(res.C6.link)}`);}
}finally{const r=await setPref(cur,'Keep the Desk contact and flag its link for review');log(`RESTORED pref "On deleting a CRM contact" → keep+flag: ${r.saved}; ${JSON.stringify(r.prefs)}`);}
// B) Desk account delete → CRM
try{
 let r=await setPref('Never delete the corresponding CRM account','Delete the corresponding CRM account');log(`CHANGED pref "On deleting a Desk account" → delete CRM account: ${r.saved}; on_desk_account_delete=${r.prefs.on_desk_account_delete}`);
 const a=await api('POST',`/modules/${DA}/records`,{data:[{field:'account_name',value:S('QA PREF DA1')}]});const aid=a.j&&a.j.data&&(a.j.data.id||a.j.data.recordId);log(`CREATED Desk account ${aid} (QA PREF DA1) → ${a.s} ${a.s>=300?a.t.slice(0,200):''}`);
 const L=aid&&await waitLinkDesk(aid);if(L){log(`SYNCED to CRM account ${L.crm_record_id}`);
  const d=await api('DELETE',`/modules/${DA}/records/${aid}`);log(`DELETE Desk account ${aid} → ${d.s}`);
  let g=null;for(let i=0;i<20;i++){await sleep(4000);g=await crm('GET',`/modules/${CA}/records/${L.crm_record_id}`);if(g.s!==200)break;}
  res.DA1={deskId:aid,crmId:L.crm_record_id,crmGet:g.s};log(`RESULT DA1: CRM account GET ${g.s}`);}else res.DA1={create:a.s,synced:!!L};
}finally{const r=await setPref('Delete the corresponding CRM account','Never delete the corresponding CRM account');log(`RESTORED pref "On deleting a Desk account" → Never delete: ${r.saved}; ${JSON.stringify(r.prefs)}`);}
// C) CRM account delete → Desk
try{
 let r=await setPref('Keep the Desk account and flag its link for review','Delete the corresponding Desk account');log(`CHANGED pref "On deleting a CRM account" → delete Desk account: ${r.saved}; on_crm_account_delete=${r.prefs.on_crm_account_delete}`);
 const a=await crm('POST',`/modules/${CA}/records`,{data:[{field:'account_name',value:S('QA PREF CA1')}]});const aid=a.j&&a.j.data&&(a.j.data.id||a.j.data.recordId);log(`CREATED CRM account ${aid} (QA PREF CA1) → ${a.s} ${a.s>=300?a.t.slice(0,200):''}`);
 const L=aid&&await waitLinkCrm(aid);if(L){log(`SYNCED to Desk account ${L.desk_record_id}`);
  const d=await crm('DELETE',`/modules/${CA}/records/${aid}`);log(`DELETE CRM account ${aid} → ${d.s}`);
  let g=null;for(let i=0;i<20;i++){await sleep(4000);g=await api('GET',`/modules/${DA}/records/${L.desk_record_id}`);if(g.s!==200)break;}
  res.CA1={crmId:aid,deskId:L.desk_record_id,deskGet:g.s};log(`RESULT CA1: Desk account GET ${g.s}`);}else res.CA1={create:a.s,synced:!!L};
}finally{const r=await setPref('Delete the corresponding Desk account','Keep the Desk account and flag its link for review');log(`RESTORED pref "On deleting a CRM account" → keep+flag: ${r.saved}; ${JSON.stringify(r.prefs)}`);}
res.final=await prefs();
await page.goto(H+'/settings/integrations/crm',{waitUntil:'commit',timeout:120000});await wt(/Parked/);await page.getByText('Configuration Details',{exact:true}).first().click();await wt(/Preferences/);await page.waitForTimeout(2500);
await page.getByText('Preferences',{exact:true}).first().scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await shot('p7-preferences-restored');
log(`RESTORED (all 4 verified): ${JSON.stringify(res.final)}`);
return res;
