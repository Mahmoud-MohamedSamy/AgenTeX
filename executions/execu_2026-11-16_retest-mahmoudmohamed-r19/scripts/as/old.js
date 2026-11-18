var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const R={};
for(const q of ['sort_by=created_at&sort_order=asc','sort_by=ticket_number&sort_order=asc']){
 const r=await api('GET','/modules/'+T+'/records?page=1&page_size=8&'+q);
 const L=arr(r.j?.data);R[q]={s:r.s,rows:L.map(x=>{const o={};for(const f of (x.data||[])){const v=f.value||{};o[f.field]=v.value;}return [x.id.slice(0,8),o.ticket_number,(x.created_at||'').slice(0,10),o.status,nm(o.department),nm(o.owner),String(o.subject||'').slice(0,40)];})};
}
return R;
