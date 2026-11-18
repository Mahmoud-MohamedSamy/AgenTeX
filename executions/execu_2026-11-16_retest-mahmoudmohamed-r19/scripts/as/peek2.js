var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const R=JSON.parse(fs.readFileSync(OUT+'tload.json','utf8'));const o={};
for(const k of ['LB1','LB2','LB3']){const id=R[k];const r=await rec(id);o[k]={owner:nm(r.owner),status:r.status,dept:nm(r.department),subject:r.subject,feed:(await feed(id)).map(e=>e.occurred_at.slice(11,19)+' '+e.action+' '+JSON.stringify(e.summary||{}).slice(0,300))};}
const rules=await listRules('round_robin',DA);o.rule=rules.filter(r=>/load check A/.test(r.name)).map(r=>JSON.stringify({a:r.is_active,t:r.targets}).slice(0,600));
return o;
