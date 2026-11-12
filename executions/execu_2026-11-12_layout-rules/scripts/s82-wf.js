const mid = await modId(); const r = await api('GET', '/workflow/rules?moduleId=' + mid + '&limit=100'); const L = arr(r.j.data); const out = { n: L.length, s: r.s };
const fu = L.find(x => JSON.stringify(x).includes('FieldUpdate')); out.ex = JSON.stringify(fu || L[0] || r.j).slice(0, 1800); return out;
