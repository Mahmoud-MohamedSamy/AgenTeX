// QA module only: pick-list validation rule (NDC-2536 item 2). No tenant-wide writes.
const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
const res = {};
const vr = await call('POST', `/modules/${M}/validation-rules`, { name: 'QA R2W5 VR pick', condition: { op: 'eq', field: 'qa_pick', value: 'Blue' }, errorMessage: { en: 'QA R2W5: Blue is not allowed' } }); res.rule = vr.s + ' ' + vr.t.slice(0, 200);
const mk = await call('POST', `/modules/${M}/records`, { layout_id: L, data: [{ field: 'name', value: { kind: 'string', value: 'QA R2W5 blue' } }, { field: 'qa_pick', value: { kind: 'string', value: 'Blue' } }, { field: 'qa_email', value: { kind: 'string', value: 'qa.r2w5.blue@example.com' } }, { field: 'qa_text', value: { kind: 'string', value: 'QA9' } }] });
res.blue = mk.s + ' ' + mk.t.slice(0, 260);
return res;
