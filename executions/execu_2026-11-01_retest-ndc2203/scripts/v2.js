const id = 'df2b2aa7-282b-43dd-8a7d-4ef002dbeb0e'; const out = {};
const r = await api('PATCH', `/modules/${T}/records/${id}`, { data: [{ field: 'department', value: enc(HR) }] }); out.patch = r.s + ' ' + r.t.slice(0, 300);
const r2 = await api('PATCH', `/modules/${T}/records/${id}`, { data: [{ field: 'department', value: enc(HR) }, { field: 'owner', value: { kind: 'null' } }] }); out.patch2 = r2.s + ' ' + r2.t.slice(0, 200);
await sleep(5000);
out.hist = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).filter(a => /department/.test(a.action)).map(a => a.action + ' ' + JSON.stringify(a.summary));
return done(out);
