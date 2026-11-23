// H9: blueprint transition that asks for qa_num -> does the formula follow?
const M = made.mod, LID = made.layouts[0]; const res = {};
const ST = (id) => ({ id, name: id, position: { x: 0, y: 0 } });
const def = { name: 'QA FX H9 BP', description: 'QA FX run - delete', moduleKey: made.appKey === 'desk' ? 'qa_fx_desk' : 'qa_fx', targetField: 'qa_status', ...(made.appKey === 'desk' ? { departmentId: '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158' } : {}), entryCriteria: { op: 'contains', field: 'name', value: 'QA FX H9' },
  states: [ST('Open'), ST('Closed')], transitions: [{ id: 't1', name: 'QA close', fromStateId: 'Open', toStateId: 'Closed', before: {}, during: { requiredFields: [{ name: 'qa_num', required: true, datatype: { key: 'number' } }], checklist: [] }, after: { actions: [] } }] };
const b = await api('POST', `/modules/${M}/blueprints`, { definition: def, isActive: true }); res.create = E(b).slice(0, 400);
if (b.j?.data?.id) { (made.bps ||= []).push(b.j.data.id); keep(); led((made.appKey || 'crm') + ' blueprint ' + b.j.data.id); }
const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX H9 rec2', qa_status: 'Open', qa_num: 1 }) }); const id = r.j?.data?.id; if (id) { made.recs.push(id); keep(); }
let st = null; for (let i = 0; i < 8; i++) { await sleep(2500); st = await api('GET', `/modules/${M}/records/${id}/blueprint-state`); if (JSON.stringify(st.j?.data || '').includes('Open')) break; }
const tr = await api('GET', `/modules/${M}/records/${id}/blueprint-transitions`); res.state = JSON.stringify(st.j?.data).slice(0, 200); res.transitions = JSON.stringify(tr.j?.data).slice(0, 300);
for (const fields of [1]) {
  const x = await api('POST', `/modules/${M}/records/${id}/blueprint-transitions/t1`, { qa_num: 7 }); res['exec ' + JSON.stringify(fields).slice(0, 40)] = E(x).slice(0, 250); if (x.s < 300) break; }
await sleep(3000); const v = await getRec(M, id); res.after = { qa_status: v.qa_status, qa_num: v.qa_num, fx_e7: v.fx_e7 };
res.verdict = v.qa_num === 7 ? (v.fx_e7 === 14 ? 'PASS' : 'FAIL (formula not recalculated after transition)') : 'BLOCKED (transition did not set qa_num)';
log(JSON.stringify(res, null, 1)); fs.writeFileSync(RUN + '/out/' + (made.appKey || 'crm') + '-b14.json', JSON.stringify(res, null, 1));
