const g = await call('GET', `/modules/${MODS.leads}/records/5802bad5-b4f5-4b42-83c7-0a07a4c33d13`);
const v = k => (g.j.data.data.find(x => x.field === k) || {}).value;
const users = await call('GET', `/iam/users?limit=200`);
const u = (users.j.data || []).find(x => x.id === (v('owner') || {}).value);
const tl = await call('GET', `/timeline/records/leads/5802bad5-b4f5-4b42-83c7-0a07a4c33d13/feed`);
return { owner: v('owner'), user: u && (u.email + ' ' + u.status), timeline: (tl.j.data.data || []).map(e => e.entry_type + (e.field_key ? ':' + e.field_key : '')) };
