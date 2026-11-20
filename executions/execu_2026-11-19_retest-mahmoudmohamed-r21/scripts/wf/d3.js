const o={};const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const rs=arr((await api('GET','/workflow/rules?take=200&moduleId='+T)).j?.data);o.n=rs.length;
const ap=rs.find(r=>/Approval Status/i.test(r.name));o.ap=ap&&JSON.stringify({id:ap.id,name:ap.name,c:ap.criteria}).slice(0,900);
const all=rs.map(r=>JSON.stringify(r.criteria)).join('\n');o.kinds=[...new Set([...all.matchAll(/"kind":"([A-Za-z]+)"/g)].map(m=>m[1]))];
const pick=rs.find(r=>/Picklist|In|Equals/.test(JSON.stringify(r.criteria))&&!/QA/.test(r.name));o.ex=pick&&JSON.stringify(pick.criteria).slice(0,700);
const f=await api('GET','/modules/'+T+'/fields?take=300');const F=arr(f.j?.data);o.fs=f.s;o.fk=Object.keys(F[0]||{});
o.lists=F.filter(x=>/pick|list|select|enum/i.test(x.dataType||x.type||'')).map(x=>[x.apiName||x.key||x.name,x.label,x.dataType||x.type,x.isCustom??x.custom,(x.options||x.picklistValues||[]).slice(0,4).map(p=>(p.value||p.apiValue)+'='+(p.label||p.displayValue))]);
o.lookups=F.filter(x=>/lookup|relation|reference/i.test(x.dataType||x.type||'')).map(x=>[x.apiName||x.key||x.name,x.label,x.dataType||x.type,JSON.stringify(x.lookup||x.relatedModuleId||x.targetModuleId||'').slice(0,80)]);
return o;
