eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/ntf/lib.js','utf8'));
const id=JSON.parse(fs.readFileSync(OUT+'t4745.json','utf8')).id;
return (await feed(id)).filter(h=>/reply/.test(h.action)).map(h=>h.action+' '+h.occurred_at+' '+MASK(JSON.stringify(h.summary)).slice(0,400));
