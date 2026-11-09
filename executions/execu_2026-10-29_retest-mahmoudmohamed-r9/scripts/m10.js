// NDC-2650 with the real profile id (profiles expose profileId).
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '6bf87122-6d42-48e9-acb1-1b5a63e4fcfb'; const out = {};
const P = arr((await api('GET', '/iam/profiles')).j?.data).find(p => p.name === 'User').profileId; out.userProfile = P;
const base = async () => { const g = (await api('GET', `/modules/${L}/layouts/${lid}`)).j?.data; const b = { ...g }; delete b.id; return b; };
const rd = async () => { const g = (await api('GET', `/modules/${L}/layouts/${lid}`)).j?.data; return { accessMode: g.accessMode, assignedProfiles: g.assignedProfiles }; };
out.before = await rd();
const p1 = await api('PUT', `/modules/${L}/layouts/${lid}`, { ...(await base()), accessMode: 'selected', assignedProfiles: [P] }); out.put = p1.s + ' ' + (p1.s >= 300 ? p1.t.slice(0, 250) : ''); out.afterPut = await rd();
const ap = await api('POST', `/modules/${L}/layouts/assignments`, { assignments: [{ profileId: P, layoutId: lid }] }); out.assignPost = ap.s + ' ' + JSON.stringify(ap.j?.data).slice(0, 300);
const ag = await api('GET', `/modules/${L}/layouts/assignments`); out.assignGet = ag.s + ' ' + JSON.stringify(arr(ag.j?.data).filter(x => x.layoutId === lid)).slice(0, 400);
const back = await api('PUT', `/modules/${L}/layouts/${lid}`, { ...(await base()), accessMode: 'all_users', assignedProfiles: [] }); out.putBack = back.s; out.afterBack = await rd();
return done(out);
