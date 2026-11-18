var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const rows=[];
for(let p=1;p<20;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){const o={id:r.id,del:r.is_deleted};for(const x of r.data||[]){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value;}rows.push({id:o.id,n:o.ticket_number,st:o.status,ow:o.owner,d:o.department,del:o.del,sp:o.is_spam,sub:String(o.subject||'').slice(0,50)});}if(!g.j?.meta?.more_records)break;}
save('allt.json',rows);
const pick=(u,d)=>{const L=rows.filter(r=>r.ow===u&&r.d===d);const c={};for(const r of L)c[r.st]=(c[r.st]||0)+1;return c;};
return {total:rows.length,A1_AOB:pick(A1,AOB),A3_AOB:pick(A3,AOB),A1_DA:pick(A1,DA),A3_DA:pick(A3,DA),A1_all:rows.filter(r=>r.ow===A1&&r.st!=='Closed').length,statuses:[...new Set(rows.map(r=>r.st))],wlA1:await wl(A1,AOB),wlA3:await wl(A3,AOB)};
