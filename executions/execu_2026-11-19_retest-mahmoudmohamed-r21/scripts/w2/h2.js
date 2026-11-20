const r=await api('GET',`/desk/tickets/da96e91b-3f0c-4c56-a4ba-7fb13a52055a/history`);
const d=r.j?.data;const h=Array.isArray(d)?d:(d?.items||d?.events||[]);
return {s:r.s,shape:Array.isArray(d)?'arr':Object.keys(d||{}),rows:h.map(x=>JSON.stringify(x).replace(/"[0-9a-f-]{36}"/g,'"<id>"').slice(0,400))};
