var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const o={};
for(const b of [{filter:{kind:'And',children:[{kind:'Equals',field:'department',value:AOB},{kind:'Equals',field:'owner',value:A1}]},limit:200},{criteria:{op:'and',children:[{op:'eq',field:'department',value:AOB},{op:'eq',field:'owner',value:A1}]},limit:200},{limit:5}]){const r=await api('POST','/modules/'+T+'/records/query',b);o[JSON.stringify(b).slice(0,40)]=r.s+' '+r.t.slice(0,400);}
const g=await api('GET','/modules/'+T+'/records?page=1&per_page=5');o.get=g.s+' '+JSON.stringify(g.j?.meta)+' '+JSON.stringify(g.j?.data?.[0]||g.j?.data?.items?.[0]||'').slice(0,600);
return o;
