// Bell check as the signed-in agent: notifications mentioning the NT19 tickets.
const n=(await api('GET','/notifications?limit=50&apps=desk')).j?.data;const L=Array.isArray(n)?n:(n?.items||n?.notifications||[]);
return L.filter(x=>/NT19/.test(JSON.stringify(x))).map(x=>(x.type||x.event||x.kind)+' | '+(x.title||'')+' | '+(x.created_at||'').slice(11,19));
