const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: '+m+'\n');
const r=await api('POST','/global-sets',{name:'QA RT22 GS 3087',values:[{label:'Gold'},{label:'Silver'},{label:'Copper'}]});o.create=r.s;const id=r.j?.data?.id;if(id)LED('global set QA RT22 GS 3087 '+id);
const g=(await api('GET','/global-sets/'+id)).j?.data;o.keys=Object.keys(g||{}).join(',');
const vals=(g.values||[]).filter(v=>v.label!=='Copper');const u=await api('PUT','/global-sets/'+id,{name:g.name,description:g.description,colors_enabled:g.colors_enabled,values:vals,row_version:g.row_version});o.removeCopper=u.s+' '+(u.s>=300?u.t.slice(0,200):'');
const g2=(await api('GET','/global-sets/'+id)).j?.data;o.values=(g2.values||[]).map(v=>v.label);o.unused=JSON.stringify(g2.unused_values||g2.unusedValues||'').slice(0,200);
fs.writeFileSync('../out/3087.json',JSON.stringify({id}));return o;
