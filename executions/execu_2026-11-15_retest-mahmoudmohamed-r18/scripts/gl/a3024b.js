const KM='0924eb24-e42a-4eab-8efd-e3428f19e882', TECH='19510fdc-91f3-4a7a-8888-153f1318b765', DISC='bc1e5c23-8fcf-4e5d-b09b-a7b0ea630b8e', ACC='ab2b141d-1908-4da6-9ceb-9df70d54ee29';
const sv=v=>({kind:'string',value:v}); const o={};
const p=await api('POST','/desk/sla/support-plans',{department_id:TECH,name:'QA RT18 plan',description:null,type:'unlimited',allowance:null,cycle:null,carry_forward:false,allow_additional_usage:false,policy_id:'0f5d49e8-2229-40ad-9b40-415238f756fd'});
o.plan=p.s+' '+p.t.slice(0,200); const PL=p.j&&p.j.data&&p.j.data.id; o.PL=PL; if(!PL) return o;
const mk=async(f)=>{const r=await api('POST','/modules/'+KM+'/records',{data:Object.entries(f).map(([k,v])=>({field:k,value:sv(v)}))}); return {s:r.s,id:r.j&&r.j.data&&r.j.data.id,t:r.t.slice(0,400)};};
const base={account_id:ACC,department:TECH,support_plan:PL};
o.k_bad=await mk({...base,contract_name:'QA RT18 3024 bad dates',start_date:'2026-12-01',end_date:'2026-11-01'});
o.k_same=await mk({...base,contract_name:'QA RT18 3024 same day',start_date:'2026-12-01',end_date:'2026-12-01'});
o.k_ok=await mk({...base,contract_name:'QA RT18 3024 good dates',start_date:'2026-12-01',end_date:'2027-01-31'});
o.k_disc=await mk({...base,support_plan:DISC,contract_name:'QA RT18 3043 discontinued plan',start_date:'2026-12-01',end_date:'2027-01-31'});
if(o.k_ok.id){ const u=await api('PATCH','/modules/'+KM+'/records/'+o.k_ok.id,{data:[{field:'end_date',value:sv('2026-11-01')}]}); o.upd_bad=u.s+' '+u.t.slice(0,300);
  const u2=await api('PATCH','/modules/'+KM+'/records/'+o.k_ok.id,{data:[{field:'support_plan',value:sv(DISC)}]}); o.upd_disc=u2.s+' '+u2.t.slice(0,300);
  const g=await api('GET','/modules/'+KM+'/records/'+o.k_ok.id); o.okNow=g.t.slice(0,1800); }
return o;
