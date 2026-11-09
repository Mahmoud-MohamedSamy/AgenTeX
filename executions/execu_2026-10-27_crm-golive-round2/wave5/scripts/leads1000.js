const LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const r = await call('GET', `/modules/${LEADS}/records?page=1&per_page=3&sort_by=created_at&sort_dir=desc`);
const rows = (r.j && r.j.data) || [];
const o2 = { s: r.s, total: r.j && r.j.meta && (r.j.meta.total || r.j.meta.total_count), rows: rows.map(x => JSON.stringify({ id: x.id, created_at: x.created_at, created_by: x.created_by, owner: x.owner_id || x.owner, name: x.name || (x.data && x.data.find && x.data.find(d => d.field === 'name')) })).map(s => s.slice(0, 300)) };
const r2 = await call('GET', `/modules/${LEADS}/records?page=6&per_page=200&sort_by=created_at&sort_dir=desc`);
o2.page6 = ((r2.j && r2.j.data) || []).slice(-1).map(x => x.created_at);
return o2;
