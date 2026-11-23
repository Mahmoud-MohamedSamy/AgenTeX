const M=JSON.parse(fs.readFileSync('out/2799-made.json','utf8'));const o={};
for(const k of ['PRIV1','PUB1','ALL2']){const t=M.tickets[k];
 const a=await api('GET','/desk/tickets/'+t.id+'/activity');const r=await api('GET','/desk/tickets/'+t.id+'/replies');
 o[k]={act:a.s,actItems:arr(a.j?.data).slice(0,8).map(x=>[x.created_at||x.at,x.type||x.kind,x.direction,x.visibility,(x.subject||x.title||'').slice(0,60)]),rep:r.s,repItems:arr(r.j?.data).slice(0,8).map(x=>[x.created_at,x.direction,x.mode,x.visibility,x.status,(x.subject||'').slice(0,60)])};}
return o;
