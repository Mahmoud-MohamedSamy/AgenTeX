const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', Q = 'f01e6c73-e8c3-4cf9-a109-ff99a2a57b11';
await ensureAuth();
const F = arr((await api('GET', `/modules/${L}/fields`)).j.data); const ro = F.find(f => f.labels?.en === 'QA RT rollup2');
const lay = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.id === Q); const b = JSON.parse(JSON.stringify(lay)); delete b.id;
b.views.CREATE.layout.sections[0].columns[0].fields.push(JSON.parse(JSON.stringify(ro)));
const t0 = Date.now(); let res;
try { const r = await page.context().request.fetch(API + `/modules/${L}/layouts/${Q}`, { method: 'PUT', headers: { ...hdr, 'content-type': 'application/json' }, data: JSON.stringify(b), timeout: 180000, failOnStatusCode: false }); res = r.status() + ' ' + (await r.text()).slice(0, 300); } catch (e) { res = 'ERROR ' + String(e.message).split('Call log')[0].slice(0, 120); }
const after = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.id === Q);
// control: plain PUT of the unchanged layout
const t1 = Date.now(); const c = await api('PUT', `/modules/${L}/layouts/${Q}`, (() => { const x = JSON.parse(JSON.stringify(after)); delete x.id; return x; })());
return done({ rollup: ro && { id: ro.id, cfg: ro.config }, putWithRollup: res, secs: Math.round((t1 - t0) / 1000), placed: JSON.stringify(after.views).includes(ro.id), controlPut: c.s, controlSecs: Math.round((Date.now() - t1) / 1000) });
