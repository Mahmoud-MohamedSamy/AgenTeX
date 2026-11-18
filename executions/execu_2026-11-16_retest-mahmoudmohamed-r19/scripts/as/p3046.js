var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));const id='f4f50454-205b-4579-b08f-4a011e566129';
const o=await rec(id);const f=await feed(id);const cr=f.find(e=>e.action==='ticket.created');
const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;
const r={num:o.ticket_number,owner:nm(o.owner),dept:nm(o.department),sla_name:o.sla_name,obl:(s?.obligations||[]).map(q=>q.kind+':'+q.state),created_initial:cr?.summary?.initial,feed:f.map(e=>e.occurred_at.slice(11,19)+' '+e.action+' '+JSON.stringify(e.summary||{}).slice(0,200))};
const x=JSON.parse(fs.readFileSync(OUT+'t3046-check.json','utf8'));x.screen=r;save('t3046-check.json',x);return r;
