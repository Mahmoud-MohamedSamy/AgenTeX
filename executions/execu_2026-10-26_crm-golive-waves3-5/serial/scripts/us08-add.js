const U = '3445ec4a-020e-4f12-b156-dd2de7610164', OWNER_P = '00000000-0000-0000-0000-0000000000ff';
const r = await call('POST', `/iam/users/${U}/profiles`, { profile_id: OWNER_P, scope_id: 'a9de6b1e-a5be-ed4c-b485-af6f22ea8b5e', replace: false });
const l = (await call('GET', '/iam/users?limit=200')).j.data; const u = (Array.isArray(l) ? l : l.items).find(x => x.userId === U);
return { add: r.s + ' ' + r.t.slice(0, 200), profilesNow: u.profileNames };
