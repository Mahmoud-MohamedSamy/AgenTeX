const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const o = {}; const QAD = '9a7e391c-be72-49e4-a1cf-763e5c88e23d'; const rid = '52fd2a65-9ee9-43b7-b1e7-8d10c4c3bd8c'; const tid = 'd0a38429-33dd-4688-b533-82e472e552cc';
const pid = 'c83dddbf-983a-4c09-b004-bbfbbfe0fe6b'; const cid = '9b2c929a-51f3-4f3f-a98a-ed76ddc07597';
const rr = await api('PATCH', '/iam/org-units/' + rid + '?app_key=desk', { name: 'QA GL Role 2' });
const rl = await api('GET', '/iam/org-units?app_key=desk'); const f = (rl.j && rl.j.data || []).find(x => x.orgUnitId === rid);
o.W1_35 = { rename: S(rr), nameNow: f && f.name };
// team: get dept members to pick a valid one
const dept = (await api('GET', '/desk/departments/' + QAD)).j.data; o.deptAgents = (dept.agent_user_ids || []).length;
const member = (dept.agent_user_ids || [])[0];
let r = await api('PUT', '/desk/teams/' + tid, { name: 'QA GL Team 2', description: 'wave 1 edit', department_id: QAD, sources: member ? [{ kind: 'agent', ref_id: member }] : [], color: 'green', icon: 'flag' });
const tg = await api('GET', '/desk/teams/' + tid); const td = tg.j && tg.j.data && (tg.j.data.team || tg.j.data);
o.W1_44 = { update: S(r), after: td && (td.name + '|' + td.color + '|' + td.icon + '|members ' + (td.sources || []).length) };
const dup = await api('POST', '/desk/teams', { name: 'QA GL Team 2', department_id: QAD, sources: [] }); o.W1_45dup = S(dup);
const dupId = dup.j && dup.j.data && (dup.j.data.id || (dup.j.data.team && dup.j.data.team.id)); o.dupId = dupId || null;
const wl = await api('GET', '/desk/teams/' + tid + '/workload'); o.W1_46 = { ...S(wl), d: JSON.stringify(wl.j && wl.j.data).slice(0, 160) };
// profiles: effective perms
const eff = async id => { const x = await api('GET', '/iam/profiles/' + id + '/effective'); return x.j && x.j.data; };
const pe = await eff(pid), ce = await eff(cid); o.effShape = JSON.stringify(ce).slice(0, 300);
const keys = d => { const a = Array.isArray(d) ? d : (d && (d.permissions || d.effective || d.items || d.granted)) || []; return a.map(p => typeof p === 'string' ? p : (p.permission_key || p.key || p.permissionKey || p.code)).filter(Boolean); };
o.W1_39 = { parentEff: keys(pe).length, childEff: keys(ce).length };
// permission edit on QA GL Profile
const add = await api('POST', '/iam/profiles/' + pid + '/permissions', { permission_key: 'desk:macros:manage' });
const after = await api('GET', '/iam/profiles/' + pid + '/permissions'); const ak = JSON.stringify(after.j && after.j.data);
o.W1_40 = { add: S(add), hasMacros: ak.includes('desk:macros:manage') };
// built-in rename refused
o.W1_41 = S(await api('PATCH', '/iam/profiles/44444444-4444-4444-4444-444444444402', { name: 'Desk Agent' }));
return done(o);
