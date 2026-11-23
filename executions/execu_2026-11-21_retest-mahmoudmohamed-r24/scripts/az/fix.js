var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const M=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));const out=[];
for(const id of M.tickets){const r=await rec(id);if(r.status!=='Closed'){const p=await patch(id,{status:'Closed'});await sleep(1500);const d=(await api('GET','/desk/tickets/'+id)).j?.data;out.push((d?.ticket_number)+' '+E(p)+' rec='+(await rec(id)).status+' desk='+d?.status);}}
LED('fix: closed leftover Open QA RT20 AZ tickets '+out.join('; '));const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';out.push('wl A1 '+(await wl(A1,AOB)).dept+' A3 '+(await wl(A3,AOB)).dept);return out;
