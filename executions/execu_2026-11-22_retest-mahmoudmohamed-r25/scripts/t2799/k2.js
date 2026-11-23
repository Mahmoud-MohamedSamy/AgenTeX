const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const M=JSON.parse(fs.readFileSync('../out/2799-made2.json','utf8'));const o={now:new Date().toISOString()};
for(const [k,t] of Object.entries(M.t)){
 const reps=arr((await api('GET','/desk/tickets/'+t.id+'/replies')).j?.data).map(x=>[x.created_at?.slice(11,19),x.direction,x.mode,x.is_public,(x.subject||'').slice(0,45)]);
 const act=arr((await api('GET','/desk/tickets/'+t.id+'/activity')).j?.data).filter(x=>x.occurred_at>'2026-11-22T10:34').map(x=>[x.occurred_at.slice(11,19),x.action,x.source,JSON.stringify(x.summary||{}).slice(0,160)]);
 const d=(await api('GET','/modules/'+TK+'/records/'+t.id)).j?.data?.data||[];const st=((d.find(x=>x.field==='status')||{}).value||{}).value;
 const bs=(((await api('GET','/modules/'+TK+'/records/'+t.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).activeStates;
 o[k]={num:t.num,status:st,bs,reps,act};}
const r=await api('GET','/modules/'+TK+'/records?page=1&per_page=4&sort_by=created_at&sort_dir=desc');
o.newest=arr(r.j?.data).map(x=>x.created_at?.slice(0,19));
const h=await api('GET','/desk/channels/inbound-health');o.health=h.s+' '+JSON.stringify(h.j?.data);
fs.writeFileSync('../out/2799-check2.json',JSON.stringify(o,null,1));return o;
