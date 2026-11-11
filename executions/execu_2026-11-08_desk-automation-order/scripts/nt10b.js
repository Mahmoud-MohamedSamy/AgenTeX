const n=(await api('GET','/notifications?limit=50&category=general&modules=desk&apps=desk')).j?.data;const L=Array.isArray(n)?n:(n?.items||n?.notifications||n?.data||[]);
return L.filter(x=>/2818|NT10r|rating|happiness/i.test(JSON.stringify(x))).map(x=>(x.type||x.event_type||'')+' | '+(x.title||'').slice(0,100)+' | '+(x.created_at||'').slice(11,19));
