const nums=JSON.parse(fs.readFileSync('../e2e1.json','utf8'));const n=(await api('GET','/notifications?limit=100')).j;const L=n?.data?.data||[];
const m=L.filter(x=>nums.some(k=>(x.title||'').includes('#'+k)));return m.length+': '+m.map(x=>(x.title||'').slice(0,40)).join(' | ');
