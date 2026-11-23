// Role/profile re-run with Desk roles (23 Nov). Dept B agents: Dev Team 2 (Manager, Desk Administrator), Test User 1 (Manager, Desk Supervisor), owner (no Desk role, Owner).
const out = {}; const R = {}; const TK = {};
const MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd', SUP = '685c01ab-5e57-4a96-af90-3c98dfe52692', CRMCEO = 'f5868c9f';
const nm = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2', '97be04b6-0a08-4883-aa51-e1650b11cab7': 'owner' };
const profs = arr((await api('GET', '/iam/profiles?app_key=desk')).j?.data); const pid = n => (profs.find(p => p.name === n) || {}).id;
const crmCeo = (arr((await api('GET', '/iam/org-units?take=500')).j?.data).find(o => (o.orgUnitId || o.id).startsWith(CRMCEO)) || {}); const CRMID = crmCeo.orgUnitId || crmCeo.id;
const tpl = ((await api('GET', '/desk/email-templates')).j?.data?.email_templates || []).find(t => t.name === 'QA RT19 NTF 2864 assigned tpl');
out.ids = { DeskSupervisor: pid('Desk Supervisor'), DeskAdmin: pid('Desk Administrator'), DeskLight: pid('Desk Light Agent'), crmCeo: CRMID, tpl: tpl && tpl.id };
const OA = (kind, v) => ({ type: 'OwnerAssignment', ownerTargetKind: kind, ownerValue: v });
const plan = [['RT5MGR', OA('OrgUnitRoundRobin', MGR), 4], ['RT5SUP', OA('OrgUnitRoundRobin', SUP), 2], ['RT5PSUP', OA('RoleRoundRobin', pid('Desk Supervisor')), 3], ['RT5PADM', OA('RoleRoundRobin', pid('Desk Administrator')), 3], ['RT5PLIGHT', OA('RoleRoundRobin', pid('Desk Light Agent')), 2]];
if (tpl) { plan.push(['RT5EMOU', { type: 'Email', emailTemplateId: tpl.id, emailRecipients: [{ kind: 'OrgUnit', value: SUP }] }, 1]); plan.push(['RT5EMTREE', { type: 'Email', emailTemplateId: tpl.id, emailRecipients: [{ kind: 'OrgUnitTree', value: SUP }] }, 1]); }
for (const [k, act] of plan) { const r = await mkRule(k, { kind: 'RecordCreated' }, [act], { departmentIds: [DEPT2] }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + (r.err || '').slice(0, 250); }
// RG-02: CRM role refused?
const bad = await mkRule('RT5CRM', { kind: 'RecordCreated' }, [OA('OrgUnitRoundRobin', CRMID)], { departmentIds: [DEPT2], active: false }); out.crmRoleOwner = bad.s + ' ' + (bad.err || 'SAVED ' + bad.id).slice(0, 250); if (bad.id) R.RT5CRM = bad.id;
const bad2 = tpl ? await mkRule('RT5CRMEM', { kind: 'RecordCreated' }, [{ type: 'Email', emailTemplateId: tpl.id, emailRecipients: [{ kind: 'OrgUnit', value: CRMID }] }], { departmentIds: [DEPT2], active: false }) : null; if (bad2) { out.crmRoleEmail = bad2.s + ' ' + (bad2.err || 'SAVED ' + bad2.id).slice(0, 250); if (bad2.id) R.RT5CRMEM = bad2.id; }
await sleep(3000);
for (const [k, , n] of plan) { if (!R[k]) continue; TK[k] = []; for (let i = 0; i < n; i++) { TK[k].push((await mkTicket(k, { department: DEPT2 }, 'n' + i)).id); await sleep(2500); } }
await sleep(35000);
out.v = {}; for (const [k] of plan) { if (!R[k]) continue; out.v[k] = []; for (const t of TK[k]) { const o = (await getTicket(t)).owner; out.v[k].push((nm[o] || (o ? o.slice(0, 8) : 'none')) + ' | ' + (await execs(t, R[k])).flatMap(e => (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 110) + ')' : ''))).join(',')); } }
fs.writeFileSync(RUN + '/out/rt5.json', JSON.stringify({ R, TK, out }, null, 1)); return out;
