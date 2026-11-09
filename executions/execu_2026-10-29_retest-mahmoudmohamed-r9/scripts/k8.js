const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', F = '28c02bc4-540f-4f97-beba-ec47f32f42df';
const r = await api('PATCH', `/modules/${L}/fields/${F}/constraints`, { required: false, unique: true });
const f = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.id === F);
const t = await api('POST', `/modules/${L}/records`, { data: [{ field: 'first_name', value: { kind: 'string', value: 'QA RT 2423' } }, { field: 'last_name', value: { kind: 'string', value: 'required check' } }, { field: 'phone', value: { kind: 'string', value: '01012345670' } }] });
if (t.j?.data?.id) await api('DELETE', `/modules/${L}/records/${t.j.data.id}`);
return done({ patch: r.s, required: f?.required, unique: f?.unique, leadWithoutQaEmail: t.s });
