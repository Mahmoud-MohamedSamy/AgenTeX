const C = '6f553963-01d6-4b68-9fb3-143d23044c41';
const p0 = await api('GET', `/modules/${C}/list-preferences`);
const ids = [];
for (let i = 1; i <= 52; i++) { const n = 'QA RT ov-' + String(i).padStart(2, '0'); const r = await api('POST', `/modules/${C}/views`, { name: n, kind: 'list', visibility: 'private', settings: { criteria: { conditions: [] } } }); ids.push(r.j?.data?.id || ('ERR ' + r.s)); }
return done({ prefsBefore: p0.t.slice(0, 300), ids });
