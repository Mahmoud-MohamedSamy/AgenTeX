// Bell entries for the G tickets.
const j=JSON.parse(fs.readFileSync('../g.json','utf8'));const n=(await api('GET','/notifications?limit=100')).j;const L=n?.data?.data||[];const nums=[j.n1,j.n2,j.n3,j.n5].filter(Boolean);
return L.filter(x=>nums.some(k=>(x.title||'').includes('#'+k))).map(x=>(x.type||'')+' | '+x.title);
