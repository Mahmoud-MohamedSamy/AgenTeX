const dim=k=>({dataset_id:I.DS,field_key:k,grain:null}); const o={};
const base=f=>({name:'QA GS1111 Gold report',folder_id:null,query_spec:{ir_version:14,base_dataset_id:I.DS,dimensions:[dim('last_name'),dim('qa_gs1111_rep')],measures:[],filters:[f],sort:[],limit:100},viz_spec:{report_type:'tabular',config:{}}});
for(const f of [{dataset_id:I.DS,field_key:'qa_gs1111_rep',operator:'eq',value:'Gold'},{dataset_id:I.DS,field_key:'qa_gs1111_rep',operator:'eq',value:['Gold']},{dataset_id:I.DS,field_key:'qa_gs1111_rep',operator:'eq',operands:['Gold']},{dataset_id:I.DS,field_key:'qa_gs1111_rep',operator:'eq',args:['Gold']},{dataset_id:I.DS,field_key:'qa_gs1111_rep',operator:'eq',literal:'Gold'}]){
  const u=await api('PUT','/reporting/reports/'+I.REP,base(f)); const q=await api('POST','/reporting/reports/'+I.REP+'/query',{}); const k=Object.keys(f).slice(3).join('+')+'='+JSON.stringify(Object.values(f).slice(3));
  o[k]=SR(u)+' / run '+SR(q)+' '+q.t.slice(0,300); if(q.s===200) { I.REPF=f; SAVE(); break; } }
return o;
