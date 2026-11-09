eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data);const em=F.find(f=>f.id==='2eb122dd-1e6a-4cb2-b8f1-25e969da7c32');
const o={email:{labels:em.labels,lastModifiedAt:em.lastModifiedAt,by:em.lastModifiedByName,rv:em.rowVersion}};
const src=(await api('GET','/modules/'+T+'/layouts/0dabc9a3-c7f2-4f74-bd1b-9e21373a6c06')).j.data;
const find=L=>{for(const v of ['CREATE','DETAIL'])for(const s of L.views[v].layout.sections)for(const c of s.columns)for(const f of c.fields)if(f.fieldName==='email')return v+':'+JSON.stringify(f.labels);};
o.inAccounting=find(src);o.inMine=find((await api('GET','/modules/'+T+'/layouts/'+IDS.layout)).j.data);
const au=await api('GET','/audit/logs?limit=50&search=Email');o.auS=au.s;
const A=arr(au.j&&au.j.data);o.audit=A.filter(a=>JSON.stringify(a).includes('2eb122dd')).slice(0,6).map(a=>JSON.stringify(a).slice(0,400));
return o;
