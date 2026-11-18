const o={};
const put=async(so)=>{ const g=await gs(I.T); return api('PUT','/global-sets/'+I.T,{name:g.name,description:g.description,colors_enabled:g.colors_enabled,values:g.values,sort_order:so,row_version:g.row_version}); };
const flt=JSON.stringify([{field:'first_name',operator:'equals',value:'QA RT19 GS'}]);
const order=async()=>{ const x=await api('GET','/modules/'+L+'/records?per_page=50&sort_by=qa_rt19_gs_tier&sort_dir=asc&filters='+encodeURIComponent(flt)); return x.s+' '+(x.t.match(/Tier L[A-Z0-9]+/g)||[]).join(',')+' total?'+(x.t.match(/"total":\d+/)||[''])[0]; };
o.alpha=await order();
o.toEntered=SR(await put('entered')); LED('set '+I.T+' sort_order → entered');
o.entered=await order();
// descending entered
const x=await api('GET','/modules/'+L+'/records?per_page=50&sort_by=qa_rt19_gs_tier&sort_dir=desc&filters='+encodeURIComponent(flt)); o.enteredDesc=(x.t.match(/Tier L[A-Z0-9]+/g)||[]).join(',');
const g=await gs(I.T); o.values=g.values.map(v=>v.value).join(',');
// report sorted by field
const ds=I.DS; const dim=k=>({dataset_id:ds,field_key:k,grain:null});
const rp=await api('POST','/reporting/reports',{name:'QA RT19 GS Sort report',folder_id:null,query_spec:{ir_version:14,base_dataset_id:ds,dimensions:[dim('last_name'),dim('qa_rt19_gs_tier')],measures:[],filters:[{dataset_id:ds,field_key:'first_name',operator:'eq',value:'QA RT19 GS'}],sort:[{dataset_id:ds,field_key:'qa_rt19_gs_tier',direction:'asc'}],limit:100},viz_spec:{report_type:'tabular',config:{}}});
o.rep=SR(rp)+(rp.s>=300?rp.t.slice(0,300):''); I.REP2=rp.j&&rp.j.data&&(rp.j.data.data||rp.j.data).id; if(I.REP2) LED('report QA RT19 GS Sort report '+I.REP2); SAVE();
if(I.REP2){ await sleep(3000); const q=await api('POST','/reporting/reports/'+I.REP2+'/query',{}); o.repEntered=q.s+' '+(q.t.match(/Tier L[A-Z0-9]+/g)||[]).join(','); await put('alphabetical'); await sleep(2000); const q2=await api('POST','/reporting/reports/'+I.REP2+'/query',{}); o.repAlpha=q2.s+' '+(q2.t.match(/Tier L[A-Z0-9]+/g)||[]).join(','); o.listAlpha2=await order(); await put('entered'); }
return o;
