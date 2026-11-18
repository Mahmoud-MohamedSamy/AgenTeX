eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/ntf/lib.js','utf8'));
const f=x=>{const o={};for(const d of (x.data||[])){const v=d.value||{};o[d.field]=v.value;}return o;};
const id=JSON.parse(fs.readFileSync(OUT+'t4745.json','utf8')).id;const R={};
for(let i=0;i<1;i++){const x=await api('GET','/modules/'+TK+'/records?limit=10&q='+encodeURIComponent('inbound check'));const L=Ls(x.j?.data);
 const fd=(await feed(id)).filter(h=>h.occurred_at>'2026-11-17');
 if(L.length||fd.length){R.tickets=L.map(r=>{const o=r.data?f(r):r;return (o.ticket_number||'')+' '+MASK(o.subject||'')+' '+(o.department===D?'NTFdept':'')+' '+o.status});R.r4745=fd.map(h=>h.action+' '+h.occurred_at);R.ids=L.map(r=>r.id);fs.writeFileSync(OUT+'t-inbound.json',JSON.stringify(R.ids));break;}
 await sleep(30000);}
R.checked=new Date().toISOString();return R;
