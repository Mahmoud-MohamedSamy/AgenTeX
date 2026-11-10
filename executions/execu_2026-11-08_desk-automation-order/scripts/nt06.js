// NT-06: CC rules for each event in QA AO Dept A (CC = the user's Gmail +qaao alias). Records every mail the feed logs and to whom.
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d', C = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const G = 'mahmoud.mmohamedsamy@gmail.com', CC = 'mahmoud.mmohamedsamy+qaao@gmail.com';
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } }); const u = Math.random().toString(36).slice(2, 6), tag = 'NT06' + u; const R = { tag };
R.rules = ((await api('GET', '/desk/notification-rules/departments/' + A)).j?.data?.rules || []).filter(x => /^(cc|contact)\./.test(x.key)).map(x => x.key + '=' + x.is_enabled);
const ct = await api('POST', '/modules/' + C + '/records', { data: [f('last_name', 'QA AO ' + tag), f('email', G)] }); const cid = ct.j.data.id;
const t = await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag), f('description', 'QA AO ' + tag), f('department', A), f('status', 'Open'), f('priority', 'high'), f('contact_id', cid), f('email', G)] }); const id = t.j.data.id;
const mails = async () => { const j = (await api('GET', '/desk/tickets/' + id + '/activity')).j; const L = Array.isArray(j?.data) ? j.data : (j?.data?.items || []); return L.filter(e => e.action === 'reply.sent').map(e => JSON.stringify(e.summary || {}).replace(/[A-Za-z0-9._%+-]+@gmail\.com/g, m => m.includes('+qaao') ? '<cc-alias>' : '<gmail>').slice(0, 160)); };
const step = async (name, fn) => { const before = (await mails()).length; R[name] = { call: await fn() }; await sleep(25000); const all = await mails(); R[name].newMails = all.slice(0, all.length - before); };
await sleep(20000);
await step('add CC', async () => (await api('POST', '/desk/tickets/' + id + '/cc', { address: CC })).s);
let cm;
await step('public comment added', async () => { const r = await api('POST', '/desk/tickets/' + id + '/comments', { body_html: '<p>QA AO ' + tag + ' public comment</p>', is_public: true }); cm = r.j?.data?.id || r.j?.data?.comment?.id; return r.s; });
await step('public comment edited', async () => (await api('PATCH', '/desk/tickets/' + id + '/comments/' + cm, { body_html: '<p>QA AO ' + tag + ' public comment (edited)</p>' })).s);
await step('public comment deleted', async () => (await api('DELETE', '/desk/tickets/' + id + '/comments/' + cm)).s);
await step('closed', async () => (await api('POST', '/desk/tickets/' + id + '/close', {})).s);
R.cleanup = [(await api('DELETE', '/modules/' + M + '/records/' + id)).s, (await api('DELETE', '/modules/' + C + '/records/' + cid)).s];
return R;
