const AM='784400e1-4a2a-42c2-b4f3-7ca56e79828a', KM='0924eb24-e42a-4eab-8efd-e3428f19e882', TECH='19510fdc-91f3-4a7a-8888-153f1318b765', DISC='bc1e5c23-8fcf-4e5d-b09b-a7b0ea630b8e';
const sv=v=>({kind:'string',value:v}); const o={};
const mk=async(mod,f)=>{const r=await api('POST','/modules/'+mod+'/records',{data:Object.entries(f).map(([k,v])=>({field:k,value:sv(v)}))}); return {s:r.s,id:r.j&&r.j.data&&r.j.data.id,t:r.t.slice(0,400)};};
const acc=await mk(AM,{account_name:'QA RT18 GL Account'}); o.acc=acc.s+' '+acc.id;
if(acc.id){
 o.k_bad=await mk(KM,{contract_name:'QA RT18 3024 bad dates',account_id:acc.id,start_date:'2026-12-01',end_date:'2026-11-01',department:TECH});
 o.k_same=await mk(KM,{contract_name:'QA RT18 3024 same day',account_id:acc.id,start_date:'2026-12-01',end_date:'2026-12-01',department:TECH});
 o.k_ok=await mk(KM,{contract_name:'QA RT18 3024 good dates',account_id:acc.id,start_date:'2026-12-01',end_date:'2027-01-31',department:TECH});
 o.k_disc=await mk(KM,{contract_name:'QA RT18 3043 discontinued plan',account_id:acc.id,start_date:'2026-12-01',end_date:'2027-01-31',support_plan:DISC,department:TECH});
 // update an existing good contract to bad dates / discontinued plan
 if(o.k_ok.id){ const u=await api('PATCH','/modules/'+KM+'/records/'+o.k_ok.id,{data:[{field:'end_date',value:sv('2026-11-01')}]}); o.upd_bad=u.s+' '+u.t.slice(0,300);
   const u2=await api('PATCH','/modules/'+KM+'/records/'+o.k_ok.id,{data:[{field:'support_plan',value:sv(DISC)}]}); o.upd_disc=u2.s+' '+u2.t.slice(0,300);
   const g=await api('GET','/modules/'+KM+'/records/'+o.k_ok.id); o.okNow=g.t.slice(0,1500); }
}
return o;
