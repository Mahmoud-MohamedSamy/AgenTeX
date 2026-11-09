const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
const fv = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
const data = o => Object.entries(o).map(([field, value]) => ({ field, value: fv(value) }));
const mk = async o => { const r = await call('POST', `/modules/${M}/records`, { layout_id: L, data: data(o) }); return r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 260) : r.j.data.id); };
const res = {};
res.redC = await mk({ name: 'QA R2W5 dep RedC', qa_pick: 'Red', qa_sub: 'C' });
res.redA = await mk({ name: 'QA R2W5 dep RedA', qa_pick: 'Red', qa_sub: 'A' });
res.greenC = await mk({ name: 'QA R2W5 dep GreenC', qa_pick: 'Green', qa_sub: 'C' });
// edit path: RedA -> C
const id = res.redA.split(' ')[1];
if (id) { const e = await call('PATCH', `/modules/${M}/records/${id}`, { data: data({ qa_sub: 'C' }) }); res.editRedAtoC = e.s + ' ' + e.t.slice(0, 220); }
res.num50 = await mk({ name: 'QA R2W5 VR 50', qa_num: 50 });
return res;
