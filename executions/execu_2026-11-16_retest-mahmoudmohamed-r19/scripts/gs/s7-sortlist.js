const o={}; 
const put=async(so)=>{ const g=await gs(I.T); return api('PUT','/global-sets/'+I.T,{name:g.name,description:g.description,colors_enabled:g.colors_enabled,values:g.values,sort_order:so,row_version:g.row_version}); };
const tries={q:'q='+encodeURIComponent('QA RT19 GS'), f1:'filters='+encodeURIComponent(JSON.stringify({conditions:[{field:'first_name',operator:'equals',value:'QA RT19 GS'}]})), f2:'filters='+encodeURIComponent(JSON.stringify([{field:'first_name',operator:'eq',value:'QA RT19 GS'}])), f3:'filters='+encodeURIComponent(JSON.stringify([{field:'qa_rt19_gs_tier',operator:'is_not_empty'}]))};
const run=async(dir)=>{const out={}; for (const [k,t] of Object.entries(tries)) { const x=await api('GET','/modules/'+L+'/records?per_page=100&sort_by=qa_rt19_gs_tier&sort_dir='+dir+'&'+t); const rows=arr(x.j&&x.j.data); out[k]=x.s+' n='+rows.length+' '+(x.t.match(/Tier L[A-Z0-9]+/g)||[]).join(','); } return out;};
o.entered_asc=await run('asc');
await put('alphabetical'); o.alpha_asc=await run('asc'); await put('entered');
return o;
