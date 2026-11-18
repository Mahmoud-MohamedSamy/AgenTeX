eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/ntf/lib.js','utf8'));
const f=x=>{const o={};for(const d of (x.data||[])){const v=d.value||{};o[d.field]=v.value;}return o;};
const R={};for(const q of ['3000 ack','4745','NTF 3000']){const x=await api('GET','/modules/'+TK+'/records?limit=30&q='+encodeURIComponent(q));R[q]=Ls(x.j?.data).map(r=>{const o=r.data?f(r):r;return (o.ticket_number||'')+' '+MASK(o.subject||'').slice(0,70)+' '+(o.status||'')});}
const x=await api('GET','/modules/'+TK+'/records?limit=6');R.latest=Ls(x.j?.data).map(r=>{const o=r.data?f(r):r;return (o.ticket_number||'')+' '+MASK(o.subject||'').slice(0,60)});
return R;
