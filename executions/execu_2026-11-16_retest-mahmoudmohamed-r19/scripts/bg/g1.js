var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const G='4e6a4894-fd19-4d6c-be8d-a8995614a57d';const o={};
const raw=await api('GET','/modules/'+T+'/records/'+G);o.raw=raw.s+' '+raw.t.slice(0,2500);
o.feed=(await api('GET','/desk/tickets/'+G+'/activity')).t.slice(0,600);
o.hist=(await api('GET','/desk/tickets/'+G+'/history')).t.slice(0,600);
o.dt=(await api('GET','/desk/tickets/'+G)).t.slice(0,800);
const rows=await allRows();o.total=rows.length;o.nonum=rows.filter(r=>!r.ticket_number).map(r=>[r.id,r.ca,r.subject,r.status,nm(r.owner),nm(r.department)]);
const nums=rows.map(r=>+r.ticket_number).filter(Boolean);const s=new Set(nums);o.around=[];for(let n=4535;n<=4560;n++)o.around.push(n+':'+(s.has(n)?(rows.find(r=>+r.ticket_number===n).subject||'').slice(0,40):'MISSING'));
return o;
