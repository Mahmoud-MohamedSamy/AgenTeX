eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/ntf/lib.js','utf8'));
const f=x=>{const o={};for(const d of (x.data||[])){const v=d.value||{};o[d.field]=v.value;}o.id=x.id;return o;};
const id=JSON.parse(fs.readFileSync(OUT+'t4745.json','utf8')).id;const R={};
R.f4745=(await feed(id)).filter(h=>h.occurred_at>'2026-11-17').map(h=>h.action+' '+h.occurred_at.slice(11,19)+' '+MASK(JSON.stringify(h.summary||{})).slice(0,230));
const x=await api('GET','/modules/'+TK+'/records?limit=10&q='+encodeURIComponent('inbound check'));
for(const r of Ls(x.j?.data).map(f)){R['t'+r.ticket_number]={subj:MASK(r.subject||''),status:r.status,created:r.created_at||r.createdAt,feed:(await feed(r.id)).map(h=>h.action+' '+h.occurred_at.slice(11,19)+(/reply/.test(h.action)?' '+MASK(JSON.stringify(h.summary||{})).slice(0,160):''))};}
return R;
