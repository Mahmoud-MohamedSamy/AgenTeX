const A = MODS.accounts, L = 'd817ff75-2107-4114-9141-71f5efbc04cf', s = v => ({ kind: 'string', value: v }), out = {};
const mk = async () => call('POST', `/modules/${A}/records`, { layout_id: L, data: [{ field: 'name', value: s('QA W2 UNQ') }, { field: 'account_name', value: s('QA W2 UNQ ' + (globalThis.__u || (globalThis.__u = Date.now() % 100000))) }] });
const a = await mk(); out.first = a.s; const aid = a.j.data.id;
const dup = await mk(); out.dupWhileActive = dup.s + ' ' + dup.t.slice(0, 150); if (dup.s < 300) out.dupId = dup.j.data.id;
const d = await call('DELETE', `/modules/${A}/records/${aid}`); out.del = d.s;
const b = await mk(); out.secondAfterDelete = b.s + ' ' + (b.s < 300 ? b.j.data.id : b.t.slice(0, 150)); const bid = b.s < 300 ? b.j.data.id : null;
let item = null, cursor = null; for (let p = 0; p < 10 && !item; p++) { const r = await call('GET', `/audit/recycle-bin/items?limit=200${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`); const its = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; item = its.find(x => x.record_id === aid); cursor = r.j.meta && r.j.meta.next_cursor; if (!cursor) break; }
const rs = await call('POST', '/audit/recycle-bin/restore', { ids: [item.id] }); out.restore = rs.s + ' ' + rs.t.slice(0, 400);
const ga = await call('GET', `/modules/${A}/records/${aid}`); out.firstNow = ga.s;
return { out, ids: [aid, bid, out.dupId].filter(Boolean) };
