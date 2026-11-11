const n=(await api('GET','/notifications?limit=5&category=general&modules=desk&apps=desk')).j?.data;const L=Array.isArray(n)?n:(n?.items||n?.notifications||[]);
return L.slice(0,4).map(x=>JSON.stringify(x).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<e>').slice(0,400));
