// Cleanup: delete QA records + QA modules (cascade), purge only QA items from the Recycle Bin, verify leftovers.
const out = [];
const qaMods = arr((await api('GET', '/modules')).j.data).filter(m => /^QA MF/.test(m.pluralForm || '') || /qa_mf/.test(m.moduleKey || ''));
for (const m of qaMods) {
  let n = 0; for (let k = 0; k < 10; k++) { const recs = arr((await api('GET', `/modules/${m.id}/records?page_size=100`)).j.data); if (!recs.length) break; for (const r of recs) { await api('DELETE', `/modules/${m.id}/records/${r.id}`); n++; } }
  const d = await api('DELETE', `/modules/${m.id}?cascade=true`);
  out.push(`module ${m.pluralForm}: ${n} records deleted, DELETE module → ${d.s} ${d.s >= 300 ? d.t.slice(0, 120) : ''}`);
}
// recycle bin: only items that mention QA MF / a QA module
let purged = 0, seen = 0, cursor = null;
for (let p = 0; p < 20; p++) {
  const r = await api('GET', `/audit/recycle-bin/items?app_key=desk&limit=100${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`);
  const items = arr(r.j && r.j.data && (r.j.data.items || r.j.data)); seen += items.length;
  const qa = items.filter(i => /QA MF|qa_mf/.test(JSON.stringify(i)));
  if (qa.length) { const ids = qa.map(i => i.id); const d = await api('POST', '/audit/recycle-bin/delete', { ids }); if (d.s < 300) purged += ids.length; else out.push(`purge → ${d.s} ${d.t.slice(0, 120)}`); }
  cursor = r.j && r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break;
}
out.push(`recycle bin: scanned ${seen} items, purged ${purged} QA items`);
const tl = arr((await api('GET', `/modules/${M.tickets}/layouts`)).j.data).filter(x => /^QA MF/.test(x.name)).length;
const dts = arr((await api('GET', '/custom-datatypes')).j.data).map(x => x.key); const caps = arr((await api('GET', '/capabilities')).j.data).map(x => x.key);
const mods = arr((await api('GET', '/modules')).j.data).map(m => m.pluralForm);
out.push(`left: modules [${mods.join(', ')}]; Ticket QA layouts ${tl}; custom data types [${dts.join(', ')}]; QA capability present ${caps.includes('qa_mf_cap')}`);
rec('CLEANUP', mods.some(x => /QA MF/.test(x || '')) || tl || dts.some(k => /qa_mf/.test(k)) || caps.includes('qa_mf_cap') ? 'FAIL' : 'PASS', out.join(' ; '));
return done();
