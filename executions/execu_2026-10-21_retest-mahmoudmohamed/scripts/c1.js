const M = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', calls: 'e72e608a-a5d3-45cf-888a-dfadc6e8b456', meetings: 'f13e02be-03d3-46c3-a74e-22c7770823ca' };
const R = { leads: ['d8f1167e-7b47-4335-84e4-50a505d3e800', '99d4122c-c130-4844-bf1a-fee3cb62df7e', '2e3666fe-3f70-427a-b2d8-0a4cee463a8c'],
  deals: ['2bbc8b3c-e62d-45b6-ba63-38532e48bbc6', 'df7d6252-8d4c-4b5a-80dc-9fccdf5f09d8', 'e0e2819f-df2e-47dd-be0c-19f53b9b1e1e', '809a7a7d-8751-4710-9d84-796adf362927', 'ff180cca-b227-4a13-86c7-a944c9460455', '5c30e8f0-4974-4096-bb75-5650ffcd77b1', '2d96a011-e915-4416-bb3f-54d95d2ed276', 'ee85b5d6-2965-49d4-bc0b-a5049a44d192', 'e4710c22-9408-4d26-914a-8fa116a9f6e0', '67a30863-4c07-4071-b03d-fca62ef78793', '221c25cd-5c19-4833-a890-46ab6aa5ed79', '12ac3f8d-6a5e-4051-8f37-ceaaec7af2cf', '2f41b135-71ad-42ad-be80-1674a0d50169', '8e8227b2-a494-47e3-a368-4e2880e49c39'],
  tasks: ['21d3c64f-8fa1-4a2c-b8e1-bb643df794e8'], calls: ['39ca766a-8bfd-43b8-a7da-e51724bf9641'], meetings: ['e883e897-d5e0-4fe1-a84a-ff8d888da778'] };
const out = { records: {}, layout: null, fields: {} };
for (const [k, ids] of Object.entries(R)) { const s = []; for (const id of ids) s.push((await api('DELETE', `/modules/${M[k]}/records/${id}`)).s); out.records[k] = s.join(','); }
out.layout = (await api('DELETE', `/modules/${M.leads}/layouts/f01e6c73-e8c3-4cf9-a109-ff99a2a57b11`)).s;
for (const f of ['6a570979-3f17-4a8f-bd34-46679c06097d', 'db1e3c4b-d081-4e60-a4b7-4462d6d9722b', 'f6be00e6-b22a-41a5-a3c4-4b68e49fd60c']) { const r = await api('DELETE', `/modules/${M.leads}/fields/${f}`); out.fields[f.slice(0, 8)] = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 150) : ''); }
return done(out);
