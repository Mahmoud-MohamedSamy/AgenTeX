const MID = '5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1', BOT = '523926ef-53be-4b86-bbef-e34e2f19aa88';
const leads = ['6890632f-f963-4413-a9d9-d7c24b152f25', '8fdcf5c9-e415-42b0-ad73-89bf50ee930c', '13a598a6-aba9-4836-a0fd-beb34528b8d2'];
const out = {};
out.setBot = (await call('PATCH', `/iam/users/${BOT}/reporting-manager`, { reporting_manager_id: null })).s;
out.setMid = (await call('PATCH', `/iam/users/${MID}/reporting-manager`, { reporting_manager_id: null })).s;
const hv = (await call('GET', '/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org')).j.data;
out.mode = (await call('PUT', '/settings/values', { app_key: 'general', key: 'general.company.hierarchy.preference', scope_type: 'Org', scope_id: null, value_json: '"role"', expected_version: hv.version })).s;
out.del = []; for (const id of leads) out.del.push((await call('DELETE', `/modules/${MODS.leads}/records/${id}`)).s);
await new Promise(r => setTimeout(r, 3000));
const items = []; let cursor = null; for (let p = 0; p < 15; p++) { const r = await call('GET', `/audit/recycle-bin/items?limit=200${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`); const d = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; items.push(...d); if (d.some(i => leads.includes(i.record_id)) && items.filter(i => leads.includes(i.record_id)).length === 3) break; cursor = r.j.meta && r.j.meta.next_cursor; if (!cursor) break; }
const hit = items.filter(i => leads.includes(i.record_id)).map(i => i.id);
out.purge = hit.length ? (await call('POST', '/audit/recycle-bin/delete', { ids: hit })).s + ' n=' + hit.length : 'none found';
const users = (await call('GET', '/iam/users?app_key=crm&limit=200')).j.data; const list = Array.isArray(users) ? users : users.items;
out.after = list.filter(u => [MID, BOT].includes(u.userId || u.id)).map(u => (u.email + ' mgr=' + u.reportingManagerId));
out.modeNow = (await call('GET', '/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org')).j.data.value_json;
return out;
