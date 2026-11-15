const r=(await api('GET','/notifications?limit=100')).j;const d=r?.data;const L=Array.isArray(d)?d:(d?.data||d?.items||[]);
return {keys:Object.keys(d||{}).join(','),meta:JSON.stringify(r?.meta||d?.meta||d?.pagination||'').slice(0,200),n:L.length,oldest:(L[L.length-1]?.created_at||''),newest:(L[0]?.created_at||'')};
