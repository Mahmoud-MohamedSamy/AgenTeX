const X=JSON.parse(fs.readFileSync(RUN+'/out/3135.json','utf8'));const o={at:new Date().toISOString().slice(11,19),t:[]};
for(const id of X.ids){const rv=(await rec(id)).status;const d=(await api('GET','/desk/tickets/'+id)).j?.data||{};o.t.push(d.ticket_number+' rec='+rv+' desk='+d.status+' closed_at='+(d.closed_at||'-').slice(11,19)+' upd='+(d.updated_at||'').slice(11,19));}
o.wl=(((await api('GET','/desk/agents/'+OWNER+'/workload')).j?.data?.departments||[]).find(d=>d.department_id===X.DD||d.department_id===JSON.parse(fs.readFileSync(RUN+'/scripts/k/vo.json','utf8')).DD)||{}).open_tickets;
fs.appendFileSync(RUN+'/out/3135-snaps.jsonl',JSON.stringify(o)+'\n');return o;
