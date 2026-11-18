const TE = '1499272000000006907', TC = '1499272000000432293', A2 = '1499272000000432034';
const pr = async (m, p, b) => { const r = await api(page, m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 130) : ''); };
const T = { Z1: '1499272000000451605', Z2: '1499272000000451643', Z3: '1499272000000451682', Z4: '1499272000000451721', Z7: '1499272000000451850' };
out.myDepts = ((await api(page, 'GET', 'myinfo')).j || {}).associatedDepartmentIds;
out.listTech = await pr('GET', 'tickets?departmentId=' + TC + '&limit=10');
out.r = {};
for (const [k, id] of Object.entries(T)) { const o = {}; o.get = await pr('GET', 'tickets/' + id);
  if (k !== 'Z1' && k !== 'Z7' || true) { o.priority = await pr('PATCH', 'tickets/' + id, { priority: 'Low' }); o.status = await pr('PATCH', 'tickets/' + id, { status: 'On Hold' }); o.owner = await pr('PATCH', 'tickets/' + id, { assigneeId: A2 });
    o.comment = await pr('POST', 'tickets/' + id + '/comments', { content: 'QA AC agent2 private comment ' + k, isPublic: false });
    o.reply = await pr('POST', 'tickets/' + id + '/sendReply', { channel: 'EMAIL', to: 'qa-ac-z1@example.com', content: 'QA AC agent2 reply test ' + k, contentType: 'plainText' });
    o.reshare = await pr('PATCH', 'tickets/' + id, { sharedDepartments: [{ id: TE, type: 'READ_WRITE' }] }); }
  out.r[k] = o; }
out.createTech = await pr('POST', 'tickets', { subject: 'QA AC Z agent2 into Tech', departmentId: TC, contact: { lastName: 'QA AC Zoho', email: 'qa-ac-z1@example.com' }, channel: 'Phone' });
out.moveOwnToTech = await pr('POST', 'tickets/1499272000000451760/move', { departmentId: TC });
out.after5 = await pr('GET', 'tickets/1499272000000451760');
