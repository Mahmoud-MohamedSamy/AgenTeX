const prev = JSON.parse(fs.readFileSync(RUN + '/out/rt5.json', 'utf8'));
const nm = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner' };
const profs = arr((await api('GET', '/iam/profiles?app_key=desk')).j?.data); const out = { profKeys: Object.keys(profs[0] || {}).join(',') };
const pid = n => { const p = profs.find(p => p.name === n) || {}; return p.profileId || p.id || p.profile_id; };
const R = {}, TK = {};
const OA = v => ({ type: 'OwnerAssignment', ownerTargetKind: 'RoleRoundRobin', ownerValue: v });
const plan = [['RT5PSUP', OA(pid('Desk Supervisor')), 3], ['RT5PADM', OA(pid('Desk Administrator')), 3], ['RT5PLIGHT', OA(pid('Desk Light Agent')), 2]];
for (const [k, act] of plan) { const r = await mkRule(k, { kind: 'RecordCreated' }, [act], { departmentIds: [DEPT2] }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + (r.err || '').slice(0, 200); }
// CRM role owner rule: activate and fire once
const CR = prev.R.RT5CRM; out.crmActivate = (await api('POST', `/workflow/rules/${CR}/activate`, {})).s; R.RT5CRM = CR; plan.push(['RT5CRM', null, 2]);
await sleep(3000);
for (const [k, , n] of plan) { if (!R[k]) continue; TK[k] = []; for (let i = 0; i < n; i++) { TK[k].push((await mkTicket(k, { department: DEPT2 }, 'n' + i)).id); await sleep(2500); } }
await sleep(35000);
out.crmDeactivate = (await api('POST', `/workflow/rules/${CR}/deactivate`, {})).s;
out.v = {}; for (const [k] of plan) { if (!R[k]) continue; out.v[k] = []; for (const t of TK[k]) { const o = (await getTicket(t)).owner; out.v[k].push((nm[o] || (o ? o.slice(0, 8) : 'none')) + ' | ' + (await execs(t, R[k])).flatMap(e => (e.dispatches || []).map(d => d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 110) + ')' : ''))).join(',')); } }
fs.writeFileSync(RUN + '/out/rt5b.json', JSON.stringify({ R, TK, out }, null, 1)); return out;
