const H = 'https://staging-crm.taviportal.com', B = H + '/api/v1', LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const ck = (await page.context().cookies()).find(c => c.name === 'aw_staging_access_token');
const HD = { authorization: 'Bearer ' + ck.value, 'x-app-key': 'crm', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'content-type': 'application/json' };
const api = async (m, p, body) => { const r = await page.context().request.fetch(B + p, { method: m, headers: HD, data: body ? JSON.stringify(body) : undefined, failOnStatusCode: false }); let j = null; try { j = await r.json(); } catch (e) {} return { s: r.status(), j }; };
out.views = [];
for (const [mid, lay] of [[LEADS, 'bf971461-2edc-45f2-b6e4-6e180aa64288'], [DEALS, 'fcba0068-d67f-44f5-8412-cdef9c09e16e']]) {
  for (const kind of ['list', 'kanban', 'split']) { const r = await api('GET', `/modules/${mid}/views?kind=${kind}&layout_id=${lay}`); const vs = (r.j && r.j.data && (r.j.data.views || r.j.data)) || []; for (const v of (Array.isArray(vs) ? vs : [])) if (/^QA R2W2/.test(v.name || '')) out.views.push(v.name + ' ' + (await api('DELETE', `/modules/${mid}/views/${v.id}`)).s); }
}
out.leadDel = (await api('DELETE', `/modules/${LEADS}/records/7d5c8192-3680-48f1-ac20-ba98383fc42e`)).s;
await page.waitForTimeout(3000);
const items = []; let cursor = null;
for (let p = 0; p < 30; p++) { const r = await api('GET', '/audit/recycle-bin/items?limit=200' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); const d = (r.j && (Array.isArray(r.j.data) ? r.j.data : r.j.data && r.j.data.items)) || []; items.push(...d); cursor = r.j && r.j.meta && r.j.meta.next_cursor; if (!cursor) break; }
const mine = items.filter(i => /^QA (R2W2|W2) /.test(i.record_label || ''));
out.binMine = mine.length;
if (mine.length) out.purge = (await api('POST', '/audit/recycle-bin/delete', { ids: mine.slice(0, 50).map(i => i.id) })).s;
const r2 = await api('GET', '/audit/recycle-bin/items?limit=200&q=QA%20R2W2'); out.binLeftSample = ((r2.j && (Array.isArray(r2.j.data) ? r2.j.data : r2.j.data && r2.j.data.items)) || []).filter(i => /^QA R2W2/.test(i.record_label || '')).length;
