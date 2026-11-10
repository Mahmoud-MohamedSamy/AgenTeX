// NT-10: "reply not delivered" agent notice. A reply to an address that cannot receive mail; ticket owned by Test User 1.
// The rule is switched on in QA AO Dept A for the test if it is off, then set back. Part 2 (nt10b.js) reads Test User 1's bell.
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } }); const u = Math.random().toString(36).slice(2, 6), tag = 'NT10' + u; const R = { tag };
const rule = ((await api('GET', '/desk/notification-rules/departments/' + A)).j?.data?.rules || []).find(x => x.key === 'agent.reply_not_delivered'); R.ruleWas = rule?.is_enabled;
if (!rule?.is_enabled) { R.on = (await api('PUT', '/desk/notification-rules/departments/' + A + '/rules/agent.reply_not_delivered', { is_enabled: true, template_id: null })).s; await sleep(70000); }
const bad = 'qa-ao-' + u + '@nonexistent-domain-qa-ao.invalid';
const t = await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag), f('description', 'QA AO ' + tag), f('department', A), f('status', 'Open'), f('priority', 'high'), f('email', bad)] }); const id = t.j.data.id; R.ticket = id;
R.assign = (await api('POST', '/desk/tickets/' + id + '/assign', { owner_id: TU1, team_id: null })).s;
const rp = await api('POST', '/desk/tickets/' + id + '/replies', { mode: 'reply', to: [bad], subject: 'QA AO ' + tag, body_html: '<p>QA AO ' + tag + ' reply to an address that cannot receive mail</p>' }); R.reply = rp.s + (rp.s >= 300 ? ' ' + rp.t.slice(0, 200) : '');
await sleep(120000);
const feed = (await api('GET', '/desk/tickets/' + id + '/activity')).j; const L = Array.isArray(feed?.data) ? feed.data : [];
R.feed = L.map(e => e.action + (e.action.startsWith('reply') ? ' ' + JSON.stringify(e.summary || {}).slice(0, 140) : ''));
if (!R.ruleWas) { R.off = (await api('PUT', '/desk/notification-rules/departments/' + A + '/rules/agent.reply_not_delivered', { is_enabled: false, template_id: null })).s; }
fs.writeFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/nt10.json', JSON.stringify(R));
return R;
