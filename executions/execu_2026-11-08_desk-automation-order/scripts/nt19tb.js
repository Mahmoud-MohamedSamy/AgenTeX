const n=(await api('GET','/notifications?limit=50&category=general&modules=desk&apps=desk')).j?.data;const L=Array.isArray(n)?n:(n?.items||n?.notifications||n?.data||[]);
const h=L.filter(x=>/2816|2817|NT19T/.test(JSON.stringify(x)));
return {total:L.length,latest:(L[0]?.created_at||'')+' '+(L[0]?.title||'').slice(0,80),hits:h.map(x=>(x.type||x.event_type||'')+' | '+(x.title||'').slice(0,100)+' | '+(x.created_at||'').slice(11,19))};
