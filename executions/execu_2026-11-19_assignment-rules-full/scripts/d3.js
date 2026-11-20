const L = []; const D = IDS.DA; const S = x => String(JSON.stringify(x === undefined ? null : x)).slice(0, 200);
const DR = async (name, tgts, extra) => mkRule({ type: 'direct', name, description: 'QA AR', is_active: true, execute_on: ['create'], targets: tgts, ...(extra || {}) });
const tk = async (s, dept, ex) => { const t = await mkTicket(s, dept || D, ex || {}); await sleep(4000); return t.id; };
// D-11 order + reorder
const a = await DR('QA AR D11a A1', [DT('QA AR D11', D, null, AG(IDS.A1))]); const b = await DR('QA AR D11b A2', [DT('QA AR D11', D, null, AG(IDS.A2))]);
let id = await tk('QA AR D11 first'); const o1 = await ownN(id);
const Lr = await rules('direct'); const ord = Lr.map(x => ({ id: x.id, version: x.version })); const ia = ord.findIndex(x => x.id === a.id), ib = ord.findIndex(x => x.id === b.id); const sw = [...ord];[sw[ia], sw[ib]] = [sw[ib], sw[ia]];
const ro = sh(await api('PUT', '/desk/assignment-rules/order', { type: 'direct', department_id: null, rules: sw })); LED('direct order: D11a/D11b swapped (both QA, deleted at cleanup)');
id = await tk('QA AR D11 after'); const o2 = await ownN(id);
L.push(R_('D-11', o1 === 'A1' && o2 === 'A2' && ro.s < 300 ? 'Pass' : 'Fail', 'Two matching direct rules: first ticket → ' + o1 + '; after swapping order (' + ro.s + (ro.e ? ' ' + ro.e : '') + ') → ' + o2));
// D-12 inactive + master off
await setActive(a.id, false); await setActive(b.id, false); id = await tk('QA AR D11 inactive'); const o3 = await ownN(id);
await setActive(a.id, true); const ns = (await api('GET', '/desk/assignment/notification-settings')).j.data; await api('PUT', '/desk/assignment/notification-settings', { ...ns, direct_rules_enabled: false });
id = await tk('QA AR D11 master off'); const o4 = await ownN(id); await api('PUT', '/desk/assignment/notification-settings', { ...ns, direct_rules_enabled: true }); await setActive(a.id, false);
L.push(R_('D-12', !o3 && !o4 ? 'Pass' : 'Fail', 'Both rules inactive → owner ' + o3 + '; rule active but Direct master switch off → owner ' + o4));
// D-13 agent removed from department
const r13 = await DR('QA AR D13 A2', [DT('QA AR D13', IDS.DB, null, AG(IDS.A2))]);
let dB = (await api('GET', '/desk/departments/' + IDS.DB)).j.data; const rm = sh(await api('PATCH', '/desk/departments/' + IDS.DB, { ...dB, agent_user_ids: dB.agent_user_ids.filter(x => x !== IDS.A2) })); LED('Dept B: A2 removed for D-13 (restore)');
id = await tk('QA AR D13 x', IDS.DB); const o5 = await ownN(id); const g = await getRule(r13.id);
dB = (await api('GET', '/desk/departments/' + IDS.DB)).j.data; const ad = sh(await api('PATCH', '/desk/departments/' + IDS.DB, { ...dB, agent_user_ids: [...new Set([...dB.agent_user_ids, IDS.A2])] })); LED('Dept B: A2 restored');
L.push(R_('D-13', o5 !== 'A2' ? 'Pass' : 'Fail', 'Direct rule → A2 in Dept B; A2 removed from Dept B (' + rm.s + '): ticket owner ' + o5 + '; rule target now ' + S(g && g.targets && g.targets[0] && (g.targets[0].assign || g.targets[0])).slice(0, 200) + '; A2 restored (' + ad.s + ')'));
// C-04 / C-05 / C-07 API validation
const v = async (name, tg) => { const r = await api('POST', '/desk/assignment-rules', { type: 'direct', name, description: 'QA', is_active: true, execute_on: ['create'], targets: [tg] }); if (r.j?.data?.id) { await api('DELETE', '/desk/assignment-rules/' + r.j.data.id); return 'ACCEPTED'; } return r.s + ' ' + (E(r) || '').slice(0, 140); };
const c4 = await v('QA AR C04', DT('QA AR C04', D, IDS.DB, AG(IDS.A3))); const c5 = await v('QA AR C05', DT('QA AR C05', null, null, AG(IDS.A1))); const c7 = await v('QA AR C07', DT('QA AR C07', D, null, { kind: 'agent', user_id: IDS.A1, team_id: IDS.TA }));
L.push(R_('C-04', /^4/.test(c4) ? 'Pass' : 'Fail', 'Move to Dept B + agent A3 who is not in Dept B → ' + c4));
L.push(R_('C-05', /^4/.test(c5) ? 'Pass' : 'Fail', 'Coming to Any Department, no move, agent A1 → ' + c5 + ' (requirement: can only be Unassigned)'));
L.push(R_('C-07', /^4/.test(c7) ? 'Pass' : 'Fail', 'Target with both agent and team → ' + c7));
saveIds(); return L;
