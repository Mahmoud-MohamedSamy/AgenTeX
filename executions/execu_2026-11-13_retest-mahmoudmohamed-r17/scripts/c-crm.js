const o={}; const del=async(p)=>{const r=await api('DELETE',p); return r.s;};
// 1 layout: remove my UI field from Standard layout views
const lay=(await api('GET','/modules/'+L+'/layouts/'+I.LAY)).j.data; const s=JSON.stringify(lay.views);
const strip=v=>JSON.parse(JSON.stringify(v),(k,val)=>Array.isArray(val)?val.filter(x=>!(x&&typeof x==='object'&&JSON.stringify(x).includes('9da05112-30c1-48be-8023-338850976c6f')&&!(x.fields||x.sections||x.rows))):val);
const nv=strip(lay.views); o.layoutHadField=s.includes('9da05112'); o.stillHas=JSON.stringify(nv).includes('9da05112');
if(o.layoutHadField&&!o.stillHas){const r=await api('PUT','/modules/'+L+'/layouts/'+I.LAY,{...lay,views:nv}); o.layoutPut=SR(r)+' '+(r.s>=300?r.t.slice(0,200):'');}
o.rule=await del('/workflow/rules/'+I.W); o.bp=await del('/modules/'+L+'/blueprints/'+I.BP);
o.views=[await del('/modules/'+L+'/views/'+I.V67),await del('/modules/'+L+'/views/'+I.V07)];
o.reports=[await del('/reporting/reports/bab8912b-0750-47c6-8dcb-03b56c9e918e'),await del('/reporting/reports/'+I.REPB)];
o.maps=[await del('/modules/'+L+'/dependency-maps/'+I.MAP1),await del('/modules/'+L+'/dependency-maps/'+I.MAP2)];
const recIds=[...(I.recs||[])]; const rr={}; for(const id of recIds){const s=await del('/modules/'+L+'/records/'+id); rr[s]=(rr[s]||0)+1;} o.leads=rr;
o.crmContactA=await del('/modules/'+I.CU+'/records/0f0b4153-6e5e-452c-ab43-5b8a899d571b');
// sets
const sets=arr((await api('GET','/global-sets')).j.data).filter(x=>/^QA RT17/.test(x.name)); o.sets={}; 
for(const st of sets){ let r=await api('DELETE','/global-sets/'+st.id); if(r.s===409){ const g=await gs(st.id); for(const f of (g.fields||[])){await api('POST','/global-sets/'+st.id+'/disassociate',{module_id:f.module_id,field_id:f.field_id});} r=await api('DELETE','/global-sets/'+st.id);} o.sets[st.name]=r.s; }
// fields
const fr={}; for(const [mod,list] of [[L,arr((await api('GET','/modules/'+L+'/fields')).j.data)],[I.CU,arr((await api('GET','/modules/'+I.CU+'/fields')).j.data)]]){ for(const f of list.filter(x=>/^qa_rt17_/.test(x.fieldName||x.field_name||''))){ const s=await del('/modules/'+mod+'/fields/'+f.id); fr[(f.fieldName||f.field_name)]=s; } } o.fields=fr;
LED('CLEANUP CRM '+JSON.stringify(o).slice(0,900)); return o;
