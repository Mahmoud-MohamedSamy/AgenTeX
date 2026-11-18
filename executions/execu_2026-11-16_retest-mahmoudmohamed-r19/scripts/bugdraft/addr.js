const SRC=fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-08_desk-automation-order/scripts/e1-ev.js','utf8');
const NEW=SRC.match(/const NEW='([^']+)'/)[1];const [lp,d]=NEW.toLowerCase().split('@');const u=lp.replace(/\+.*/,'');
const ag=await api('GET','/desk/agents?page_size=200');const agents=arr(ag.j?.data);
const mine=agents.filter(a=>{const e=(a.email||'').toLowerCase();return e.split('@')[1]===d&&e.split('@')[0].replace(/\+.*/,'')===u;}).map(a=>({name:a.displayName||a.name||a.fullName,email:a.email,status:a.status||a.isActive}));
return {contact:NEW,agentsOnSameInbox:mine,agentCount:agents.length,s:ag.s};
