var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const M=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));const out=[];
const t0=M.tickets[M.tickets.length-1];const d0=(await api('GET','/desk/tickets/'+t0)).j?.data;out.push('desk keys: '+Object.keys(d0||{}).join(','));
for(const id of M.tickets){const r=await rec(id);const d=(await api('GET','/desk/tickets/'+id)).j?.data||{};out.push([d.ticket_number,(r.subject||'').slice(11),'rec',r.status,nm(r.owner),'desk',d.status,nm(d.owner_id||d.owner?.id||d.assignee_id)].join(' '));}
out.push('wl A1 '+(await wl(A1,AOB)).dept+' A3 '+(await wl(A3,AOB)).dept);return out;
