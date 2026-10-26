const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1'; const s = v => ({ kind: 'string', value: v });
const ids = []; for (let i = 1; i <= 60; i++) { const r = await api('POST', `/modules/${L}/records`, { layout_id: LT, data: [{ field: 'first_name', value: s('QA RT 1795 bulk ' + String(i).padStart(2, '0')) }] }); if (r.j?.data?.id) ids.push(r.j.data.id); }
let del = 0; for (const id of ids) { const r = await api('DELETE', `/modules/${L}/records/${id}`); if (r.s === 204) del++; }
return done({ created: ids.length, deleted: del });
