const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', LM = '98c36ff8-3621-411b-b373-14455f4df087', out = {}, ids = [], rules = [], fields = [];
const s = v => ({ kind: 'string', value: v });
// 2536 item 1: currencies
for (const p of ['/currencies', '/iam/tenant/currencies', '/settings/currencies']) { const r = await call('GET', p); out['GET ' + p] = r.s; }
const co = (await call('GET', '/iam/tenant/company-profile')).j.data; out.companyCurrency = Object.fromEntries(Object.entries(co).filter(([k]) => /curr/i.test(k)));
// 2536 item 2: validation rule on a picklist field
const vr = await call('POST', `/modules/${M}/validation-rules`, { name: 'QA W5 VR picklist', condition: "qa_w5_pick_list == 'Blue'", errorMessage: { en: 'QA W5 Blue is not allowed' } }); out.vrOnPicklist = vr.s + ' ' + (vr.s < 300 ? '' : vr.t.slice(0, 200)); if (vr.s < 300) rules.push(vr.j.data.id);
const rb = await call('POST', `/modules/${M}/records`, { layout_id: LM, data: [{ field: 'name', value: s('QA W5 VR Blue') }, { field: 'qa_w5_pick_list', value: s('Blue') }] }); out.saveBlue = rb.s + ' ' + (rb.s < 300 ? '' : rb.t.slice(0, 200)); if (rb.s < 300) ids.push(rb.j.data.id);
// 2536 item 3: formula summing subform rows
for (const ex of ['SUM(qa_w5_subform_a.qa_sub_text)', 'sum(qa_w5_subform_a, qa_sub_text)']) { const r = await call('POST', `/modules/${M}/fields`, { fields: [{ fieldName: 'qa_w5_f_' + fields.length, labels: { en: 'QA W5 F' + fields.length }, datatypeKey: 'formula', required: false, unique: false, datatypeOptions: { expression: ex, return_kind: 'number' } }] }); out['formula ' + ex] = r.s + ' ' + (r.s < 300 ? '' : ((r.j && r.j.error && r.j.error.message) || r.t).slice(0, 220)); fields.push(ex); }
// 1603: restore a record whose unique email is now taken
const a = await call('POST', `/modules/${M}/records`, { layout_id: LM, data: [{ field: 'name', value: s('QA W5 UNQ first') }, { field: 'qa_w5_pick_list', value: s('Red') }, { field: 'qa_w5_email', value: s('qa.w5.unq@example.com') }] }); const aid = a.j.data.id; ids.push(aid);
await call('DELETE', `/modules/${M}/records/${aid}`);
const b = await call('POST', `/modules/${M}/records`, { layout_id: LM, data: [{ field: 'name', value: s('QA W5 UNQ second') }, { field: 'qa_w5_pick_list', value: s('Red') }, { field: 'qa_w5_email', value: s('qa.w5.unq@example.com') }] }); out.secondWithFreedEmail = b.s; if (b.s < 300) ids.push(b.j.data.id);
let item = null; for (let i = 0; i < 5 && !item; i++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200'); item = ((r.j.data && (r.j.data.items || r.j.data)) || []).find(x => x.record_id === aid); if (!item) await new Promise(z => setTimeout(z, 3000)); }
if (item) { const rs = await call('POST', '/audit/recycle-bin/restore', { ids: [item.id] }); out.restoreTaken = rs.s + ' ' + rs.t.slice(0, 300); const g = await call('GET', `/modules/${M}/records/${aid}`); out.firstReadAfter = g.s; } else out.restoreTaken = 'not in bin';
out.ids = ids; out.rules = rules; return out;
