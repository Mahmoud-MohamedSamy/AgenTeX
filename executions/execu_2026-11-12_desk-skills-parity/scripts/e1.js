async (page) => page.evaluate(async () => {
  const tok = decodeURIComponent((document.cookie.match(/(?:^|; )aw_staging_access_token=([^;]+)/) || [])[1] || '');
  const api = async (m, p, b) => { const r = await fetch('/api/v1' + p, { method: m, headers: { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', authorization: 'Bearer ' + tok }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 600) }; };
  const A = 'f4bb810f-5da4-4750-bb1d-4b47d60322fb', U = '876ce871-2b02-4854-89a7-68050391c62b', TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
  const o = { hasTok: tok.length > 0 };
  const f = encodeURIComponent(JSON.stringify([{ field: 'owner', operator: 'equals', value: U }]));
  const all = [];
  for (let pg = 1; pg <= 10; pg++) { const r = await api('GET', `/modules/${TK}/records?page=${pg}&per_page=100&filters=${f}`); if (r.s !== 200) { o.err = r.t; break; } const d = r.j.data || []; all.push(...d); if (d.length < 100) break; }
  const v = (r, k) => { const x = r.data.find(d => d.field === k); return x ? (x.value.value ?? x.value.kind) : null; };
  o.total = all.length; const by = {}; for (const r of all) { const k = (v(r, "department") === A ? "DeptA" : "other") + "/" + v(r, "status"); by[k] = (by[k] || 0) + 1; } o.by = by;
  o.deptA = all.filter(r => v(r, "department") === A).map(r => [r.record_number || r.number, v(r, "subject"), v(r, "status")]);
  return o;
})
