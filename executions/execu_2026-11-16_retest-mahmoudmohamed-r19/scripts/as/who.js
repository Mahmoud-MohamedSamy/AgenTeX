var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);
return L.filter(x=>/Mahmoud|Samy/i.test(JSON.stringify(x))).map(x=>[nm(x.user_id),x.name||x.display_name||x.full_name]);
