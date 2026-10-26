// Delete the round-4 Desk test data, ids verified by dc0/dc1 (ledger.md rows 17, 18, 20).
const C = '43004ce2-577f-4eda-b00a-0750fe40c3d4', T = '88e8ea44-1658-4df3-9930-d0902b91073d', I = '/desk/integrations/crm';
const out = {};
out.link = (await api('DELETE', `${I}/links/f2e7a3dd-6803-4a18-bc25-4d31bf28e227`)).s;
for (const id of ['6fbde867-9d28-456c-b5be-84bf2f4e5fca', 'fd913c6d-eaa9-4f11-8b7f-4c886dac0a58']) out['ticket ' + id.slice(0, 8)] = (await api('DELETE', `/modules/${T}/records/${id}`)).s;
for (const id of ['0c7e7a90-3b44-472d-8df1-daa1fd02232c', 'c5f64eca-14a1-4d94-80ee-12f56061f008', 'f0de6428-14f4-414a-b333-5f27fa6b0f7a']) out['contact ' + id.slice(0, 8)] = (await api('DELETE', `/modules/${C}/records/${id}`)).s;
const m = await api('DELETE', '/modules/01727195-e2d5-41c5-821b-a30d5a965976?cascade=true'); out.module = m.s + (m.s >= 300 ? ' ' + m.t.slice(0, 150) : '');
const d = await api('DELETE', '/custom-datatypes/qa_rt_dt4'); out.datatype = d.s + (d.s >= 300 ? ' ' + d.t.slice(0, 150) : '');
return out;
