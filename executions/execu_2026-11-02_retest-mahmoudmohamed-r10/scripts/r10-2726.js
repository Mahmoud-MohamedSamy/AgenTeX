const out={}; const G='QA RT r10 2726'; const DL='243becce-8310-4236-b056-0ebb4731b205';
const sv=v=>({kind:'string',stringValue:v});
const fm=(name,owner)=>({deal_name:sv(name),stage:sv('qualification'),...(owner?{owner:sv(owner)}:{})});
const acts=[
 {type:'CreateRecord',targetModuleId:T.DEALS,targetLayoutId:DL,fieldMappings:fm(G+' A create no owner')},
 {type:'CreateConnectedRecord',targetModuleId:T.DEALS,targetLayoutId:DL,connectedLookupField:'lead',fieldMappings:fm(G+' B connected no owner')},
 {type:'CreateRecord',targetModuleId:T.DEALS,targetLayoutId:DL,fieldMappings:fm(G+' C create triggering owner','triggering_record_owner')},
 {type:'CreateRecord',targetModuleId:T.DEALS,targetLayoutId:DL,fieldMappings:fm(G+' D create specific U3',T.U3)}];
const w=await X.made('o','/workflow/rules',X.wf(T.LEADS,G+' WF',G,{actions:acts}),'workflow rule'); const wid=w.j?.data?.id; out.wf=w.s+' '+(wid||w.t.slice(0,400)); if(!wid) return out;
out.on=(await api('o','POST',`/workflow/rules/${wid}/activate`)).s;
const L=await X.lead('o',G+' lead',{owner:T.U2}); const id=L.j?.data?.id; out.lead=L.s+' '+id; out.leadOwnerIsU2=(await X.field('o',T.LEADS,id,'owner'))===T.U2;
await sleep(30000);
const ex=(await X.executions(id)).find(e=>e.ruleId===wid); out.exec=ex&&{outcome:ex.outcome,d:(ex.dispatches||[]).map(d=>[d.actionType,d.status,d.lastError&&d.lastError.slice(0,120)])};
const names={[T.U2]:'U2 (lead owner)',[T.U3]:'U3',[T.OWNER]:'owner account'}; out.deals={};
for(let p=1;p<=3;p++){ const a=arr((await api('o','GET',`/modules/${T.DEALS}/records?page=${p}`)).j?.data); for(const r of a){ const f=n=>(r.data||[]).find(x=>x.field===n)?.value?.value; const n=f('deal_name'); if(String(n).startsWith(G)){ out.deals[n]={id:r.id,owner:names[f('owner')]||f('owner')||'(none)'}; ledger(`deal ${r.id} "${n}" (by 2726 rule)`);} } if(a.length<100) break; }
out.wid=wid; return out;
