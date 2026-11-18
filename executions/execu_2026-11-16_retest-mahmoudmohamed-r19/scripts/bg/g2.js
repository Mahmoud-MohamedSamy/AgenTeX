var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const G='4e6a4894-fd19-4d6c-be8d-a8995614a57d';const o={};
o.rec=await rec(G);
o.dt=(await api('GET','/desk/tickets/'+G)).t.slice(0,3000);
o.wlA3=await wl(A3,AOB);o.wlA1=await wl(A1,AOB);
return o;
