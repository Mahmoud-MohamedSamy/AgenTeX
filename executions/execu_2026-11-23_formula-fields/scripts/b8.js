const M = made.mod, LID = made.layouts[0]; const out = {};
const sf = L((await api('GET', `/modules/${M}/fields`)).j?.data).find(f => /^qa_items\d$/.test(f.fieldName)); const S = sf.fieldName; log('subform with formula column', S);
const add = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_x1_total', 'QA FX X1 Total', 'formula', { expression: `round(sum(${S}.line) * (1 - qa_pct / 100) + qa_cur, 2)`, return_kind: 'number' }), fdef('fx_x1_sub', 'QA FX X1 Subtotal', 'formula', { expression: `sum(${S}.line)`, return_kind: 'number' })] });
log('fields', E(add)); if (add.s < 300) { made.fx.push('fx_x1_total', 'fx_x1_sub'); keep(); }
const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX X1 quote', qa_pct: 10, qa_cur: 2, [S]: [{ qty: 2, price: 10 }, { qty: 3, price: 1.5 }] }) }); const id = r.j?.data?.id; if (id) { made.recs.push(id); keep(); }
let v = flat(r.j?.data?.data); out.create = { sub: v.fx_x1_sub, total: v.fx_x1_total, expect: '24.5 / 24.05' };
const p = await api('PATCH', `/modules/${M}/records/${id}`, { data: data({ [S]: [{ qty: 2, price: 10 }, { qty: 3, price: 1.5 }, { qty: 10, price: 100 }] }) }); v = await getRec(M, id); out.addRow = { sub: v.fx_x1_sub, total: v.fx_x1_total, expect: '1024.5 / 924.05' };
const q = await api('GET', `/modules/${M}/records?limit=50&filters=` + encodeURIComponent(JSON.stringify([{ field: 'fx_x1_total', operator: 'greater_than', value: 1000 }, { field: 'fx_x1_total', operator: 'greater_than', value: 900 }]))); out.filterTotalGt900 = E(q) + ' ' + L(q.j?.data).map(x => flat(x.data).name).join(', ');
out.verdict = out.create.sub === 24.5 && out.create.total === 24.05 && out.addRow.sub === 1024.5 && out.addRow.total === 924.05 ? 'PASS' : 'CHECK';
log(JSON.stringify(out)); fs.writeFileSync(RUN + '/out/' + (made.appKey || 'crm') + '-b8.json', JSON.stringify(out, null, 1));
