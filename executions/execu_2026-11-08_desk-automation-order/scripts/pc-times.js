eval(fs.readFileSync('lib-as.js','utf8'));const r=JSON.parse(fs.readFileSync('../pc5d-result.json','utf8'));const o={};
const s=(await api('GET','/modules/'+T+'/records?limit=10&search=PC5')).j?.data;const L=Array.isArray(s)?s:(s?.items||[]);
for(const x of L){const f=await feed(x.id);const c=f.find(e=>e.action==='ticket.created');const num=(x.data||[]).find(d=>d.field==='ticket_number')?.value?.value;o[num]=(c?.occurred_at||'').slice(11,19);}return o;
