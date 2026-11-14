const defs = [['qa_gl_w5_pick', 'QA GL W5 field', 'pick_list', { allowed_values: ['Alpha', 'Beta', 'Gamma'] }], ['qa_gl_w5_num', 'QA GL W5 number', 'number'], ['qa_gl_w5_date', 'QA GL W5 date', 'date'], ['qa_gl_w5_url', 'QA GL W5 url', 'url'], ['qa_gl_w5_email', 'QA GL W5 email', 'email'], ['qa_gl_w5_multi', 'QA GL W5 multi', 'multi_select', { allowed_values: ['One', 'Two', 'Three'] }], ['qa_gl_w5_check', 'QA GL W5 checkbox', 'checkbox']];
out.create = {}; const ids = {};
for (const [fn, lab, dt, opt] of defs) { const r = await api('POST', '/modules/' + CM + '/fields', { fields: [{ fieldName: fn, labels: { en: lab }, datatypeKey: dt, required: false, unique: false, uniquePeerModuleIds: [], ...(opt ? { datatypeOptions: opt } : {}) }] });
  const d = D(r.j); const f = Array.isArray(d) ? d[0] : (d && (d.fields ? d.fields[0] : d)); out.create[fn] = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 200) : ''); if (f && f.id) { ids[fn] = f.id; CREATED.push({ kind: 'field', id: f.id, name: lab, mod: CM }); } }
out.ids = ids;
// good + bad values on the contact
const good = { qa_gl_w5_pick: sv('Beta'), qa_gl_w5_num: { kind: 'number', value: 42 }, qa_gl_w5_date: sv('2026-11-13'), qa_gl_w5_url: sv('https://example.com'), qa_gl_w5_email: sv('x@example.com'), qa_gl_w5_multi: { kind: 'array', items: [sv('One'), sv('Three')] }, qa_gl_w5_check: { kind: 'boolean', value: true } };
const bad = { qa_gl_w5_pick: sv('Zeta'), qa_gl_w5_num: sv('abc'), qa_gl_w5_date: sv('2026-13-45'), qa_gl_w5_url: sv('not a url'), qa_gl_w5_email: sv('nope@'), qa_gl_w5_multi: { kind: 'array', items: [sv('Nine')] }, qa_gl_w5_check: sv('maybe') };
const pg = await api('PATCH', '/modules/' + CM + '/records/' + C1, { data: Object.entries(good).map(([field, value]) => ({ field, value })) }); out.good = pg.s + ' ' + (pg.s >= 300 ? pg.t.slice(0, 300) : '');
out.bad = {}; for (const [f, v] of Object.entries(bad)) { const r = await api('PATCH', '/modules/' + CM + '/records/' + C1, { data: [{ field: f, value: v }] }); out.bad[f] = r.s + ' ' + (r.j && r.j.error ? (r.j.error.details && r.j.error.details[0] ? r.j.error.details[0].message : r.j.error.message) : '').slice(0, 120); }
return fin({ out });
