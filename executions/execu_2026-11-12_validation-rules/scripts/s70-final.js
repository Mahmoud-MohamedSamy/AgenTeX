// Final cleanup for the not-run-cases pass. Order: rules -> layout rules -> records off the QA layout -> records on it (+purge exact ids) -> layout -> fields -> Desk contact
const mid = await modId(); const isDesk = APP === 'desk'; const o = {};
o.rules = await delAllQARules(mid);
o.otherRules = await delAllQARules(await modId(isDesk ? 'desk_contacts' : 'contacts'));
for (const k of ['e7lr', 'h5lr', 'h4lr']) if (I[k]) { o[k] = (await api('DELETE', '/modules/' + mid + '/layout-rules/' + I[k])).s; delete I[k]; }
for (const lr of arr((await api('GET', '/modules/' + mid + '/layout-rules')).j.data).filter(x => String(x.name).startsWith(P))) o['lr ' + lr.name] = (await api('DELETE', '/modules/' + mid + '/layout-rules/' + lr.id)).s;
// records outside the QA layout that this pass created (exact ids)
const extra = []; // [moduleId, recordId]
if (!isDesk && I.g7) {
  for (const id of [I.g7.lead, I.g7.ok]) extra.push([mid, id]);
  for (const t of arr(I.g7.cv2 && I.g7.cv2.targets)) if (t.recordId || t.record_id) extra.push([t.moduleId || t.module_id, t.recordId || t.record_id]);
}
o.extra = [];
for (const [m, id] of extra) { const g = await api('GET', '/modules/' + m + '/records/' + id); if (g.s === 404) { o.extra.push(id.slice(0, 8) + ' gone'); continue; } const nm = JSON.stringify(g.j && g.j.data && g.j.data.data || []).match(/QA VR1112[^"]*|BADCONV[^"]*/); if (!nm) { o.extra.push(id.slice(0, 8) + ' NOT OURS skipped'); continue; } const d = await api('DELETE', '/modules/' + m + '/records/' + id); o.extra.push(id.slice(0, 8) + ' ' + nm[0] + ' ' + d.s); if (d.s < 300) (I.purgeExtra = I.purgeExtra || []).push(id); }
SAVE();
fs.writeFileSync(RUN + '/out/purge-extra-' + APP + '.txt', (I.purgeExtra || []).join(','));
return o;
