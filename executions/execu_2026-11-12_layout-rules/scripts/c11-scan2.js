const L = I.mod_leads; const out = { hit: [], oldest: null };
for (const extra of ['', '&include_deleted=true']) for (let pg = 1; pg <= 15; pg++) { const r = await api('GET', '/modules/' + L + '/records?per_page=100&sort_by=created_at&sort_order=desc&page=' + pg + extra); const a = arr(r.j && r.j.data); if (!a.length) break; out.oldest = a[a.length - 1].created_at; for (const x of a) if (x.created_with_layout_id === I.layout) out.hit.push([extra, x.id, x.is_deleted, x.created_by_name, x.created_at, JSON.stringify(x.data).slice(0, 160)]); if (out.oldest < '2026-11-12') break; }
return out;
