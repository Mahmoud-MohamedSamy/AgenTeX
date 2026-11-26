// TF-01 isolated: update a Contact field through the ticket's contact_id lookup.
const cf = L((await api('GET', `/modules/${CONTACTS}/fields`)).j?.data);
const cand = cf.filter(f => ['single_line', 'multi_line'].includes(f.datatypeKey || f.datatype?.key) && !f.isSystemManaged && !/^(last_name|first_name|email|name|full_name)$/.test(f.fieldName || f.name));
const field = (cand.find(f => /description|title|department|qa_/.test(f.fieldName || f.name)) || cand[0]); const n = field.fieldName || field.name;
const g = 'TF1' + uid(); const val = 'QA BP R contact via bp ' + g;
const m = await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { after: [aSet(n, val, 'contact_id')] }), TR('end', 'Escalated', 'Closed')]));
const stored = m.ok ? (await getBp(m.id)).definition.transitions[0].after.actions[0] : null;
const t = await mkT(g); await waitIn(t);
const tf = await flds(t);
const r = await runT(t, 'go'); await sleep(8000);
const c = Object.fromEntries((((await api('GET', `/modules/${CONTACTS}/records/${CONTACT}`)).j?.data)?.data || []).map(x => [x.field, fv(x.value)]));
const h = await histTxt(t);
const okc = String(c[n] || '').includes(g);
R('TF-01', okc ? 'PASS' : 'FAIL', `ticket field update works (TF run 40-after); contact field "${n}" through contact_id: save ${E(m.r)} stored ${JS(stored)}; ticket contact ${tf.contact_id === CONTACT}; run ${E(r)}; contact value now ${JS(c[n]).slice(0, 80)}; ticket history mentions it ${h.includes(g)}`);
return await cleanup();
