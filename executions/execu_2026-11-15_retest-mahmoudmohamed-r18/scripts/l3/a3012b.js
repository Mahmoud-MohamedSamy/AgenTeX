const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const b=arr((await api('GET','/modules/'+T+'/blueprints')).j.data);
o.top=Object.fromEntries(Object.entries(b[0]).filter(([k])=>k!=='definition'));
const d=b[0].definition; o.defTop=Object.fromEntries(Object.entries(d).filter(([k])=>!['states','transitions'].includes(k)));
o.all=b.map(x=>({n:x.definition.name,lay:x.definition.layoutId||x.layoutId,dep:x.definition.departmentId||x.definition.departmentIds||x.departmentId, ec:JSON.stringify(x.definition.entryCriteria||null).slice(0,100)}));
const withReq=b.flatMap(x=>x.definition.transitions.filter(t=>t.during&&t.during.requiredFields&&t.during.requiredFields.length).map(t=>({bp:x.definition.name,t:t.name,rf:t.during.requiredFields}))); o.withReq=JSON.stringify(withReq).slice(0,800);
return o;
