const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const S='QA NDC Distributor';
const snap={tag:process.env.TAG,at:new Date().toISOString().slice(11,19),type:((await api('GET','/desk/ticket-statuses')).j?.data?.statuses||[]).find(x=>x.value===S)?.type};
snap.workload=(((await api('GET','/desk/agents/'+OWNER+'/workload')).j?.data?.departments||[]).find(d=>d.department_id===X.DD)||{}).open_tickets;
for(const [k,id] of Object.entries(X.t)){const t=(await api('GET','/desk/tickets/'+id)).j?.data||{};const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data||{};snap[k]={status:t.status,closed_at:t.closed_at?t.closed_at.slice(11,19):'-',sla:(s.obligations||[]).map(x=>x.kind+':'+x.state+':'+(x.remaining_seconds??'-')).join(' ')||s.state};}
fs.appendFileSync(RUN+'/out/3136-snaps.jsonl',JSON.stringify(snap)+'\n');return snap;
