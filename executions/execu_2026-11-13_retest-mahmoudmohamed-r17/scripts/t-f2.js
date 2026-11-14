const o={}; const rr=I.R17||I.recs.slice(-3);
const ds=arr((await api('GET','/reporting/semantic-layer/datasets')).j.data.data).find(x=>x.module_key==='leads'); I.DS=ds.id; SAVE();
const dim=k=>({dataset_id:I.DS,field_key:k,grain:null});
let r;
if(!I.REP){ r=await api('POST','/reporting/reports',{name:'QA RT17 2917 Gold report',folder_id:null,query_spec:{ir_version:14,base_dataset_id:I.DS,dimensions:[dim('last_name'),dim('qa_rt17_rep')],measures:[],filters:[{dataset_id:I.DS,field_key:'qa_rt17_rep',operator:'eq',values:['Gold']}],sort:[],limit:100},viz_spec:{report_type:'tabular',config:{}}});
 o.rep=SR(r)+' '+r.t.slice(0,300); I.REP=r.j&&r.j.data&&(r.j.data.data||r.j.data).id; SAVE(); if(I.REP) LED('report QA RT17 2917 Gold report '+I.REP); }
if(!I.REP) return o;
const run=async()=>{const q=await api('POST','/reporting/reports/'+I.REP+'/query',{}); const s=JSON.stringify(q.j&&q.j.data)||q.t; return q.s+' '+s.slice(0,420);};
o.run0=await run();
let u=await api('GET','/global-sets/'+I.S17+'/used-in'); o.usedIn=JSON.stringify(u.j.data).replace(/"[a-z_]+_id":"[^"]+",/g,'').slice(0,700);
let g=await gs(I.S17); r=await api('PUT','/global-sets/'+I.S17,{name:g.name,description:g.description,colors_enabled:false,values:g.values.map(v=>v.value==='Gold'?{...v,label:'Gold Star'}:v),row_version:g.row_version}); o.rename=SR(r);
o.runRenamed=await run();
r=await api('POST','/global-sets/'+I.S17+'/values/replace',{replacements:{Gold:'Silver'}}); o.replace=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); await sleep(3000);
const rep=await api('GET','/reporting/reports/'+I.REP); o.repGet=rep.t.slice(0,200); const rd=(rep.j.data&&rep.j.data.data)||rep.j.data; o.filterAfter=JSON.stringify(rd&&rd.query_spec&&rd.query_spec.filters);
o.runAfter=await run();
await api('PATCH','/modules/'+L+'/records/'+rr[2],rec({last_name:'2917 Silver edited'})); await sleep(3000); o.runAfterEdit=await run();
fs.writeFileSync(RUN+'/out/2917.json',JSON.stringify(o,null,1));
return o;
