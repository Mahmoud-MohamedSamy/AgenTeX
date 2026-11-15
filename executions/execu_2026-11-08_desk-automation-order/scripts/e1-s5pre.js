// Owner view before step 5: SLA state (breach?) and A2-visible state.
eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));
const s=(await api('GET','/desk/tickets/'+M.t+'/sla')).j?.data;return {violated:s?.violated,obl:(s?.obligations||[]).map(q=>q.kind+':'+q.state+' due '+(q.due_at||'').slice(11,16)+(q.breached_at?' breached '+q.breached_at.slice(11,19):'')),next:s?.next_escalation,history:await (async()=>{eval(fs.readFileSync('lib-pb.js','utf8'));return feedS(M.t);})()};
