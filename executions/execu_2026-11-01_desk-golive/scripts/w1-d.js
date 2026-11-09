const C = []; const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const o = {}; const QAD = '9a7e391c-be72-49e4-a1cf-763e5c88e23d'; const OWNER = '7017d261-36ee-4e2f-9e60-2310ece52ef8';
const AGENT_ROLE = '27c10f86-0928-42cc-a970-cb48a6c01a04'; const DESK_AGENT = '44444444-4444-4444-4444-444444444402'; const DESK_SUP = '44444444-4444-4444-4444-444444444404';
// teams
let r = await api('POST', '/desk/teams', { name: 'QA GL Team', description: 'wave 1', department_id: QAD, sources: [{ kind: 'agent', ref_id: OWNER }], color: 'blue', icon: 'star' });
const tid = r.j && r.j.data && (r.j.data.id || (r.j.data.team && r.j.data.team.id)); if (tid) C.push({ k: 'team', id: tid });
o.W1_44 = { create: S(r), id: tid, d: JSON.stringify(r.j && r.j.data).slice(0, 200) };
r = await api('PUT', '/desk/teams/' + tid, { name: 'QA GL Team 2', description: 'wave 1 edit', department_id: QAD, sources: [{ kind: 'agent', ref_id: OWNER }], color: 'green', icon: 'flag' });
const tg = await api('GET', '/desk/teams/' + tid); const td = tg.j && tg.j.data && (tg.j.data.team || tg.j.data);
o.W1_44.update = S(r); o.W1_44.after = td && (td.name + '|' + td.color + '|' + td.icon);
const v1 = await api('POST', '/desk/teams', { name: 'QA GL Team 2', department_id: QAD, sources: [] });
const v2 = await api('POST', '/desk/teams', { name: '', department_id: QAD, sources: [] });
const v3 = await api('POST', '/desk/teams', { name: 'QA GL Team bad', department_id: QAD, sources: [{ kind: 'agent', ref_id: '11111111-1111-1111-1111-111111111111' }] });
for (const v of [v1, v2, v3]) { const i = v.j && v.j.data && (v.j.data.id || (v.j.data.team && v.j.data.team.id)); if (i) C.push({ k: 'team', id: i }); }
o.W1_45 = { dupName: S(v1), empty: S(v2), unknownMember: S(v3) };
const wl = await api('GET', '/desk/teams/' + tid + '/workload'); o.W1_46 = { ...S(wl), d: JSON.stringify(wl.j && wl.j.data).slice(0, 160) };
// roles
r = await api('POST', '/iam/org-units', { parent_id: AGENT_ROLE, name: 'QA GL Role', app_key: 'desk' });
const rid = r.j && r.j.data && (r.j.data.orgUnitId || r.j.data.id || r.j.data.org_unit_id); if (rid) C.push({ k: 'role', id: rid });
const rr = await api('PATCH', '/iam/org-units/' + rid, { name: 'QA GL Role 2' });
const rl = await api('GET', '/iam/org-units?app_key=desk'); const found = (rl.j && rl.j.data || []).find(x => x.orgUnitId === rid);
o.W1_35 = { create: S(r), id: rid, rename: S(rr), nameNow: found && found.name };
// profiles
r = await api('POST', '/iam/profiles', { name: 'QA GL Profile', parent_profile_id: DESK_SUP, rank: 90, is_tenant_wide: false, source_profile_id: DESK_AGENT, app_key: 'desk' });
const pid = r.j && r.j.data && (r.j.data.profileId || r.j.data.id || r.j.data.profile_id); if (pid) C.push({ k: 'profile', id: pid });
const ep = async id => { const x = await api('GET', '/iam/profiles/' + id + '/permissions'); const d = x.j && x.j.data; const a = Array.isArray(d) ? d : (d && (d.permissions || d.items)) || []; return a.map(p => typeof p === 'string' ? p : (p.permission_key || p.key || p.permissionKey || p.code || JSON.stringify(p).slice(0, 40))).sort(); };
const src = await ep(DESK_AGENT); const cl = await ep(pid);
o.W1_38 = { create: S(r), id: pid, srcCount: src.length, cloneCount: cl.length, same: JSON.stringify(src) === JSON.stringify(cl), sample: src.slice(0, 4) };
r = await api('POST', '/iam/profiles', { name: 'QA GL Child', parent_profile_id: pid, rank: 80, is_tenant_wide: false, app_key: 'desk' });
const cid = r.j && r.j.data && (r.j.data.profileId || r.j.data.id || r.j.data.profile_id); if (cid) C.push({ k: 'profile', id: cid });
const ch = await ep(cid); const eff = await api('GET', '/iam/profiles/' + cid + '/effective');
o.W1_39 = { create: S(r), id: cid, childPerms: ch.length, effective: S(eff), effCount: JSON.stringify(eff.j && eff.j.data).length };
return done({ o, C });
