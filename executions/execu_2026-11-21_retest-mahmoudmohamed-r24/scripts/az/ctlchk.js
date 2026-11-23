var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const R=JSON.parse(fs.readFileSync(OUT+'ctl.json','utf8'));const f=await feed(R.t);const d=(await api('GET','/desk/tickets/'+R.t)).j?.data;
return {now:new Date().toISOString(),owner:await own(R.t),n:d?.ticket_number,feed:f.map(e=>[e.action,e.occurred_at]),rule:(await getRule(R.rid))?.is_active};
