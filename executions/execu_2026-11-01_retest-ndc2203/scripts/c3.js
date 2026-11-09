const out = {};
for (const [k, id] of [['B13', '081b37e7-5a5c-4038-a32e-f8a3d4f23753'], ['B14', '284b780c-e8d4-466d-a93b-b9061889e16d'], ['B02', 'b7a7b3c6-f6e6-4abc-a4f9-3a2e7832689a']]) {
  const d = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data); out[k] = d.map(e => ({ outcome: e.outcome, disp: (e.dispatches || []).map(x => JSON.stringify(x).replace(/,"[a-zA-Z]+":null/g, '').slice(0, 500)) })); }
return fin(out);
