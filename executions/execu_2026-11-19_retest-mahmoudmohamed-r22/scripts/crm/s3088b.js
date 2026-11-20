const G='bffe3175-a1fa-4ef7-9da3-f89117f9b922',L='841043e1-c078-41f9-8d6e-dfd61bee45c3',F='qa_rt19_gs_tier';const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: '+m+'\n');
const seq=async dir=>{const r=await api('GET','/modules/'+L+'/records?page_size=200&sort_by='+F+'&sort_dir='+dir);const v=arr(r.j?.data).map(x=>(x.data||[]).find(z=>z.field===F)?.value?.value).filter(Boolean);return [...new Set(v)].join(' > ')+' ('+v.length+' with a value)';};
const put=async m=>{const g=(await api('GET','/global-sets/'+G)).j?.data;return (await api('PUT','/global-sets/'+G,{name:g.name,description:g.description,colors_enabled:g.colors_enabled,values:g.values,row_version:g.row_version,sort_order:m})).s;};
o.entered_asc=await seq('asc');o.entered_desc=await seq('desc');
o.toAlpha=await put('alphabetical');LED('3088: sort_order alphabetical');await sleep(2000);o.alpha_asc=await seq('asc');o.alpha_desc=await seq('desc');
o.back=await put('entered');LED('3088: sort_order back to entered');o.final=(await api('GET','/global-sets/'+G)).j?.data?.sort_order;return o;
