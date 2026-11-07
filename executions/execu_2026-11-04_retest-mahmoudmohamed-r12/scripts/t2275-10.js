const M = require("./p2275.js"); const Z = M({api, X, sleep, arr, ledger, log}); const o = {}; const E = { api, X, sleep, arr }; const { U, A, B, cond } = Z;
const C = (f, op, v) => ({ criteria: { conditions: [cond(f, op, v)], pattern: null } });
const D = await Z.rules('direct'); const da1 = D.find(r => r.name === 'QA RT12 2275 DA1'), da3 = D.find(r => r.name === 'QA RT12 2275 DA3');
o.order0 = D.map(r => r.name.slice(0, 30));
// GEN-3: no execute_on
o.gen3 = X.err(await api('o', 'POST', 'desk:/desk/assignment-rules', { type: 'direct', department_id: null, name: 'QA RT12 2275 noexec', is_active: true, execute_on: [], targets: [{ ...C('subject', 'contains', 'zzz'), coming_to_department_id: A, move_to_department_id: null, assign: { kind: 'agent', user_id: U.A1, team_id: null } }] }));
// GEN-4: 6 targets
const six = Array.from({ length: 6 }, (_, i) => ({ ...C('subject', 'contains', 'zz' + i), coming_to_department_id: A, move_to_department_id: null, assign: { kind: 'agent', user_id: U.A1, team_id: null } }));
const r6 = await api('o', 'POST', 'desk:/desk/assignment-rules', { type: 'direct', department_id: null, name: 'QA RT12 2275 six', is_active: true, execute_on: ['create'], targets: six }); o.gen4six = X.err(r6) + ' ' + (r6.j?.error?.details || []).map(d => d.field + ':' + d.issue).join(','); if (r6.j?.data?.id) ledger('NDC-2275: direct rule six targets (should not exist) ' + r6.j.data.id);
// DA-5: A1 at threshold 6 -> direct still assigns A1
o.da5 = await Z.waitOwner(await Z.tk('DA1 at-threshold'));
// GEN-6: both match, then reorder
const both = 'DA1 + QA RT12 2275 DA3'; o.gen6a = (await Z.waitOwner(await Z.tk(both))).owner;
const ids = D.map(r => r.id); const i1 = ids.indexOf(da1.id), i3 = ids.indexOf(da3.id); const sw = [...D]; [sw[i1], sw[i3]] = [sw[i3], sw[i1]];
const ro = await api('o', 'PUT', 'desk:/desk/assignment-rules/order', { type: 'direct', department_id: null, rules: sw.map(r => ({ id: r.id, version: r.version })) }); o.reorder = X.err(ro);
o.gen6b = (await Z.waitOwner(await Z.tk(both + ' r2'))).owner;
const D2 = await Z.rules('direct'); const back = await api('o', 'PUT', 'desk:/desk/assignment-rules/order', { type: 'direct', department_id: null, rules: ids.map(id => { const r = D2.find(x => x.id === id); return { id, version: r.version }; }) }); o.reorderBack = X.err(back) + ' ' + (await Z.rules('direct')).map(r => r.id).every((id, i) => id === ids[i]);
// GEN-7: deactivate DA1
let r1 = (await Z.rules('direct')).find(r => r.id === da1.id);
o.deact = X.err(await api('o', 'PUT', `desk:/desk/assignment-rules/${da1.id}/active`, { is_active: false, version: r1.version }));
o.gen7off = (await Z.waitOwner(await Z.tk('DA1 inactive'), 10000)).owner;
r1 = (await Z.rules('direct')).find(r => r.id === da1.id); o.react = X.err(await api('o', 'PUT', `desk:/desk/assignment-rules/${da1.id}/active`, { is_active: true, version: r1.version })); r1 = (await Z.rules('direct')).find(r => r.id === da1.id); o.targetsKept = r1.targets.length + ' ' + r1.targets[0].assign.kind + ' ' + Z.N[r1.targets[0].assign.user_id];
// master switch (org-wide) - seconds only
const ns0 = (await api('o', 'GET', 'desk:/desk/assignment/notification-settings')).j.data;
o.msOff = X.err(await api('o', 'PUT', 'desk:/desk/assignment/notification-settings', { ...ns0, direct_rules_enabled: false }));
const tm = await Z.tk('DA3 master-off'); await sleep(8000);
o.msOn = X.err(await api('o', 'PUT', 'desk:/desk/assignment/notification-settings', ns0)); o.msRestored = JSON.stringify((await api('o', 'GET', 'desk:/desk/assignment/notification-settings')).j.data) === JSON.stringify(ns0);
o.gen7master = (await Z.owner(tm)).owner; o.listedWhileOff = (await Z.rules('direct')).length;
// NF-5 stale version
r1 = (await Z.rules('direct')).find(r => r.id === da1.id);
const body = { type: 'direct', department_id: null, name: r1.name, description: r1.description, is_active: true, execute_on: r1.execute_on, targets: r1.targets.map(t => ({ criteria: t.criteria, coming_to_department_id: t.coming_to_department_id, move_to_department_id: t.move_to_department_id, assign: t.assign })) };
o.save1 = X.err(await api('o', 'PUT', `desk:/desk/assignment-rules/${da1.id}`, { ...body, description: 'QA retest r12 - safe to delete (edit 1)', version: r1.version }));
const st = await api('o', 'PUT', `desk:/desk/assignment-rules/${da1.id}`, { ...body, description: 'stale edit', version: r1.version }); o.staleSave = X.err(st);
// Team target + Move to department
const tc = await api('o', 'POST', 'desk:/desk/teams', { name: 'QA RT12 2275 team', description: 'QA retest r12 - safe to delete', department_id: A, sources: [{ kind: 'agent', ref_id: U.A3 }, { kind: 'agent', ref_id: U.A2 }] }); const teamId = tc.j?.data?.id || tc.j?.data?.team?.id; o.team = X.err(tc) + ' ' + teamId; if (teamId) ledger('NDC-2275: team "QA RT12 2275 team" ' + teamId + ' (Dept A, A3+A2)');
const T3 = [
  { ...C('subject', 'contains', 'QA RT12 2275 DT team'), coming_to_department_id: A, move_to_department_id: null, assign: { kind: 'team', user_id: null, team_id: teamId } },
  { ...C('subject', 'contains', 'QA RT12 2275 DT move'), coming_to_department_id: A, move_to_department_id: B, assign: { kind: 'unassigned', user_id: null, team_id: null } }];
const dt = await Z.mkRule({ type: 'direct', department_id: null, name: 'DA team+move bad', targets: [...T3, { ...C('subject', 'contains', 'QA RT12 2275 DT bad'), coming_to_department_id: A, move_to_department_id: B, assign: { kind: 'agent', user_id: U.A1, team_id: null } }] });
o.dtBadAgent = X.err(dt) + ' ' + (dt.j?.error?.details || []).map(d => d.field + ':' + d.issue).join(',');
if (dt.s >= 400) { const dt2 = await Z.mkRule({ type: 'direct', department_id: null, name: 'DA team+move', targets: T3 }); o.dt2 = X.err(dt2) + ' ' + (dt2.j?.error?.details || []).map(d => d.field + ':' + d.issue).join(','); }
const nb = arr((await api('a', 'GET', 'desk:/notifications?limit=50')).j?.data).map(n => n.id);
const tt = await Z.tk('DT team'); const tmv = await Z.tk('DT move'); await sleep(20000);
o.teamTicket = await Z.owner(tt); o.teamAuto = await M.auto(Z, E, tt); o.moveTicket = await Z.owner(tmv); o.moveAuto = await M.auto(Z, E, tmv);
o.A3teamNotif = arr((await api('a', 'GET', 'desk:/notifications?limit=50')).j?.data).filter(n => !nb.includes(n.id)).map(n => n.title);
return o;
