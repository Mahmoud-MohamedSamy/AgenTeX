var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const M=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));const out=[];
for(const id of M.tickets){const r=await rec(id);const d=(await api('GET','/desk/tickets/'+id)).j?.data;if(!/TH/.test(r.subject||''))continue;out.push([d?.ticket_number,r.subject.slice(11),'rec:',r.status,nm(r.owner),'desk:',d?.status,d?.status_type||d?.status_category||'',nm(d?.owner_id),d?.department_id===AOB?'AOB':'other']);}
out.push('wl A1 AOB '+JSON.stringify((await wl(A1,AOB)).raw));return out;
