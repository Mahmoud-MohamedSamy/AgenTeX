eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));
const r=await rec(M.t);const s=(await api('GET','/desk/tickets/'+M.t+'/sla')).j?.data;const bs=((await api('GET','/modules/'+T+'/records/'+M.t+'/blueprint-state')).j?.data?.states||[])[0];
const th=(await api('GET','/desk/tickets/'+M.t+'/threads?limit=20')).j?.data;const TL=Array.isArray(th)?th:(th?.items||th?.threads||[]);
return {status:r.status,blueprint:bs?.activeStates,obl:(s?.obligations||[]).map(q=>q.kind+':'+q.state+(q.completed_at?' done '+q.completed_at.slice(11,19):'')+(q.paused_at?' paused '+q.paused_at.slice(11,19):'')+' due '+(q.due_at||'').slice(11,16)),
 threads:TL.map(t=>(t.direction||t.type||'')+' '+(t.channel||'')+' '+(t.status||t.delivery_status||'')+' to:'+String(JSON.stringify(t.to||'')).replace(/mahmoud\.mmohamedsamy/g,'G')),history:await feedS(M.t)};
