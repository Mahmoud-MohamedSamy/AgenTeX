// NDC-2302 TAVI side: QA blueprint on Leads (QA layout), entry "first_name startsWith QA RT 2302", Lead Source chat → web.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', Q = '212d0ec2-9ca9-4f39-b524-30275f5fd713';
const def = { name: 'QA RT 2302 TAVI BP', description: 'QA RT 2302 (deleted after the run)', moduleKey: 'leads', layoutId: Q, targetField: 'lead_source', continuous: false,
  entryCriteria: { op: 'startsWith', field: 'first_name', value: 'QA RT 2302' },
  states: [{ id: 'chat', name: 'chat', position: { x: 80, y: 80 }, isTerminal: false }, { id: 'web', name: 'web', position: { x: 340, y: 80 }, isTerminal: true }],
  transitions: [{ id: 't_qa_0', name: 'QA chat to web', fromStateId: 'chat', toStateId: 'web', color: '#2563eb', before: {}, during: {}, after: { actions: [] } }] };
const c = await api('POST', `/modules/${L}/blueprints`, { isActive: false, definition: def }); const id = c.j?.data?.id;
if (!id) return done({ err: c.s + ' ' + c.t.slice(0, 300) });
const cur = (await api('GET', `/modules/${L}/blueprints/${id}`)).j?.data;
const a = await api('PUT', `/modules/${L}/blueprints/${id}`, { isActive: true, definition: cur.definition });
return done({ id, activate: a.s + ' ' + (a.s >= 300 ? a.t.slice(0, 200) : ''), active: (await api('GET', `/modules/${L}/blueprints/${id}`)).j?.data?.isActive });
