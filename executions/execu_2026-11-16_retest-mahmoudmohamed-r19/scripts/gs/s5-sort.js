const o={};
o.restoreBronze=SR(await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Bronze']}));
// make records: LS1 Silver, LB1 Bronze, add Platinum lead; values order entered: Silver, Platinum, Bronze?
const lp=await mkRec(L,'Tier LP1',{qa_rt19_gs_tier:'Platinum'}); I.R.LP1=lp[1]; SAVE();
let g=await gs(I.T); o.entered=g.values.map(v=>v.value).join(',')+' sort='+g.sort_order;
const put=async(so)=>{ g=await gs(I.T); return api('PUT','/global-sets/'+I.T,{name:g.name,description:g.description,colors_enabled:g.colors_enabled,values:g.values,sort_order:so,row_version:g.row_version}); };
let r=await put('alphabetical'); o.putAlpha=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); LED('set '+I.T+' sort_order → alphabetical ('+r.s+')');
g=await gs(I.T); o.afterAlpha=g.values.map(v=>v.value).join(',')+' sort='+g.sort_order;
const f=arr((await api('GET','/modules/'+L+'/fields')).j.data).find(x=>x.id===I.fL); o.fieldOpts=JSON.stringify(f.datatypeOptions||f.datatype_options).slice(0,400)+' cfg '+JSON.stringify(f.config).slice(0,300);
// list view sort by field
for (const q of ['?sort=qa_rt19_gs_tier&order=asc','?sort_by=qa_rt19_gs_tier&sort_dir=asc','?sort=qa_rt19_gs_tier:asc']) { const x=await api('GET','/modules/'+L+'/views/'+I.V+'/records'+q+'&limit=50'); o['vr '+q]=x.s+' '+(x.t.match(/Tier (L[A-Z0-9]+)/g)||[]).join(','); }
return o;
