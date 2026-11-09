// Round 2 Wave 4 batch 11 (read-only): list every QA R2W4 object (id, name, created) so cleanup can target exact ids.
const out = { now: new Date().toISOString() };
const arr = v => Array.isArray(v) ? v : (v && (v.items || v.data)) || [];
const qa = x => /QA R2W4/.test(JSON.stringify(x));
const nm = x => x.name || x.title || x.subject || x.record_label || ((x.data || []).find && ((x.data.find(e => /name|subject/.test(e.field)) || {}).value || {}).value) || '';
const row = x => `${x.id} | ${String(nm(x)).slice(0, 50)} | ${x.created_at || x.deleted_at || ''}`;
for (const mod of ['leads', 'tasks']) {
  const ids = new Set(); out[mod] = [];
  for (const layout of ['', mod === 'leads' ? '&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288' : '']) {
    const r = await call('GET', `/modules/${MODS[mod]}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc${layout}`);
    for (const x of arr(r.j.data).filter(qa)) if (!ids.has(x.id)) { ids.add(x.id); out[mod].push(row(x)); } }
}
out.templates = arr((await call('GET', '/mail/templates?limit=200')).j.data).filter(qa).map(row);
const dr = await call('GET', '/mail/drafts?limit=100'); out.drafts = dr.s + ' ' + JSON.stringify(arr(dr.j && dr.j.data).filter(qa).map(row));
out.forms = arr((await call('GET', '/web-forms')).j.data).filter(qa).map(row);
out.portals = arr((await call('GET', '/record-portals')).j.data).filter(qa).map(row);
out.bin = arr((await call('GET', '/audit/recycle-bin/items?limit=100')).j.data).filter(qa).map(row);
return out;
