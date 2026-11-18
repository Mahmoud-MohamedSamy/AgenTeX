eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/ntf/lib.js','utf8'));
const R={};
for(const p of ['/desk/channels/email-log?limit=15','/desk/email-logs?limit=15','/desk/channels/quarantine?limit=15','/desk/channels/addresses']){const r=await api('GET',p);R[p]=r.s+' '+MASK(r.t).replace(/"(id|tenant_id|department_id)":"[^"]+",?/g,'').slice(0,1800);}
return R;
