const o = JSON.parse(fs.readFileSync(RUN + '/out/rt6.json', 'utf8')); const out = {}; const R = {}, TK = {};
const DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', TU1 = '876ce871-2b02-4854-89a7-68050391c62b'; const nm = { [TU1]: 'Test User 1', [DEV2]: 'Dev Team 2' };
const list = ((d => d?.skills || arr(d))((await api('GET', '/desk/skills?department_id=' + DEPT2)).j?.data)); const me = list.find(s => s.id === o.SK); const KEY = me.key || me.skill_key || me.name; out.key = KEY;
let r = await mkRule('RT6ADD', { kind: 'RecordCreated' }, [{ type: 'AddTicketSkills', skillKeys: [KEY] }], { departmentIds: [DEPT2] }); R.ADD = r.id; out.addSave = r.s + ' ' + (r.err || '');
await sleep(2000);
TK.t = (await mkTicket('RT6ADD', { department: DEPT2 }, 'skilled')).id; await sleep(15000);
const raw = (await api('GET', `/modules/${T}/records/${TK.t}`)).j?.data?.data || []; out.skillFieldsAfterAdd = raw.filter(x => /skill/i.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value).slice(0, 120));
out.addRun = (await execs(TK.t, R.ADD)).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 100) + ')' : '')).join(','));
out.ownerBefore = nm[(await getTicket(TK.t)).owner] || (await getTicket(TK.t)).owner || 'none';
// reassign rule on edit (guarded by this ticket's subject)
r = await mkRule('RT6RE', { kind: 'RecordUpdated' }, [{ type: 'ReassignTicketBySkills' }], { departmentIds: [DEPT2], noGuard: true, criteria: sm('subject', 'StartsWith', 'QA WF RT6ADD skilled') }); R.RE = r.id;
await sleep(2000); await patchTicket(TK.t, { classification: 'problem' }); await sleep(20000);
out.ownerAfter = nm[(await getTicket(TK.t)).owner] || (await getTicket(TK.t)).owner || 'none';
out.reRun = (await execs(TK.t, R.RE)).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 100) + ')' : '')).join(','));
const pres = await api('GET', '/desk/agents/presence?user_ids=' + DEV2); out.presence = pres.s + ' ' + pres.t.slice(0, 200);
fs.writeFileSync(RUN + '/out/rt6c.json', JSON.stringify({ R, TK, out }, null, 1)); return out;
