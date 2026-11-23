const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const M=JSON.parse(fs.readFileSync('out/2799-made.json','utf8'));const o={};
for(const [k,t] of Object.entries(M.tickets)){
 const st=(((await api('GET','/modules/'+TK+'/records/'+t.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).activeStates;
 const reps=arr((await api('GET','/desk/tickets/'+t.id+'/replies')).j?.data).map(x=>[x.created_at?.slice(11,19),x.direction,x.mode,x.is_public,(x.subject||'').slice(0,50)]);
 const act=arr((await api('GET','/desk/tickets/'+t.id+'/activity')).j?.data).filter(x=>x.occurred_at>'2026-11-21T18:13').map(x=>[x.occurred_at.slice(11,19),x.action,JSON.stringify(x.summary||{}).slice(0,160)]);
 o[k]={num:t.num,st,reps,act};}
const r=await api('GET','/modules/'+TK+'/records?page=1&per_page=5&sort_by=created_at&sort_dir=desc');
o.newest=arr(r.j?.data).map(x=>{const d=x.data||x;const g=f=>{const v=Array.isArray(d)?(d.find(y=>y.field===f)||{}).value:d[f];return v&&typeof v==='object'?v.value:v};return [x.created_at?.slice(11,19),g('ticket_number'),String(g('subject')||'').slice(0,50)]});
return o;
