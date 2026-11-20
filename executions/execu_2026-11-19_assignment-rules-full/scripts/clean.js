const AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a'; const lines = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n');
const ids = re => [...new Set(lines.filter(l => re.test(l)).map(l => (l.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/) || [])[0]).filter(Boolean))];
const R = { tickets: {}, rules: {}, wf: {}, skills: {}, other: {} }; const tally = (o, s) => { o[s] = (o[s] || 0) + 1; };
// rules first (so nothing re-assigns during deletes)
for (const id of ids(/ rule /)) { const g = await getRule(id); if (!g) { tally(R.rules, 'gone'); continue; } const d = await api('DELETE', '/desk/assignment-rules/' + id + '?version=' + g.version); tally(R.rules, d.s); }
for (const id of ids(/ workflow "/)) tally(R.wf, (await api('DELETE', '/workflow/rules/' + id)).s);
for (const id of ids(/ ticket "QA AR/)) tally(R.tickets, (await api('DELETE', '/modules/' + T + '/records/' + id)).s);
const sk = (await api('GET', '/desk/skills?department_id=' + IDS.DA)).j.data.skills.filter(s => /^QA AR/.test(s.name));
for (const s of sk) tally(R.skills, (await api('DELETE', '/desk/skills/' + s.id + '?department_id=' + IDS.DA)).s);
const ty = ((await api('GET', '/desk/skill-types?department_id=' + IDS.DA)).j.data.types || []).filter(t => /^QA AR/.test(t.name));
for (const t of ty) R.other['type ' + t.name] = (await api('DELETE', '/desk/skill-types/' + t.id + '?department_id=' + IDS.DA)).s;
for (const id of ids(/ SLA policy /)) R.other.sla = (await api('DELETE', '/desk/sla/policies/' + id)).s;
for (const id of ids(/ contact QA AR/)) R.other.contact = (await api('DELETE', '/modules/' + CM + '/records/' + id)).s;
for (const id of ids(/ account QA AR/)) R.other.account = (await api('DELETE', '/modules/' + AM + '/records/' + id)).s;
// settings
const pA = JSON.parse(fs.readFileSync(RUN + '/out/prefsDA-before.json', 'utf8')); const B = JSON.parse(fs.readFileSync(RUN + '/out/baseline.json', 'utf8')); const pB = B.perDept[IDS.DB].rrPrefs.data;
R.other.prefsA = (await api('PUT', '/desk/departments/' + IDS.DA + '/round-robin-preferences', pA)).s; R.other.prefsB = (await api('PUT', '/desk/departments/' + IDS.DB + '/round-robin-preferences', pB)).s;
R.other.prefsSame = JSON.stringify(await prefsG(IDS.DA)) === JSON.stringify(pA) && JSON.stringify(await prefsG(IDS.DB)) === JSON.stringify(pB);
const nb = JSON.parse(fs.readFileSync(RUN + '/out/notif-before.json', 'utf8')); R.other.switches = (await api('PUT', '/desk/assignment/notification-settings', nb)).s; R.other.switchesNow = (await api('GET', '/desk/assignment/notification-settings')).j.data;
for (const D of [IDS.DA, IDS.DB]) { const d = (await api('GET', '/desk/departments/' + D)).j.data; R.other['A2out ' + d.name] = sh(await api('PATCH', '/desk/departments/' + D, { ...d, agent_user_ids: d.agent_user_ids.filter(x => x !== IDS.A2) })).s; }
R.other.teamA = (await api('GET', '/desk/departments/' + IDS.DA + '/team-assignment')).j.data;
LED('CLEANUP run: ' + JSON.stringify(R).slice(0, 400));
return R;
