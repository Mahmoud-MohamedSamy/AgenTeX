var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const L=arr((await api('GET','/modules/'+T+'/records?page=1&page_size=40&sort_by=created_at&sort_order=asc')).j?.data);
const o={};
for(const x of L.slice(0,40)){const f=await feed(x.id);const msg=f.filter(e=>/message\.received|customer|reply/i.test(e.action)).map(e=>e.occurred_at.slice(0,10)+' '+e.action);const r={};for(const d of (x.data||[])){r[d.field]=(d.value||{}).value;}
 o[r.ticket_number]=[(x.created_at||'').slice(0,10),r.status,nm(r.department),nm(r.owner),String(r.subject||'').slice(0,30),msg.slice(0,4).join('; ')];}
return o;
