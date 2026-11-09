const id='1ca764d4-2dfb-40dc-99ba-3ea6e2fd081f'; const out={};
for(const w of ['u1','o']){ const n=await api(w,'GET',`/modules/${T.LEADS}/records/${id}/notes?page_size=30`); out[w+'_notes']=n.s+' '+n.t.slice(0,400); const f=await api(w,'GET',`/timeline/records/leads/${id}/feed?pageSize=30`); out[w+'_feed']=f.s+' '+(f.j?.data?.data||[]).length+' '+(f.j?.data?.data||[]).map(e=>e.entry_type).join(','); }
const me=await api('u1','GET','/timeline/me/visibility'); out.meVis=me.s+' '+me.t.slice(0,200);
return out;
