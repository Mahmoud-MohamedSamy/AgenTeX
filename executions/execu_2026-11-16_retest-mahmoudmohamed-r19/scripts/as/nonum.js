var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const rows=[];for(let p=1;p<20;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){const o={id:r.id,ca:r.created_at};for(const x of r.data||[])o[x.field]=x.value?.value;rows.push(o);}if(!g.j?.meta?.more_records)break;}
const nn=rows.filter(r=>!r.ticket_number);
const out=[];for(const r of nn){const f=await feed(r.id);out.push([r.id.slice(0,8),r.ca,String(r.subject).slice(0,45),r.status,nm(r.owner),nm(r.department),f.map(e=>e.action+(e.summary?.owner_id?':'+nm(e.summary.owner_id):'')+(e.summary?.reason?':'+e.summary.reason:'')).join(',')]);}
return {n:nn.length,out};
