const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
out.x = [];
for (const [n, id] of [['leads', L], ['deals', D], ['tasks', T]]) for (const p of ['layouts', 'fields', 'layouts/accessible']) {
  const r = await api('GET', `/modules/${id}/${p}`); const d = r.j && r.j.data; const arr = Array.isArray(d) ? d : (d && (d.items || d.layouts || d.fields)) || [];
  out.x.push({ n, p, s: r.s, ms: r.ms, count: arr.length, kb: null , names: p === 'layouts' ? arr.map(a => a.name).slice(0, 20) : undefined });
}
