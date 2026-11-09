const get = async p => { const r = await api('GET', p); return r.s === 200 ? r.j : { status: r.s, err: r.t.slice(0, 300) }; };
out.at = new Date().toISOString();
out.me = await get('/iam/me/profile');
const mods = await get('/modules'); out.modules = (mods.data || []).map(m => ({ id: m.id, key: m.moduleKey, label: m.labels && m.labels.en }));
out.company = await get('/iam/tenant/company-profile');
out.businessHours = await get('/iam/tenant/business-hours');
out.storage = await get('/files/storage/usage');
out.workqueue = await get('/workqueue');
// QA R2SC records in the main modules (Standard leads list, newest 3 pages)
out.qaRecords = {};
for (const m of out.modules) {
  if (!['leads','contacts','deals','accounts','tasks','cases'].includes(m.key)) continue;
  const r = await api('GET', `/modules/${m.id}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`);
  const rows = (r.j && r.j.data) || [];
  out.qaRecords[m.key] = { status: r.s, newest100: rows.length, qa: rows.filter(x => JSON.stringify(x.data || '').includes('QA R2SC')).map(x => x.id) };
}
// recycle bin: count + QA R2SC items (first 5 pages)
let cur = null, n = 0, qa = [];
for (let p = 0; p < 5; p++) {
  const r = await api('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : ''));
  const d = Array.isArray(r.j && r.j.data) ? r.j.data : ((r.j && r.j.data && r.j.data.items) || []);
  n += d.length; qa.push(...d.filter(i => JSON.stringify(i).includes('QA R2SC')).map(i => i.id));
  cur = r.j && r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break;
}
out.bin = { scanned: n, qaR2SC: qa };
