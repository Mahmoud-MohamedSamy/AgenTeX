// AC-05: revoke permission without manage (Supervisor C, added to the dept for this case only).
const tag = 'AC5' + uid();
const b = await mkBp(BASIC(tag));
const add = await deptMembers([U.C1]);
const t = await mkT(tag); await waitIn(t);
const list = await C1('GET', `/modules/${T}/blueprints?includeInactive=true`);
const rv = await revoke1(t, C1); await sleep(1500); const out = !(await bstate(t));
const rm = await deptMembers([], [U.C1]);
const back = (await deptGet()).agent_user_ids.includes(U.C1);
R('AC-05', list.s === 403 && ok(rv) && out ? 'PASS' : 'FAIL', `Supervisor (revoke only): designer list ${list.s}; revoke ticket ${E(rv)}; left blueprint ${out}. dept add ${add.s} remove ${rm.s}, C still member ${back}`);
return await cleanup();
