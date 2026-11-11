const l=await api('GET','/modules/'+L+'/records?page=1&page_size=100'); const rows=arr(l.j&&l.j.data); 
for(const r of rows){ const s=JSON.stringify(r); const m=s.match(/"field":"multi_select[^"]*","value":\{[^}]*\}/); if(m&&!/"value":null/.test(m[0])) return m[0]; }
const one=rows[0]; return {s:l.s, sample:JSON.stringify(one).slice(0,600)};
