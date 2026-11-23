const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const M=JSON.parse(fs.readFileSync('out/2799-made.json','utf8'));const o={};
for(const [k,t] of Object.entries(M.tickets)){
 const st=(((await api('GET','/modules/'+TK+'/records/'+t.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).activeStates;
 const h=arr((await api('GET','/desk/tickets/'+t.id+'/history')).j?.data).slice(0,8).map(x=>[x.at||x.created_at||x.occurred_at,x.summary||x.title||x.action||x.type,(x.description||x.detail||'').toString().slice(0,90)]);
 const th=await api('GET','/desk/tickets/'+t.id+'/threads');
 o[k]={num:t.num,st,h,threads:th.s,thr:arr(th.j?.data).slice(0,6).map(x=>[x.created_at||x.sent_at,x.direction,x.visibility,x.mode||x.kind,(x.subject||'').slice(0,50),(x.from||x.from_address||'').toString().replace(/[^@\s]+@gmail\.com/,'G')])};
}
return o;
