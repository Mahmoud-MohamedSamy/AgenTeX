// NDC-2650: layout access through the API on a QA layout of Leads (created here, deleted at cleanup).
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const profs = arr((await api('GET', '/iam/profiles')).j?.data); const user = profs.find(p => p.name === 'User'); out.userProfile = user?.id;
const std = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).find(x => x.name === 'Standard');
const c = await api('POST', `/modules/${L}/layouts`, { name: 'QA RT r8 layout', views: (await api('GET', `/modules/${L}/layouts/${std.id}`)).j?.data?.views, assignedProfiles: [], status: 'active' });
const lid = c.j?.data?.id; out.create = c.s + ' ' + (lid || c.t.slice(0, 200)); if (!lid) return done(out);
const g0 = (await api('GET', `/modules/${L}/layouts/${lid}`)).j?.data; out.before = { accessMode: g0.accessMode, assignedProfiles: g0.assignedProfiles };
const body = { ...g0, accessMode: 'selected', assignedProfiles: [user.id] }; delete body.id;
const p = await api('PUT', `/modules/${L}/layouts/${lid}`, body); out.put = p.s + ' ' + (p.s >= 300 ? p.t.slice(0, 200) : '');
const g1 = (await api('GET', `/modules/${L}/layouts/${lid}`)).j?.data; out.after = { accessMode: g1.accessMode, assignedProfiles: g1.assignedProfiles };
const a = await api('GET', `/modules/${L}/layouts/assignments`); out.assignmentsGet = a.s + ' ' + a.t.slice(0, 300);
const ap = await api('POST', `/modules/${L}/layouts/assignments`, { assignments: [{ profileId: user.id, layoutId: lid }] }); out.assignmentsPost = ap.s + ' ' + ap.t.slice(0, 200);
const a2 = await api('GET', `/modules/${L}/layouts/assignments`); out.assignmentsGet2 = a2.s + ' ' + JSON.stringify(arr(a2.j?.data).filter(x => x.layoutId === lid || x.layout_id === lid)).slice(0, 300);
// back to all users
const body2 = { ...g1, accessMode: 'all_users', assignedProfiles: [] }; delete body2.id; out.putBack = (await api('PUT', `/modules/${L}/layouts/${lid}`, body2)).s;
const g2 = (await api('GET', `/modules/${L}/layouts/${lid}`)).j?.data; out.afterBack = { accessMode: g2.accessMode, assignedProfiles: g2.assignedProfiles }; out.lid = lid;
return done(out);
