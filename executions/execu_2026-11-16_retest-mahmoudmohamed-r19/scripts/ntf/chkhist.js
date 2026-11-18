eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/ntf/lib.js','utf8'));
const f=x=>{const o={};for(const d of (x.data||[])){const v=d.value||{};o[d.field]=v.value;}o.id=x.id;return o;};
const R={};
for(const n of ['4829','4807','4811','4699']){const x=await api('GET','/modules/'+TK+'/records?limit=5&q='+n);const r=Ls(x.j?.data).map(f).find(o=>String(o.ticket_number)===n);if(!r){R[n]='not found';continue;}
 const t=await api('GET','/desk/tickets/'+r.id);const h=await histRaw(r.id);const fd=await feed(r.id);
 R[n]={recStatus:r.status,closed:r.closed_time||r.closed_at||null,deskStatus:t.j?.data?.status||t.j?.data?.status_name||t.s,hist:h.map(e=>e.action+(e.field_key?':'+e.field_key:'')+' '+String(e.occurred_at).slice(0,16)),feed:fd.slice(0,10).map(e=>e.action+' '+String(e.occurred_at).slice(0,16))};}
return R;
