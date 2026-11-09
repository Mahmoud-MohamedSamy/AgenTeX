// ids mode cap: 501 ids
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const ids = Array.from({ length: 501 }, (_, i) => '00000000-0000-4000-8000-' + String(i).padStart(12, '0'));
const r = await api('POST', `/modules/${L}/records/mass-delete`, { record_ids: ids }); out.cap501 = { s: r.s, t: r.t.slice(0, 300) };
const r2 = await api('POST', `/modules/${L}/records/mass-delete`, { record_ids: [] }); out.empty = { s: r2.s, t: r2.t.slice(0, 300) };
const r3 = await api('POST', `/modules/${L}/records/mass-delete`, { record_ids: ['00000000-0000-4000-8000-000000000123'] }); out.unknown = { s: r3.s, t: r3.t.slice(0, 300) };
