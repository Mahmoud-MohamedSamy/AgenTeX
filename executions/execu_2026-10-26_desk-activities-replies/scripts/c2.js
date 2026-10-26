// Delete every QA activity found by c1 (tasks, calls, events); report refusals
const out = { deleted: 0, refused: [] };
for (const k of ['tasks', 'calls', 'events']) {
  let rows = []; for (let p = 1; p <= 10; p++) { const L = await api('GET', `/modules/${M[k]}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`); const r = ((L.j && L.j.data && (L.j.data.records || L.j.data.items || L.j.data)) || []).map(fl); rows = rows.concat(r); if (r.length < 100) break; }
  const f = k === 'events' ? 'title' : 'subject';
  for (const x of rows.filter(x => /^\s*QA (ACT|RPL)/.test(x[f] || '') || /^x+$/.test(x[f] || ''))) { const d = await api('DELETE', `/modules/${M[k]}/records/${x.id}`); if (d.s < 300 || d.s === 404) out.deleted++; else out.refused.push(k + ' ' + String(x[f]).slice(0, 30) + ' ' + (x.status || x.call_status) + ' -> ' + d.s + ' ' + ((d.j && d.j.error && d.j.error.message) || '')); }
}
return JSON.stringify(out);
