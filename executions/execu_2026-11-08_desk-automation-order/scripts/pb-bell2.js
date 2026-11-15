const n=(await api('GET','/notifications?limit=100')).j?.data;const L=Array.isArray(n)?n:(n?.data||n?.items||[]);const x=L.find(x=>/#3576/.test(x.title||''));return JSON.stringify(x).slice(0,1200);
