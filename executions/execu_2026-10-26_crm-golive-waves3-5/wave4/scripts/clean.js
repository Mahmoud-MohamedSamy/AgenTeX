const C = {"leads":["f68207e6-1bf9-4134-a3ae-7e29db2c45e9","4d03e549-4936-42aa-8e42-b41145cc8e1a"],"templates":["4fe72402-2dd2-464e-b590-e11fdc64943a"],"webforms":["b9137a0a-feb6-4a0b-a117-309317f6de79"],"tasks":["f8ad6687-3c73-4cd9-815a-ba8ac23dec4a","e317b07b-d193-42af-803a-62c16b8f6ccc"],"smsTemplates":["5e96ffc5-bdf3-5ae0-83b1-a657b6f86c16"],"portals":["ab06c3c5-83bf-422a-b3a8-45384ee8e4d9"]};
const out = {};
for (const id of C.webforms) out['webform ' + id.slice(0, 8)] = (await call('DELETE', `/web-forms/${id}`)).s;
for (const id of C.portals) out['portal ' + id.slice(0, 8)] = (await call('DELETE', `/record-portals/${id}`)).s;
for (const id of C.templates) out['template ' + id.slice(0, 8)] = (await call('DELETE', `/mail/templates/${id}`)).s;
for (const id of C.smsTemplates) out['sms ' + id.slice(0, 8)] = (await call('POST', `/messaging/templates/${id}/archive`, {})).s;
for (const id of C.tasks) out['task ' + id.slice(0, 8)] = (await call('DELETE', `/modules/${MODS.tasks}/records/${id}`)).s;
for (const id of C.leads) out['lead ' + id.slice(0, 8)] = (await call('DELETE', `/modules/${MODS.leads}/records/${id}`)).s;
await new Promise(r => setTimeout(r, 4000));
const all = [...C.tasks, ...C.leads]; const items = []; let cursor = null;
for (let p = 0; p < 30; p++) { const r = await call('GET', `/audit/recycle-bin/items?limit=200${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`); const d = (Array.isArray(r.j.data) ? r.j.data : r.j.data.items) || []; items.push(...d); cursor = r.j.meta && r.j.meta.next_cursor; if (!cursor || !d.length) break; }
const mine = items.filter(i => all.includes(i.record_id) || /^QA W4/.test(String(i.record_label)));
out.binFound = mine.map(i => i.module_key + ':' + i.record_label);
if (mine.length) { const d = await call('POST', '/audit/recycle-bin/delete', { ids: mine.map(i => i.id) }); out.purge = d.s + ' ' + d.t.slice(0, 200); }
return out;
