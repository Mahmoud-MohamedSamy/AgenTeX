var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const M=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));const id=M.tickets[0];const out={};
out.patchDesk=E(await api('PATCH','/desk/tickets/'+id,{status:'On Hold'}));await sleep(3000);out.after=[(await rec(id)).status,(await api('GET','/desk/tickets/'+id)).j?.data?.status];
out.close=E(await api('POST','/desk/tickets/'+id+'/close',{}));await sleep(3000);out.after2=[(await rec(id)).status,(await api('GET','/desk/tickets/'+id)).j?.data?.status];return out;
