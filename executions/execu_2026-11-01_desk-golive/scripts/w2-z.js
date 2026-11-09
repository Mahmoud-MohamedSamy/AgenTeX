const o = {}; const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 200) : undefined });
const tickets = ['3008a52d-6f69-48bb-90ba-bac134c7aa56', '07e8ad7e-1ded-43f3-8a2f-54bb0bbfca8d', 'f9877c93-bf97-422c-a62b-91e9df7a3849', '5616592e-adad-4ad1-82b6-8e13f3751195', 'c9e96413-189a-4933-91a5-ef1d94adf798', 'f3bf9581-ca76-46a9-a56e-0d757de60b27', '36c92f6b-c2e2-41dd-b651-1f5da310355b', '60b25ebe-01d8-47df-91fc-6afb73a86912', 'a64b7aab-0652-461f-86af-c6d4a52f1475', '7e312965-7ce0-4e97-bc87-a8367ba1fd23'];
// W2-49 attachment limits
o.bigFile = sh(await api('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-gl-w2-big.bin', declared_content_type: 'application/octet-stream', size_bytes: 200 * 1024 * 1024, owner_user_id: ME }));
o.exeFile = sh(await api('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-gl-w2.exe', declared_content_type: 'application/x-msdownload', size_bytes: 1000, owner_user_id: ME }));
// unlink parent-child first (child 1)
o.unlinkC1 = (await api('DELETE', '/desk/tickets/c9e96413-189a-4933-91a5-ef1d94adf798/children/f3bf9581-ca76-46a9-a56e-0d757de60b27')).s;
o.del = {}; for (const id of tickets) o.del[id.slice(0, 8)] = (await api('DELETE', `/modules/${T}/records/${id}`)).s;
// W2-45 delete forever (one ticket)
const bi = await api('GET', '/audit/recycle-bin/items?q=' + encodeURIComponent('QA GL W2 base') + '&limit=20'); const items = arr(bi.j && bi.j.data); o.binFound = items.map(i => [i.id || i.item_id, i.name || i.display_name, i.app || i.app_key]).slice(0, 5);
const it = items.find(i => /QA GL W2 base/.test(i.name || i.display_name || '')); if (it) { const df = await api('POST', '/audit/recycle-bin/delete', { item_ids: [it.id || it.item_id], ids: [it.id || it.item_id] }); o.deleteForever = df.s + ' ' + JSON.stringify(df.j && (df.j.data || df.j.error)).slice(0, 300); }
// library objects
o.snippet = (await api('DELETE', '/desk/snippets/ca857f69-cb7b-4518-91fe-8003ef87aee6')).s;
o.tag = (await api('DELETE', '/desk/tags/80f2da0d-b632-4eb2-b85d-7313344c7b32')).s;
o.template = (await api('DELETE', '/desk/ticket-templates/6c6deea9-08ac-4f44-823e-5c4f2933ac53')).s;
o.macro = (await api('DELETE', '/desk/macros/1dae8cb5-1c0c-4a77-832a-ed4526dc6cc9')).s;
o.contact = (await api('DELETE', `/modules/${CM}/records/4abedf97-3ea0-4abb-a3d4-493e728cd05c`)).s;
// QA dept: remove agents, delete
const D2 = 'ca81f7da-cd75-49e3-953a-43d120bd43c2'; o.deptAgents = (await api('PUT', `/desk/departments/${D2}/agents`, { agent_user_ids: [] })).s; const dd = await api('DELETE', `/desk/departments/${D2}`); o.deptDelete = sh(dd);
// leftover check
const q = await api('GET', `/modules/${T}/records?limit=30&sort=-created_at`); o.leftTickets = arr(q.j && q.j.data).map(r => fl(r)).filter(r => /QA GL W2/.test(r.subject || '')).map(r => r.subject);
const sr = await api('GET', '/desk/scheduled-replies'); o.leftSched = ((sr.j && sr.j.data && sr.j.data.scheduled_replies) || []).filter(x => /QA GL W2/.test(x.subject || '')).length;
return done(o);
