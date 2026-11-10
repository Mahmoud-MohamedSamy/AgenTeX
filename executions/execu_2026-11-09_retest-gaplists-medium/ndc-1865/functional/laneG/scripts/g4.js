eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};
const ns=await api('GET','/desk/assignment/notification-settings');o.ns=ns.j&&ns.j.data;
const a=await api('GET','/desk/tickets/'+IDS.tickets[1]+'/activity');const L=arr(a.j&&a.j.data).length?arr(a.j.data):(a.j&&a.j.data&&(a.j.data.items||a.j.data.events))||[];o.act=L.slice(0,8).map(x=>(x.action||x.type)+' '+JSON.stringify(x.summary||x.changes||'').slice(0,250));
const r1=await api('GET','/desk/assignment-rules?type=direct');o.direct=(r1.j&&r1.j.data&&r1.j.data.rules||[]).map(x=>[x.name,x.is_active]).slice(0,30);o.directMeta=r1.j&&r1.j.data&&Object.keys(r1.j.data);o.directData=r1.j&&r1.j.data&&JSON.stringify({...r1.j.data,rules:undefined}).slice(0,400);
const r2=await api('GET','/desk/assignment-rules?type=round_robin&department_id='+IDS.D);o.rrData=r2.j&&r2.j.data&&JSON.stringify({...r2.j.data,rules:(r2.j.data.rules||[]).map(x=>[x.name,x.is_active])}).slice(0,500);
return o;
