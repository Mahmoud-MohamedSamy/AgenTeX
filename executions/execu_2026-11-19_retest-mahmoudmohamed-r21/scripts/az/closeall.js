var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const M=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));const out=[];for(const id of M.tickets){const d=(await api('GET','/desk/tickets/'+id)).j?.data;if(d&&d.status!=='Closed'){const c=await api('POST','/desk/tickets/'+id+'/close',{});out.push(d.ticket_number+':'+c.s);}}
LED('closed via /desk close (desk projection was stale Open): '+out.join(' '));return out;
