const r = await api('GET', `/modules/${TK}/blueprints?page_size=200`); const items = L(r.j?.data); const out = { s: r.s, n: items.length, keys: {} };
for (const b of items) { const full = b.definition ? b : await getBp(b.id); const d = full?.definition || full?.data?.definition; for (const s of (d?.states || [])) for (const [k, v] of Object.entries(s)) { if (!['id','name','position','slaClock','isTerminal','color'].includes(k)) { out.keys[k] = out.keys[k] || JSON.stringify(v).slice(0, 200); } } }
return out;
