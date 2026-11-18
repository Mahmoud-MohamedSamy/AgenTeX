eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/ntf/lib.js','utf8'));
const R={};const f=x=>{const o={};for(const d of (x.data||[])){const v=d.value||{};o[d.field]=v.value;}o.id=x.id;return o;};
for(const q of ['3000 ack','NTF 3000','ack tes']){const x=await api('GET','/modules/'+TK+'/records?limit=30&q='+encodeURIComponent(q));R['q '+q]=x.s+' '+JSON.stringify(Ls(x.j?.data).map(r=>{const o=r.data?f(r):r;return (o.ticket_number||'')+' '+MASK(o.subject||'').slice(0,60)+' '+(o.department===D?'NTFdept':'')+' '+(o.created_at||o.createdAt||'')}));}
const x=await api('GET','/modules/'+TK+'/records?limit=8&sort=-created_at');R.latest=x.s+' '+JSON.stringify(Ls(x.j?.data).map(r=>{const o=r.data?f(r):r;return (o.ticket_number||'')+' '+MASK(o.subject||'').slice(0,50)}));
return R;
