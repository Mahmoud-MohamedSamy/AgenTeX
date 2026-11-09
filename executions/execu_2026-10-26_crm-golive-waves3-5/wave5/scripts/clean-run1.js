const out = {};
for (const id of ['de26078f-ea42-4c13-86ac-ea4309f4a207', '27964476-a1e9-4867-9638-76e9d211e1a8']) { const d = await call('DELETE', `/modules/${id}?cascade=true`); out['module ' + id.slice(0, 8)] = d.s + ' ' + d.t.slice(0, 160); }
const t = await call('DELETE', '/teamspaces/40d78b80-9bc8-4175-9fa6-1e82e059ff5e?cascade=true'); out.ts = t.s + ' ' + t.t.slice(0, 160);
const r = await call('GET', '/audit/recycle-bin/items?limit=200'); const items = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; const it = items.find(x => x.record_id === '342cbb87-9771-4ea9-b44c-34d64de2ddf4');
if (it) { const p = await call('POST', '/audit/recycle-bin/delete', { ids: [it.id] }); out.purgeBlankCustomer = p.s + ' ' + p.t.slice(0, 160); } else out.purgeBlankCustomer = 'not found';
return out;
