const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const l=(await api('GET','/modules/'+T+'/layouts/1b55c25d-eb27-4046-afd1-b292398b435b')).j.data; o.keys=Object.keys(l); o.deps=l.departmentIds; o.views=Object.keys(l.views||{});
const v=l.views[Object.keys(l.views)[0]]; o.vkeys=Object.keys(v); const fs_=v.layout.sections.flatMap(s=>s.columns.flatMap(c=>c.fields)); o.fields=fs_.map(f=>f.fieldName+':'+f.datatypeKey+(f.isMandatory?'*':'')).join(', ');
const r=(await api('GET','/modules/'+T+'/layout-rules/3fa88cbd-8cda-4c76-b609-2e7fe3116d08')).j.data; o.rule=JSON.stringify(r).slice(0,1500);
return o;
