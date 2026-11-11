const o={};
let r=await api('POST','/global-sets',{name:'QA GS1111 R3 Rep',values:[{label:'Gold'},{label:'Silver'},{label:'Bronze'}]}); I.RS=r.j.data.id; LED('set R3 Rep '+I.RS);
r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_gs1111_rep',labels:{en:'QA GS1111 Rep'},datatypeKey:'pick_list',datatypeOptions:{allowed_values:['Gold','Silver','Bronze']},config:{allowed_values:['Gold','Silver','Bronze']}}]}); const d=r.j.data; I.fRep=Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id); LED('field qa_gs1111_rep '+I.fRep);
o.assoc=SR(await api('POST','/global-sets/'+I.RS+'/associate',{module_id:L,field_id:I.fRep,mappings:{}}));
I.RR=[]; for(const v of ['Gold','Gold','Silver']){ const x=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:'Rep '+v,qa_gs1111_rep:v})); const id=x.j.data.id||x.j.data.record.id; I.RR.push(id); LED('record Rep '+v+' '+id); }
const ds=arr((await api('GET','/reporting/semantic-layer/datasets')).j.data.data).find(x=>x.module_key==='leads'); I.DS=ds.id; SAVE(); o.ds=ds.display_name;
const dim=k=>({dataset_id:I.DS,field_key:k,grain:null});
const tries=[{dataset_id:I.DS,field_key:'qa_gs1111_rep',operator:'eq',values:['Gold']},{dataset_id:I.DS,field_key:'qa_gs1111_rep',operator:'in',values:['Gold']},{dataset_id:I.DS,field_key:'qa_gs1111_rep',op:'eq',value:'Gold'}];
for(const f of tries){ r=await api('POST','/reporting/reports',{name:'QA GS1111 Gold report',folder_id:null,query_spec:{ir_version:14,base_dataset_id:I.DS,dimensions:[dim('last_name'),dim('qa_gs1111_rep')],measures:[],filters:[f],sort:[],limit:100},viz_spec:{report_type:'tabular',config:{}}}); o['try '+JSON.stringify(f).slice(60,110)]=SR(r)+' '+r.t.slice(0,200); const id=r.j&&r.j.data&&(r.j.data.data||r.j.data).id; if(id){I.REP=id;SAVE();LED('report QA GS1111 Gold report '+id);break;} }
if(I.REP){ const q=await api('POST','/reporting/reports/'+I.REP+'/query',{}); o.run=SR(q)+' '+q.t.slice(0,700); }
return o;
