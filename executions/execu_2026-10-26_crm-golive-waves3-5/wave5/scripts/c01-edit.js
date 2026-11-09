const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', M2 = 'bb375218-6a5d-48ec-a832-fb062fd0311b', out = {};
const fields = async m => { const f = await call('GET', `/modules/${m}/fields`); return f.j.data.fields || f.j.data; };
let fl = await fields(M); const by = k => fl.find(x => x.apiName === k || x.fieldName === k);
out.sample = JSON.stringify(by('qa_w5_single_line')).slice(0, 500);
const sl = by('qa_w5_single_line'), em = by('qa_w5_email'), ph = by('qa_w5_phone'), pk = by('qa_w5_pick_list');
// rename label
const lab = await call('PATCH', `/modules/${M}/fields/${sl.id}/labels`, { labels: { en: 'QA W5 Text renamed', ar: 'نص' } }); out.renameLabel = lab.s + ' ' + lab.t.slice(0, 150);
fl = await fields(M); out.labelNow = JSON.stringify(by('qa_w5_single_line').labels);
// unique constraint on email
const uq = await call('PATCH', `/modules/${M}/fields/${em.id}/constraints`, { unique: true }); out.uniqueEmail = uq.s + ' ' + uq.t.slice(0, 200);
const peers = await call('GET', `/modules/${M}/fields/${em.id}/unique-peers`); out.uniquePeers = peers.s + ' ' + peers.t.slice(0, 200);
const uq2 = await call('PATCH', `/modules/${M}/fields/${ph.id}/constraints`, { unique: true }); out.uniquePhone = uq2.s;
const uq3 = await call('PATCH', `/modules/${M}/fields/${sl.id}/constraints`, { unique: true }); out.uniqueThird = uq3.s + ' ' + uq3.t.slice(0, 200);
const req = await call('PATCH', `/modules/${M}/fields/${pk.id}/constraints`, { required: true }); out.requiredPick = req.s + ' ' + req.t.slice(0, 150);
// usage then delete a field
const del = by('qa_w5_url'); const u = await call('GET', `/modules/${M}/fields/${del.id}/usage`); out.usage = u.s + ' ' + u.t.slice(0, 200);
const d = await call('DELETE', `/modules/${M}/fields/${del.id}`); out.deleteField = d.s + ' ' + d.t.slice(0, 150);
fl = await fields(M); out.urlGone = !by('qa_w5_url');
const bin = await call('GET', '/audit/recycle-bin/items?limit=50'); const it = ((bin.j.data && (bin.j.data.items || bin.j.data)) || []).find(x => x.record_id === del.id || /qa_w5_url|QA W5 URL/i.test(x.record_label || ''));
out.fieldInBin = !!it; if (it) { const rs = await call('POST', '/audit/recycle-bin/restore', { ids: [it.id] }); out.restoreField = rs.s + ' ' + rs.t.slice(0, 200); fl = await fields(M); out.urlBack = !!by('qa_w5_url'); }
// can-add-field (limits)
const can = await call('POST', `/modules/${M}/can-add-field`, { datatypeKey: 'single_line' }); out.canAdd = can.s + ' ' + can.t.slice(0, 250);
return out;
