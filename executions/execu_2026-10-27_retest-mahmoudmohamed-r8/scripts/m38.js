// NDC-1797: an item of a deleted module can be deleted forever. Own QA orphan: module qa_rt_r8o → record → delete record → delete module → delete the bin item forever (exact id).
const TS = '5ea90671-4df5-4642-939d-49494f8e4d6e'; const out = {}; const enc = v => ({ kind: 'string', value: String(v) });
const m = await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qa_rt_r8o', labels: { en: 'QA RT r8 orphan' }, pluralForm: 'QA RT r8 orphan', singularForm: 'QA RT r8 orphan record', description: 'QA retest round 8, deleted afterwards' }); const M = m.j?.data?.id; out.module = m.s + ' ' + M;
const lay = arr((await api('GET', `/modules/${M}/layouts`)).j?.data)[0]?.id;
const r = await api('POST', `/modules/${M}/records`, { layout_id: lay, data: [{ field: 'name', value: enc('QA RT r8 orphan item') }] }); const R = r.j?.data?.id; out.record = r.s + ' ' + R;
out.delRecord = (await api('DELETE', `/modules/${M}/records/${R}`)).s; out.delModule = (await api('DELETE', `/modules/${M}`)).s;
await sleep(5000);
let item = null, c = ''; for (let i = 0; i < 10 && !item; i++) { const b = await api('GET', `/audit/recycle-bin/items?app_key=crm&limit=200${c ? '&cursor=' + encodeURIComponent(c) : ''}`); const a = arr(b.j?.data); item = a.find(x => x.record_id === R || x.record_label === 'QA RT r8 orphan item'); c = b.j?.meta?.next_cursor; if (!c) break; }
out.item = item && { id: item.id, label: item.record_label, module: item.module_key || item.module_label };
if (item) { const d = await api('POST', '/audit/recycle-bin/delete', { ids: [item.id] }); out.deleteForever = d.s + ' ' + d.t.slice(0, 300);
  let still = false; const b2 = await api('GET', `/audit/recycle-bin/items?app_key=crm&limit=200`); still = arr(b2.j?.data).some(x => x.id === item.id); out.stillInBin = still; }
return done(out);
