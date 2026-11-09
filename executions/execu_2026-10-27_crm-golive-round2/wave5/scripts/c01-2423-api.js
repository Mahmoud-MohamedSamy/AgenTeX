const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
const fv = v => typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
const data = o => Object.entries(o).map(([field, value]) => ({ field, value: fv(value) }));
const mk = async o => { const r = await call('POST', `/modules/${M}/records`, { layout_id: L, data: data(o) }); return r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 300) : r.j.data.id); };
return {
  badRegex: await mk({ name: 'QA R2W5 rx bad', qa_email: 'qa.r2w5.rx1@example.com', qa_text: 'hello' }),
  goodRegex: await mk({ name: 'QA R2W5 rx good', qa_email: 'qa.r2w5.rx2@example.com', qa_text: 'QA123' }),
  dupEmail: await mk({ name: 'QA R2W5 dup', qa_email: 'QA.R2W5.PARENT@example.com', qa_text: 'QA1' }),
  noEmail: await mk({ name: 'QA R2W5 noemail', qa_text: 'QA2' }),
};
