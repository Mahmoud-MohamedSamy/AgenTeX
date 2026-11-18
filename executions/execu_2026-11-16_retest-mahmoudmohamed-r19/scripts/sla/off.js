eval(fs.readFileSync('sla/lib.js','utf8'));const R={};
for(const id of ['65a5a774-0a88-4748-ab8b-cd4bbb75cb1d','a52a8f61-8fe9-44d2-833f-2fe89420c488','e005d1fb-3b9f-4496-9baa-9595477603fb',CFG.a33.ids.p]){
 const g=(await api('GET','/desk/sla/policies/'+id)).j?.data;if(!g){R[id]='gone';continue;}if(!g.is_active){R[id]='already inactive';continue;}
 g.is_active=false;const p=await api('PUT','/desk/sla/policies/'+id,g);R[id]=p.s+' '+(p.s>=300?p.t.slice(0,200):'');
 const g2=(await api('GET','/desk/sla/policies/'+id)).j?.data;R[id]+=' now active='+g2.is_active;led(`SLA policy ${id} set inactive (${R[id]})`);}
const all=arr((await api('GET','/desk/sla/policies?department_id='+CFG.D)).j?.data).concat(arr((await api('GET','/desk/sla/policies?department_id='+CFG.DB)).j?.data));
R.activeLeft=all.filter(x=>x.is_active&&/QA RT19 SLA/.test(x.name)).map(x=>x.name);return R;
