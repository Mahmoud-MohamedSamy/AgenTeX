async (page) => page.evaluate(async () => {
  const tok = decodeURIComponent((document.cookie.match(/(?:^|; )aw_staging_access_token=([^;]+)/) || [])[1] || '');
  const api = async (m, p, b) => { const r = await fetch('/api/v1' + p, { method: m, headers: { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', authorization: 'Bearer ' + tok }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j, t: t.slice(0, 600) }; };
  const A = 'f4bb810f-5da4-4750-bb1d-4b47d60322fb', U = '876ce871-2b02-4854-89a7-68050391c62b', TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
  const o = {};
  const p = (await api('GET', `/desk/departments/${A}/round-robin-preferences`)).j.data;
  const pp = await api('PUT', `/desk/departments/${A}/round-robin-preferences`, { ...p, department_threshold_enabled: true, department_threshold: 40 }); o.prefs = [pp.s, pp.j?.data?.department_threshold];
  const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
  const r = await api('POST', `/modules/${TK}/records`, { data: [f('subject', 'QA SK13 H7 QASK13RR'), f('department', A), f('status', 'Open'), { field: 'owner', value: { kind: 'null' } }, { field: 'skills', value: { kind: 'array', items: [{ kind: 'string', value: 'QA SK13 S1' }] } }] });
  o.create = [r.s, r.s >= 300 ? r.t : null]; const id = r.j?.data?.id || r.j?.data?.[0]?.id; o.id = id;
  await new Promise(x => setTimeout(x, 10000));
  const g = await api('GET', `/modules/${TK}/records/${id}`); const d = g.j?.data; o.num = d?.record_number ?? d?.number ?? JSON.stringify(d).match(/"(?:ticket_number|record_number|number)":\s*"?(\d+)/)?.[1];
  o.owner = (d?.data || []).find(x => x.field === 'owner')?.value;
  return o;
})
