const o={}; let r;
const gs=async id=>(await api('GET','/global-sets/'+id)).j.data;
const fid=r=>{const d=r.j&&r.j.data; return d&&(Array.isArray(d)?d[0]&&d[0].id:(d.fields?d.fields[0].id:d.id));};
if(!I.S){ r=await api('POST','/global-sets',{name:'QA RT18 GS 2917',values:['Gold','Silver','Bronze'].map(l=>({label:l}))}); I.S=r.j.data.id; SAVE(); LED('global set "QA RT18 GS 2917" '+I.S); }
if(!I.F){ r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_rt18_rep',labels:{en:'QA RT18 Rep'},datatypeKey:'pick_list',datatypeOptions:{global_set_id:I.S},config:{}}]}); I.F=fid(r); SAVE(); o.field=SR(r); if(I.F) LED('field qa_rt18_rep '+I.F+' (Leads, global set QA RT18 GS 2917)'); }
if(!I.R){ I.R=[]; for(const v of ['Gold','Gold','Silver']){ const x=await api('POST','/modules/'+L+'/records',Object.assign(rec({first_name:'QA RT18',last_name:'2917 '+v,qa_rt18_rep:v}),{layout_id:'bf971461-2edc-45f2-b6e4-6e180aa64288'})); const id=x.j&&x.j.data&&(x.j.data.id||(x.j.data.record&&x.j.data.record.id)); o['rec'+v]=SR(x); if(id){I.R.push(id); LED('lead "QA RT18 2917 '+v+'" '+id+' (Leads)');} } SAVE(); }
const ds=arr((await api('GET','/reporting/semantic-layer/datasets')).j.data.data).find(x=>x.module_key==='leads'); I.DS=ds.id;
const dim=k=>({dataset_id:I.DS,field_key:k,grain:null});
if(!I.REP){ r=await api('POST','/reporting/reports',{name:'QA RT18 2917 Gold report',folder_id:null,query_spec:{ir_version:14,base_dataset_id:I.DS,dimensions:[dim('last_name'),dim('qa_rt18_rep')],measures:[],filters:[{dataset_id:I.DS,field_key:'qa_rt18_rep',operator:'eq',value:'Gold'}],sort:[],limit:100},viz_spec:{report_type:'tabular',config:{}}}); I.REP=r.j&&r.j.data&&(r.j.data.data||r.j.data).id; o.rep=SR(r)+(I.REP?'':r.t.slice(0,300)); if(I.REP) LED('report "QA RT18 2917 Gold report" '+I.REP); }
SAVE();
const run=async()=>{const q=await api('POST','/reporting/reports/'+I.REP+'/query',{}); const s=JSON.stringify(q.j&&q.j.data)||q.t; const rows=(s.match(/2917 (Gold|Silver)[^"]*/g)||[]); return q.s+' rows='+rows.length+' vals='+JSON.stringify(s.match(/"(Gold|Silver|Bronze|Gold Star|Silver Star)"/g));};
const filt=async()=>{const rep=await api('GET','/reporting/reports/'+I.REP); const rd=(rep.j.data&&rep.j.data.data)||rep.j.data; return JSON.stringify(rd.query_spec.filters.map(f=>({op:f.operator,value:f.value,values:f.values})));};
await sleep(3000); o.f0=await filt(); o.run0=await run();
let g=await gs(I.S); r=await api('PUT','/global-sets/'+I.S,{name:g.name,description:g.description,colors_enabled:false,values:g.values.map(v=>v.value==='Gold'?{...v,label:'Gold Star'}:v),row_version:g.row_version}); o.renameGold=SR(r); await sleep(3000);
o.runRenamedGold=await run(); o.fRenamed=await filt();
r=await api('POST','/global-sets/'+I.S+'/values/replace',{replacements:{Gold:'Silver'}}); o.replace=SR(r)+' '+(r.s>=300?r.t.slice(0,200):''); await sleep(3000);
o.fAfter=await filt(); o.runAfter=await run(); await sleep(22000); o.runAfter25=await run();
g=await gs(I.S); r=await api('PUT','/global-sets/'+I.S,{name:g.name,description:g.description,colors_enabled:false,values:g.values.map(v=>v.value==='Silver'?{...v,label:'Silver Star'}:v),row_version:g.row_version}); o.renameSilver=SR(r); await sleep(5000);
o.runRenamedSilver=await run(); o.fFinal=await filt();
g=await gs(I.S); o.set=g.values.map(v=>v.value+'='+v.label).join(',')+' | unused '+(g.unused_values||[]).map(v=>v.value);
const q=await api('POST','/reporting/reports/'+I.REP+'/query',{}); o.rawSample=JSON.stringify(q.j&&q.j.data).slice(0,900);
// record API display
const rr=(await api('GET','/modules/'+L+'/records/'+I.R[2])).j; o.recField=(JSON.stringify(rr).match(/"qa_rt18_rep"[^}]*\}[^}]*\}?/)||[''])[0].slice(0,300);
fs.writeFileSync(RUN+'/out/2917-crm9.json',JSON.stringify(o,null,1)); return o;
