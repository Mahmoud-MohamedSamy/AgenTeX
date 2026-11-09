eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const g=await api('GET','/modules/'+T+'/layouts/'+IDS.layout);const L=g.j.data;
const c=L.views.CREATE.layout.sections[0].columns[0];return {viewKeys:Object.keys(L.views.CREATE),layoutKeys:Object.keys(L.views.CREATE.layout),col:Object.keys(c),f0:JSON.stringify(c.fields[0]).slice(0,800),f1:JSON.stringify(c.fields[1]).slice(0,500)};
