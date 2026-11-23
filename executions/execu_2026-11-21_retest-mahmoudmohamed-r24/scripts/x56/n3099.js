const T=JSON.parse(fs.readFileSync(RUN+'/out/3099.json','utf8'));const r=await api('GET','/notifications?limit=40');const L2=arr(r.j?.data?.items||r.j?.data);
const mine=L2.filter(x=>JSON.stringify(x).includes(String(T.n))||JSON.stringify(x).includes(T.id)).map(x=>(x.created_at||x.createdAt||'').slice(11,19)+' '+(x.title||x.subject||'')+' | '+String(x.body||x.message||'').slice(0,80));
const g=await api('GET','/desk/tickets/'+T.id);return {n:L2.length,keys:Object.keys(L2[0]||{}).join(','),latest:L2.slice(0,3).map(x=>(x.title||'')+' | '+(x.created_at||'').slice(11,19)),for5711:mine,open:g.s};
