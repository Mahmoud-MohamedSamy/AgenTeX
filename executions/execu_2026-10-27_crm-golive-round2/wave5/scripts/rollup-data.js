const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842', C = '2a8802cb-7c22-4c51-91ab-277457a0b498', CL = '51b3ad8b-fb7d-4a7e-8c1c-02ba3165b606';
const fv = v => typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
const data = o => Object.entries(o).map(([field, value]) => ({ field, value: fv(value) }));
const res = {};
const p = await call('POST', `/modules/${M}/records`, { layout_id: L, data: data({ name: 'QA R2W5 Parent', qa_pick: 'Green', qa_num: 3, qa_email: 'qa.r2w5.parent@example.com' }) });
res.parent = p.s + ' ' + (p.j && p.j.data ? p.j.data.id : p.t.slice(0, 200));
const pid = p.j.data.id;
for (const a of [5, 7]) { const c = await call('POST', `/modules/${C}/records`, { layout_id: CL, data: data({ name: 'QA R2W5 child ' + a, qa_parent: pid, qa_amount: a }) }); res['child' + a] = c.s + ' ' + c.t.slice(0, 120); }
await sleep(8000);
const g = await call('GET', `/modules/${M}/records/${pid}`);
res.values = (g.j.data.data || []).filter(x => /qa_/.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value && x.value.value !== undefined ? x.value.value : x.value));
res.pid = pid;
return res;
