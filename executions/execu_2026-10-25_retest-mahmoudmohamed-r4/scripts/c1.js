const C = '6f553963-01d6-4b68-9fb3-143d23044c41'; const s = v => ({ kind: 'string', value: v });
const fields = arr((await api('GET', `/modules/${C}/fields`)).j?.data).filter(f => /^(first_name|last_name|email|title|phone|mobile)$/.test(f.fieldName)).map(f => f.fieldName + ' req=' + f.required);
const mk = async data => { const r = await api('POST', `/modules/${C}/records`, { data }); return r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 200)); };
const a = await mk([{ field: 'first_name', value: s('QA RT') }, { field: 'last_name', value: s('2393 Pair') }, { field: 'email', value: s('qa.rt.2393@example.com') }]);
const b = await mk([{ field: 'first_name', value: s('QA RT 2403') }, { field: 'email', value: s('qa.rt.2403@example.com') }]);
return { fields, a, b, at: new Date().toISOString() };
