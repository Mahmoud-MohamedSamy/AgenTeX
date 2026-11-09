// J4 setup (owner): Reporting mode, chain test user 1 (top) -> zzsweep-tavi-probe (middle) -> zzsweep-tavi-probe2 (bottom); two QA leads.
const TOP = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2', MID = '5b3f7466', BOT = '523926ef';
const users = (await call('GET', '/iam/users?app_key=crm&limit=200')).j.data; const list = Array.isArray(users) ? users : users.items;
const full = p => list.find(u => (u.userId || u.id).startsWith(p)); const mid = full(MID), bot = full(BOT);
const hv = (await call('GET', '/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org')).j.data;
const m1 = await call('PUT', '/settings/values', { app_key: 'general', key: 'general.company.hierarchy.preference', scope_type: 'Org', scope_id: null, value_json: '"reporting"', expected_version: hv.version });
const s1 = await call('PATCH', `/iam/users/${mid.userId || mid.id}/reporting-manager`, { reporting_manager_id: TOP });
const s2 = await call('PATCH', `/iam/users/${bot.userId || bot.id}/reporting-manager`, { reporting_manager_id: mid.userId || mid.id });
const L = 'bf971461-2edc-45f2-b6e4-6e180aa64288', s = v => ({ kind: 'string', value: v });
const mk = async (n, owner) => call('POST', `/modules/${MODS.leads}/records`, { layout_id: L, data: [{ field: 'first_name', value: s(n) }, { field: 'phone', value: s('0101' + String(Date.now()).slice(-7)) }, { field: 'single_line_3_9', value: s('QA W1') }, { field: 'owner', value: s(owner) }] });
const lb = await mk('QA W1 J4 bottom-owned', bot.userId || bot.id); const lm = await mk('QA W1 J4 middle-owned', mid.userId || mid.id);
const own = async id => { const g = await call('GET', `/modules/${MODS.leads}/records/${id}`); return ((g.j.data.data.find(x => x.field === 'owner') || {}).value || {}).value; };
return { mode: m1.s + ' ' + (m1.s >= 300 ? m1.t.slice(0, 150) : ''), setMid: s1.s, setBot: s2.s, midId: mid.userId || mid.id, botId: bot.userId || bot.id,
  leadBottom: lb.s < 300 ? lb.j.data.id : lb.s + ' ' + lb.t.slice(0, 150), leadMiddle: lm.s < 300 ? lm.j.data.id : lm.s + ' ' + lm.t.slice(0, 150),
  ownerBottom: lb.s < 300 ? await own(lb.j.data.id) : null, ownerMiddle: lm.s < 300 ? await own(lm.j.data.id) : null };
