const o = { sk: [] }, A = 'f4bb810f-5da4-4750-bb1d-4b47d60322fb', B = 'a58daec6-a18b-4b1a-82c4-478a53934495', TA = 'f91f26db-baa4-453d-bd81-4404d3686cbd', TB = '642711d6-e101-4af8-ba72-6eeb0b3af0e6';
const mk = async (dept, type, name, active = true) => { const r = await api('POST', `/desk/skills?department_id=${dept}`, { name, type_id: type, is_active: active, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: name.replace(/ /g, '') + 'NONE' }], pattern: null } }); const id = r.j?.data?.id; if (id) track('skill', id, name); o.sk.push([name, r.s, r.s >= 300 ? r.t.slice(0, 160) : r.j.data.is_active]); return id; };
for (let i = 1; i <= 12; i++) await mk(A, TA, 'QA SK13 S' + i);
await mk(A, TA, 'QA SK13 Inact', false);
await mk(B, TB, 'QA SK13 HS');
return o;
