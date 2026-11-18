const DD = 'e04e88df-03e2-4a9f-8ccc-ff934cca500e'; const o = {}; const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8'));
const d = await api('POST', '/desk/departments', { name: 'QA RT20 BP Dept B', description: 'QA RT20 BP NDC-3027 transfer source', agent_user_ids: [OWNER] }); const DB = d.j?.data?.id; o.deptB = E(d);
if (DB) LED('department created ' + DB + ' "QA RT20 BP Dept B" (NDC-3027, will be disabled with transfer)');
const mk = async (subj, dept, extra = {}) => { const r = await api('POST', `/modules/${TK}/records`, { data: fields({ subject: subj, description: 'QA RT20 BP 3027', status: 'Open', department: dept, ...extra }) }); const id = r.j?.data?.id; LED('ticket created ' + id + ' "' + subj + '"'); return id; };
o.x = await mk('QA RT20 BP-3027 transfer ticket', DB);
o.y = await mk('QA RT20 BP-3027 delete restore', DD, { contact: CON });
await sleep(8000);
o.del = E(await api('DELETE', '/modules/' + TK + '/records/' + o.y)); LED('ticket deleted ' + o.y + ' (NDC-3027, to restore)'); await sleep(4000);
const b = await api('GET', '/audit/recycle-bin/items?limit=50&app=desk'); const it = L(b.j?.data).find(x => (x.record_id || x.entity_id) === o.y); o.binItem = !!it;
if (it) { const r = await api('POST', '/audit/recycle-bin/restore', { item_ids: [it.id], ids: [it.id] }); o.restore = E(r); LED('ticket restored ' + o.y + ' ' + r.s); }
await sleep(3000); o.after = (await api('GET', '/modules/' + TK + '/records/' + o.y)).s;
const dis = await api('POST', '/desk/departments/' + DB + '/disable', { transfer_to_department_id: DD }); o.disable = E(dis); LED('department DISABLED ' + DB + ' "QA RT20 BP Dept B" with transfer to QA RT20 BP Dept: ' + dis.s);
await sleep(6000); o.xDept = (await rec(o.x)).department;
J.t3027 = { DB, x: o.x, y: o.y }; fs.writeFileSync(RUN + '/scripts/bp/3065.json', JSON.stringify(J, null, 1));
return o;
