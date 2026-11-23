const M = made.mod; const q = fl => api('GET', `/modules/${M}/records?limit=200&filters=` + encodeURIComponent(JSON.stringify(fl)));
for (const [fl, label] of [[[{ field: 'qa_fx_ui_double', operator: 'greater_than', value: 10 }], 'num > 10 (expect I2 sort 50 =100, H1 =14)'], [[{ field: 'fx_d1', operator: 'contains', value: 'High' }], 'string contains High (expect D1 r0)'], [[{ field: 'fx_b4', operator: 'equals', value: true }], 'boolean = true (expect B4 r0)']]) {
  const r = await q(fl); log(label, '->', E(r), L(r.j?.data).map(x => flat(x.data)).map(v => v.name).join(', '));
}
