const r=await api('GET','/notifications?limit=40');const X=r.j&&r.j.data&&(r.j.data.data||r.j.data);const L=Array.isArray(X)?X:[];
return {s:r.s,g06:L.filter(n=>/G06/.test(JSON.stringify(n))).map(n=>(n.event_type||'')+' | '+(n.title||'')+' | '+(n.created_at||n.createdAt||''))};
