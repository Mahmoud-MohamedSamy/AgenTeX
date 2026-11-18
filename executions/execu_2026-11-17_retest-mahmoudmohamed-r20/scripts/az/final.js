var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const o={};const act=[];let n=0;
for(const d of [DA,DB,AOB])for(const r of await listRules('round_robin',d))if(/QA RT20 AZ/.test(r.name)){n++;if(r.is_active)act.push(r.name);}
o.rules=n+' AZ rules, active: '+JSON.stringify(act);
o.aob=JSON.stringify(await prefs(AOB))===fs.readFileSync(OUT+'ctl-prefs-orig.json','utf8').trim()||JSON.stringify(await prefs(AOB))===JSON.stringify(JSON.parse(fs.readFileSync(OUT+'ctl-prefs-orig.json','utf8')));
o.da=JSON.stringify(await prefs(DA))===JSON.stringify(JSON.parse(fs.readFileSync(OUT+'sk-prefs-orig.json','utf8')));
const M=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));const open=[];for(const id of M.tickets){const r=await rec(id);if(r.status!=='Closed'){await patch(id,{status:'Closed'});open.push(r.subject);}}o.tickets=M.tickets.length+' created, closed now: '+open.length;
o.wl='A1 '+(await wl(A1,AOB)).dept+' A3 '+(await wl(A3,AOB)).dept;LED('final check: '+JSON.stringify(o));return o;
