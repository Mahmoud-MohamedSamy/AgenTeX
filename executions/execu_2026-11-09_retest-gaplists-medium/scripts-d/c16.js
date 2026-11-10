const o={};
for(const q of ['quokkatag','#quokkatag','platypusnote','zebracornflake','platypusnote EDITED']){const r=await api('GET','/search?q='+encodeURIComponent(q)+'&limit=20');const gs=r.j&&r.j.data&&r.j.data.groups||[];o[q]=r.s+' '+JSON.stringify(gs.filter(g=>(g.hits||[]).length).map(g=>({g:g.module_label||g.label||g.key||g.module_key,hits:(g.hits||[]).map(h=>(h.title&&h.title.text||h.title||'').toString().slice(0,40)+(h.matched_field?' via '+h.matched_field:'')+(h.snippet?' snip:'+JSON.stringify(h.snippet).slice(0,60):''))})));}
const r=await api('GET','/search?q=quokkatag&limit=5');o.rawHit=JSON.stringify(r.j.data.groups.find(g=>(g.hits||[]).length)).slice(0,500);
return o;
