const dim=k=>({dataset_id:I.DS,field_key:k,grain:null}); const o={};
o.delOld=SR(await api('DELETE','/reporting/reports/'+I.REP)); LED('DELETED report '+I.REP);
const r=await api('POST','/reporting/reports',{name:'QA GS1111 Gold report',folder_id:null,query_spec:{ir_version:14,base_dataset_id:I.DS,dimensions:[dim('last_name'),dim('qa_gs1111_rep')],measures:[],filters:[{dataset_id:I.DS,field_key:'qa_gs1111_rep',operator:'eq',value:'Gold'}],sort:[],limit:100},viz_spec:{report_type:'tabular',config:{}}});
const id=r.j&&r.j.data&&(r.j.data.data||r.j.data).id; I.REP=id; SAVE(); LED('report QA GS1111 Gold report '+id); o.create=SR(r);
const q=await api('POST','/reporting/reports/'+id+'/query',{}); o.run=SR(q)+' '+q.t.slice(0,600);
const u=await api('GET','/global-sets/'+I.RS+'/used-in'); o.usedIn=JSON.stringify(u.j.data).slice(0,300);
return o;
