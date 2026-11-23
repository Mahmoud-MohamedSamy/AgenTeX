const M = made.mod, LID = made.layouts[0]; const res = {};
const tries = [
 { key: 'line', label: 'Line', datatype: 'formula', config: { expression: 'qty * price' } },
 { key: 'line', label: 'Line', datatype: 'formula', expression: 'qty * price' },
 { key: 'line', label: 'Line', datatype: 'formula', datatypeOptions: { expression: 'qty * price' } } ];
for (const [i, t] of tries.entries()) {
  const n = 'qa_items' + (i + 2);
  const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef(n, 'QA Items ' + (i + 2), 'subform', { subfields: [{ key: 'qty', label: 'Qty', datatype: 'number' }, { key: 'price', label: 'Price', datatype: 'currency' }, t] })] });
  const f = r.j?.data?.[0]; log('variant', i, E(r), JSON.stringify(f?.datatypeOptions || f?.subFields || '').slice(0, 500));
  if (r.s < 300) { (made.extraFields ||= []).push(n); keep();
    const rec = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX F8 v' + i, [n]: [{ qty: 2, price: 10 }, { qty: 3, price: 1.5 }] }) }); if (rec.j?.data?.id) { made.recs.push(rec.j.data.id); keep(); }
    log('  record', E(rec), JSON.stringify(flat(rec.j?.data?.data)[n]));
    break; }
}
// L1: HTML in result
const h = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_l1', 'QA FX L1 html', 'formula', { expression: 'concat("<img src=x onerror=alert(1)><b>bold</b>", qa_text)', return_kind: 'string' })] }); log('L1 field', E(h)); if (h.s < 300) { made.fx.push('fx_l1'); keep(); }
const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX L1', qa_text: '<script>alert(2)</script>' }) }); if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); fs.writeFileSync(RUN + '/out/l1-id.txt', r.j.data.id); }
log('L1 value', JSON.stringify(flat(r.j?.data?.data).fx_l1));
