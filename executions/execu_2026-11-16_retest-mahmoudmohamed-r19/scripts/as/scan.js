var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';
const out=[];let total=0;
for(let p=1;p<=12;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&page_size=100');const L=arr(r.j?.data);total+=L.length;
 for(const x of L){const o={};for(const d of (x.data||[])){o[d.field]=(d.value||{}).value;}if(o.department===AOB&&o.owner===A1)out.push([o.ticket_number,o.status,String(o.subject||'').slice(0,45),(x.created_at||'').slice(0,16),o.closed_time||o.closed_at||'']);}
 if(L.length<100)break;}
const s=(await api('GET','/modules/'+T+'/records?page=1&page_size=5&include_deleted=true')).s;
return {total,a1:out};
