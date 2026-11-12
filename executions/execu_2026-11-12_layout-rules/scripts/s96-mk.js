const mid = await modId(); const out = {}; const F = I.fields;
const b = await api('POST', '/modules/' + mid + '/buttons', { name: P + ' btn', label: { en: P + ' btn' }, actionType: 'url', actionTarget: 'https://example.com/qa-lr1112', placement: 'detail' }); out.btn = SR(b).slice(0, 600) + ' ' + JSON.stringify(b.j && b.j.data).slice(0, 300);
const l = await api('POST', '/modules/' + mid + '/links', { name: P + ' link', label: { en: P + ' link' }, url: 'https://example.com/qa-lr1112-link' }); out.link = SR(l).slice(0, 600) + ' ' + JSON.stringify(l.j && l.j.data).slice(0, 300);
const d = { j: null };
const v = await api('POST', '/modules/' + mid + '/validation-rules', { name: P + ' VR', condition: { op: 'startsWith', field: 'qa_lr_order', value: 'BAD' }, errorMessage: { en: 'QA LR1112 order cannot start with BAD' }, layoutId: I.layout }); out.vr = SR(v).slice(0, 600) + ' ' + JSON.stringify(v.j && v.j.data).slice(0, 300);
for (const [k, r] of [['btn', b], ['link', l], ['dm', d], ['vr', v]]) if (r.j && r.j.data && r.j.data.id) { I['fx_' + k] = r.j.data.id; LED('fixture ' + k + ' ' + r.j.data.id); } SAVE();
return out;
