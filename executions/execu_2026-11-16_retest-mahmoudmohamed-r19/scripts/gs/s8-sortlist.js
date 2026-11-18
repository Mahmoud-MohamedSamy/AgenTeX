const o={}; 
const put=async(so)=>{ const g=await gs(I.T); return api('PUT','/global-sets/'+I.T,{name:g.name,description:g.description,colors_enabled:g.colors_enabled,values:g.values,sort_order:so,row_version:g.row_version}); };
const run=async(dir)=>{ const x=await api('GET','/modules/'+L+'/records?per_page=100&sort_by=qa_rt19_gs_tier&sort_dir='+dir+'&q='+encodeURIComponent('QA RT19 GS')); return arr(x.j.data).map(r=>{const s=JSON.stringify(r); return ((s.match(/Tier (L[A-Z0-9]+)/)||[])[1])+':'+((s.match(/"qa_rt19_gs_tier","value":\{"kind":"[a-z_]+","value":"([^"]+)/)||s.match(/"qa_rt19_gs_tier":"?([^",}]+)/)||[])[1]);}).join(' '); };
o.entered_asc=await run('asc'); o.entered_desc=await run('desc');
await put('alphabetical'); o.alpha_asc=await run('asc'); o.alpha_desc=await run('desc'); await put('entered');
o.values=(await gs(I.T)).values.map(v=>v.value).join(',');
return o;
