const DD = 'e04e88df-03e2-4a9f-8ccc-ff934cca500e'; const o = {}; const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8'));
o.DB = J.t3027.DB; o.xDeptNow = (await rec(J.t3027.x)).department; o.xDesk = (await api('GET', '/desk/tickets/' + J.t3027.x)).j?.data?.department_id;
const r = await api('POST', `/modules/${TK}/records`, { data: fields({ subject: 'QA RT20 BP-3027 delete restore', description: 'QA RT20 BP 3027', status: 'Open', department: DD }) }); const y = r.j?.data?.id; o.ycreate = E(r); LED('ticket created ' + y + ' "QA RT20 BP-3027 delete restore"');
await sleep(8000);
o.del = E(await api('DELETE', '/modules/' + TK + '/records/' + y)); LED('ticket deleted ' + y + ' (NDC-3027, to restore)'); await sleep(4000);
const b = await api('GET', '/audit/recycle-bin/items?limit=50&app=desk'); const it = L(b.j?.data).find(x => (x.record_id || x.entity_id) === y); o.binItem = !!it;
if (it) { const rr = await api('POST', '/audit/recycle-bin/restore', { item_ids: [it.id], ids: [it.id] }); o.restore = E(rr); LED('ticket restored ' + y + ' ' + rr.s); }
await sleep(3000); o.after = (await api('GET', '/modules/' + TK + '/records/' + y)).s;
J.t3027.y = y; fs.writeFileSync(RUN + '/scripts/bp/3065.json', JSON.stringify(J, null, 1));
return o;
