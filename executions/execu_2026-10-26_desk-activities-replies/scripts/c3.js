// Close every open QA ACT / QA RPL ticket (agent cannot delete tickets)
const out = { closed: [], failed: [] };
let rows = []; for (let p = 1; p <= 5; p++) { const L = await api('GET', `/modules/${M.tickets}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`); const r = ((L.j && L.j.data && (L.j.data.records || L.j.data.items || L.j.data)) || []).map(fl); rows = rows.concat(r); if (r.length < 100) break; }
for (const t of rows.filter(x => /^\s*QA (ACT|RPL)/.test(x.subject || ''))) { const num = (await api('GET', `/desk/tickets/${t.id}`)).j.data; if (num.status === 'Closed') { out.closed.push('#' + num.display_number + ' (already)'); continue; } const c = await api('POST', `/desk/tickets/${t.id}/close`, {}); (c.s < 300 ? out.closed : out.failed).push('#' + num.display_number + ' ' + String(t.subject).slice(0, 30) + (c.s < 300 ? '' : ' ' + c.s)); }
return JSON.stringify(out);
