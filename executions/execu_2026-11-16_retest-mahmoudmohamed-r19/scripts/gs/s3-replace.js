const o={}; const t0=new Date().toISOString();
const r=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Gold:'Silver'}}); o.replace=SR(r)+' '+r.t.slice(0,700); LED('replace Gold→Silver on set '+I.T+' → '+r.s);
await sleep(4000);
o.LG1=await recVal(L,I.R.LG1,'qa_rt19_gs_tier'); o.LG2=await recVal(L,I.R.LG2,'qa_rt19_gs_tier'); o.CG1=await recVal(I.C,I.R.CG1,'qa_rt19_gs_tier'); o.LG1child=await recVal(L,I.R.LG1,'qa_rt19_gs_dc');
const m1=(await api('GET','/modules/'+L+'/records/'+I.R.LG1)).j.data; o.LG1_modified=I.LG1mod+' → '+(m1.lastModifiedAt||m1.last_modified_at);
o.view=JSON.stringify((await api('GET','/modules/'+L+'/views/'+I.V)).j.data.settings.criteria);
const w=(await api('GET','/workflow/rules/'+I.W)).j.data; o.rule='criteria '+JSON.stringify(w.criteria.value)+' action '+JSON.stringify(w.actions[0].fieldUpdates)+' active '+w.isActive;
const rep=(await api('GET','/reporting/reports/'+I.REP)).j; o.reportFilter=JSON.stringify((rep.data.data||rep.data).query_spec.filters);
const q=await api('POST','/reporting/reports/'+I.REP+'/query',{}); o.reportRows=(q.t.match(/Tier (LG1|LG2|LS1)/g)||[]).join(',');
const maps=arr((await api('GET','/modules/'+L+'/dependency-maps')).j.data).filter(m=>m.id===I.MAP); o.map=JSON.stringify(maps.map(m=>m.valueMap||m.value_map));
const g=await gs(I.T); o.values=g.values.map(v=>v.value).join(','); o.unused=g.unused_values.map(v=>v.value).join(',');
const h=(await api('GET','/global-sets/'+I.T+'/replace-history')).j; o.history=JSON.stringify(h.data).replace(/"id":"[^"]+",/g,'').slice(0,1200);
for (const p of ['/notifications?limit=5','/notifications']) { const n=await api('GET',p); o['notif '+p]=n.s+' '+JSON.stringify(arr(n.j&&n.j.data).slice(0,4).map(x=>({t:x.title||x.type||x.kind,b:String(x.body||x.message||'').slice(0,120),at:x.created_at||x.createdAt}))).slice(0,700); if(n.s===200) break; }
o.t0=t0; return o;
