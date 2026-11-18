var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';
const L=await listRules('round_robin',AOB);const mine=L.filter(r=>/QA RT19 AS/.test(r.name));
const out=mine.map(r=>[r.id.slice(0,8),r.name,r.is_active,r.version]);
let tr=null;if(mine[0]){const r=await api('PUT','/desk/assignment-rules/'+mine[0].id+'/active',{is_active:false,version:mine[0].version});tr=r.s+' '+r.t.slice(0,800);}
return {n:L.length,out,tr,sample:JSON.stringify(mine[0]).slice(0,1500)};
