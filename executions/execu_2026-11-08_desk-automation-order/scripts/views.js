const r=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/views');const d=r.j?.data;const L=Array.isArray(d)?d:(d?.items||d?.views||[]);
const sys=L.filter(v=>v.is_system||v.system||v.type==='system'||v.kind==='system');
return {s:r.s,total:L.length,keys:L[0]?Object.keys(L[0]).join(','):'',system:(sys.length?sys:L).map(v=>[v.name,v.is_system??v.kind??v.type,v.scope||v.visibility||''].join(' | ')).slice(0,60)};
