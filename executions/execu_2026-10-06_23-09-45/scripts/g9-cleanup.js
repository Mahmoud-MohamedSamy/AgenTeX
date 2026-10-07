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
// department
const QAD = 'a7265f03-326f-46ab-b009-f17bad4ad555'; const dd = await api('DELETE', '/desk/departments/' + QAD); const dl = arr((await api('GET', '/desk/departments')).j.data).map(d => d.name);
out.push('department QA MF Dept DELETE → ' + dd.s + ' ' + (dd.s >= 300 ? dd.t.slice(0, 120) : '') + '; departments now [' + dl.join(', ') + ']');
// restore mahmoud.mohamed1: add Desk Administrator first, then remove Desk Agent
const U = '18ba78c4-20c2-49e3-b159-55e1af2043ae', ADMIN = '44444444-4444-4444-4444-444444444401', AGENT = '44444444-4444-4444-4444-444444444402', MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const names = async () => arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
const a1 = await api('POST', '/iam/users/' + U + '/profiles', { profile_id: ADMIN, scope_id: MGR }); let rm = { s: 'skipped' };
if (/Desk Administrator/.test(await names())) rm = await api('DELETE', '/iam/users/' + U + '/profiles/' + AGENT + '?scopeId=' + MGR);
const pn = await names(); out.push('mahmoud.mohamed1: add Desk Administrator → ' + a1.s + '; remove Desk Agent → ' + rm.s + '; profiles now "' + pn + '"');
const dts2 = arr((await api('GET', '/custom-datatypes')).j.data).map(x => x.key);
const bad = mods.some(x => /QA MF/.test(x || '')) || tl > 0 || dts2.some(k => /qa_mf/.test(k)) || dl.includes('QA MF Dept') || pn !== 'Desk Administrator';
rec('CLEANUP', bad ? 'FAIL' : 'PASS', out.join(' ; '));
return done();
