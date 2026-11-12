// A2 helper: MODE=light swaps "Customer Experience Specialists 2" from Desk Agent to Desk Light Agent; MODE=restore puts Desk Agent back.
const MODE = process.env.MODE || 'light';
const AGENT = '44444444-4444-4444-4444-444444444402', LIGHT = '44444444-4444-4444-4444-444444444403';
const u = arr((await api('GET', '/iam/users?take=200')).j?.data).find(x => x.displayName === 'Customer Experience Specialists 2');
const before = u.profileNames;
const r = await api('POST', `/iam/users/${u.userId}/profiles`, { profile_id: MODE === 'light' ? LIGHT : AGENT, scope_id: u.orgUnitId, replace: true });
const after = arr((await api('GET', '/iam/users?take=200')).j?.data).find(x => x.userId === u.userId).profileNames;
log({ mode: MODE, before, status: r.s, err: r.s >= 300 ? r.t.slice(0, 200) : undefined, after });
