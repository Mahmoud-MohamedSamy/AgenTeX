const n=(await api('GET','/notifications?limit=100')).j;const L=n?.data?.data||[];
return L.filter(x=>/NT19|227[0-2]|226[7-9]/.test(JSON.stringify(x))).map(x=>(x.type||x.event_type||x.kind||'')+' | '+(x.title||'')+' | '+(x.created_at||'').slice(11,19));
