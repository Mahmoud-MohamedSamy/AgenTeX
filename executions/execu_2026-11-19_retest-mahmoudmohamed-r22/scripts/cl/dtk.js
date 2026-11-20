const T='88e8ea44-1658-4df3-9930-d0902b91073d';const inv=JSON.parse(fs.readFileSync('../out/inv-desk.json','utf8'));const deps=new Set(inv.cfg.departments.map(x=>x[0]));const o={pages:0,total:0,byDep:{},depField:''};const hit=[];
for(let page=1;page<=80;page++){const r=await api('GET','/modules/'+T+'/records?per_page=200&page='+page);if(r.s>=300){o.err=r.s;break;}const L=arr(r.j?.data);o.pages=page;o.total+=L.length;
 for(const x of L){const f=(x.data||[]).find(z=>deps.has(String(z.value?.value||z.value?.id||'')));if(f){o.depField=f.field;const d=String(f.value.value||f.value.id);o.byDep[d.slice(0,8)]=(o.byDep[d.slice(0,8)]||0)+1;hit.push([x.id,d]);}}
 if(L.length<200)break;}
fs.writeFileSync('../out/qa-dept-tickets.json',JSON.stringify(hit));return o;
