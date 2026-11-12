// Remove everything QA VR1112 on this app: records, import, rules, layout rule, layouts, fields, Desk contact
const mid = await modId(); const isDesk = APP === 'desk'; const out = { recs: 0, recFail: 0 };
if (!isDesk && I.imp) out.undo = SR(await api('POST', '/modules/' + mid + '/import/' + I.imp + '/undo')).slice(0, 80);
// records: page through module looking for QA VR1112 names
const ids = new Set((I.recs || []).filter(x => x[0] === mid).map(x => x[1]));
for (let page = 1; page <= 30; page++) {
  const r = await api('GET', '/modules/' + mid + '/records?limit=100&page=' + page + '&sort_by=created_at&sort_order=desc'); const L = arr(r.j && r.j.data); if (!L.length) break;
  let anyToday = false;
  for (const rec of L) { const d = Object.fromEntries((rec.data || []).map(x => [x.field, x.value && x.value.value])); if ((rec.created_at || '') >= '2026-11-12T15') anyToday = true; if ([d.first_name, d.last_name, d.subject].some(v => String(v || '').startsWith('QA VR1112'))) ids.add(rec.id); }
  if (!anyToday) break;
}
for (const id of ids) { const d = await api('DELETE', '/modules/' + mid + '/records/' + id); if (d.s < 300 || d.s === 404) out.recs++; else { out.recFail++; out.lastFail = SR(d).slice(0, 150); } }
// rules on this module and other-module leftovers
out.rules = await delAllQARules(mid);
const other = await modId(isDesk ? 'desk_contacts' : 'contacts'); out.otherRules = await delAllQARules(other);
if (I.h4lr) out.lr = (await api('DELETE', '/modules/' + mid + '/layout-rules/' + I.h4lr)).s;
// layouts
for (const l of arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).filter(l => String(l.name).startsWith(P))) out['layout ' + l.name] = (await api('DELETE', '/modules/' + mid + '/layouts/' + l.id)).s;
// fields
const F = (await fieldsOf(mid)).filter(f => f.fieldName.startsWith('qa_vr_'));
for (const f of F) { const d = await api('DELETE', '/modules/' + mid + '/fields/' + f.id); if (d.s >= 300) out['field ' + f.fieldName] = SR(d).slice(0, 120); }
out.fieldsLeft = (await fieldsOf(mid)).filter(f => f.fieldName.startsWith('qa_vr_')).map(f => f.fieldName);
if (isDesk && I.contact) out.contact = (await api('DELETE', '/modules/' + other + '/records/' + I.contact)).s;
out.rulesLeft = (await rules(mid)).map(r => r.name);
LED('cleanup ' + JSON.stringify(out).slice(0, 400));
return out;
