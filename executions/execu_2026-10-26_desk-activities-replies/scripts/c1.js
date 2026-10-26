// Inventory every QA ACT / QA RPL / x-only record the agent can see (tickets, tasks, calls, events) + try deleting one QA ticket
const out = {}; const all = {};
for (const k of ['tickets', 'tasks', 'calls', 'events']) {
  let page_ = 1, rows = [];
  for (; page_ <= 10; page_++) { const L = await api('GET', `/modules/${M[k]}/records?page=${page_}&per_page=100&sort_by=created_at&sort_dir=desc`); const r = ((L.j && L.j.data && (L.j.data.records || L.j.data.items || L.j.data)) || []).map(fl); rows = rows.concat(r); if (r.length < 100) break; }
  const f = k === 'events' ? 'title' : 'subject';
  all[k] = rows.filter(x => /^\s*QA (ACT|RPL)/.test(x[f] || '') || /^x+$/.test(x[f] || '')).map(x => ({ id: x.id, s: String(x[f]).slice(0, 40), st: x.status || x.call_status }));
  out[k] = all[k].length;
}
const t = all.tickets[0]; if (t) { const d = await api('DELETE', `/modules/${M.tickets}/records/${t.id}`); out.tryDelete = t.s + ' -> ' + d.s + ' ' + d.t.slice(0, 200); }
out.all = all;
return JSON.stringify(out);
