const o={};
// 2917 report
let r=await mkSet('QA RT17 GS 2917',['Gold','Silver','Bronze'],'S17');
r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_rt17_rep',labels:{en:'QA RT17 Rep'},datatypeKey:'pick_list',datatypeOptions:{global_set_id:I.S17},config:{}}]}); I.f17=fid(r); SAVE(); LED('field Leads qa_rt17_rep '+I.f17);
const rr=[]; for(const v of ['Gold','Gold','Silver']) rr.push((await mkRec('2917 '+v,{qa_rt17_rep:v}))[1]); I.R17=rr; SAVE();
const ds=arr((await api('GET','/reporting/semantic-layer/datasets')).j.data.data).find(x=>x.module_key==='leads'); I.DS=ds.id; SAVE();
const dim=k=>({dataset_id:I.DS,field_key:k,grain:null});
r=await api('POST','/reporting/reports',{name:'QA RT17 2917 Gold report',folder_id:null,query_spec:{ir_version:14,base_dataset_id:I.DS,dimensions:[dim('last_name'),dim('qa_rt17_rep')],measures:[],filters:[{dataset_id:I.DS,field_key:'qa_rt17_rep',operator:'eq',values:['Gold']}],sort:[],limit:100},viz_spec:{report_type:'tabular',config:{}}});
I.REP=r.j&&r.j.data&&(r.j.data.data||r.j.data).id; SAVE(); if(I.REP) LED('report QA RT17 2917 Gold report '+I.REP); o.rep=SR(r);
const run=async()=>{const q=await api('POST','/reporting/reports/'+I.REP+'/query',{}); const s=JSON.stringify(q.j&&q.j.data); return q.s+' rows '+((s.match(/QA RT17|2917 /g)||[]).length)+' '+s.slice(0,350);};
o.run0=await run();
let u=await api('GET','/global-sets/'+I.S17+'/used-in'); o.usedInReports=JSON.stringify(u.j.data.fields[0].reports||u.j.data.reports||'no reports key').slice(0,300);
// rename Gold -> Gold Star
let g=await gs(I.S17); r=await api('PUT','/global-sets/'+I.S17,{name:g.name,description:g.description,colors_enabled:false,values:g.values.map(v=>v.value==='Gold'?{...v,label:'Gold Star'}:v),row_version:g.row_version}); o.rename=SR(r);
o.runRenamed=await run();
r=await api('POST','/global-sets/'+I.S17+'/values/replace',{replacements:{Gold:'Silver'}}); o.replace=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); await sleep(3000);
const rep=(await api('GET','/reporting/reports/'+I.REP)).j.data; const rd=rep.data||rep; o.filterAfter=JSON.stringify(rd.query_spec.filters);
o.runAfter=await run();
await api('PATCH','/modules/'+L+'/records/'+rr[2],rec({last_name:'2917 Silver edited'})); await sleep(2000); o.runAfterEdit=await run();
fs.writeFileSync(RUN+'/out/2917.json',JSON.stringify(o,null,1));
RES('2917', /^200/.test(o.replace)&&/Silver/.test(o.filterAfter)&&!/"Gold"/.test(o.filterAfter)?'PASS?':'FAIL', JSON.stringify(o));
return o;
