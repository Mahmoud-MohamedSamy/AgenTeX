// NDC-2412 + NDC-2701: role-mode visibility. U1 = User @ team1 owns the lead; U2 moved Supervisor/Manager/User @ team1 / team2, restored to User @ team2.
const mode = (await api('o', 'GET', '/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org')).j?.data?.value_json;
const vis = arr((await api('o', 'GET', '/modules')).j?.data).find(m => m.id === T.LEADS)?.recordVisibility;
log('mode', mode, 'leads visibility', vis);
const mk = async (who, name) => { const r = await api(who, 'POST', `/modules/${T.LEADS}/records`, { layout_id: T.LEADS_STD, data: rec({ first_name: name, last_name: name, phone: '0100000' + String(Date.now()).slice(-4) }) }); if (r.s === 201 || r.s === 200) ledger(`lead ${r.j.data.id} "${name}" (Leads) by ${who}`); return r; };
const L1 = await mk('u1', 'QA RT 2412 U1 lead'); log('create as U1', L1.s, L1.s > 299 ? L1.t.slice(0, 300) : L1.j.data.id);
if (L1.s > 299) return 'stop';
const id1 = L1.j.data.id;
const setProf = async (prof, ou) => (await api('o', 'POST', `/iam/users/${T.U2}/profiles`, { profile_id: prof, scope_id: ou, replace: true })).s;
const perm = async w => { const t = (await api(w, 'GET', '/iam/me/permissions')).t; return t.includes('"metadata.records.view_all"'); };
const inList = async (w, id) => { for (let p = 1; p <= 3; p++) { const r = await api(w, 'GET', `/modules/${T.LEADS}/records?page=${p}`); const a = arr(r.j?.data); if (a.some(x => x.id === id)) return true; if (a.length < 100) break; } return false; };
const res = [];
const step = async (label, prof, ou, expect) => {
  const s = prof ? await setProf(prof, ou) : 'n/a'; await sleep(4000);
  const g = (await api('u2', 'GET', `/modules/${T.LEADS}/records/${id1}`)).s; const l = await inList('u2', id1);
  const row = { label, setProfile: s, open: g, inList: l, viewAll: await perm('u2'), expect, ok: (expect === 'see') === (g === 200) && (expect === 'see') === l };
  res.push(row); log(row);
};
ledger(`user U2 setoroj338 (${T.U2}) profile changes during NDC-2412 — baseline User @ team2, restore at the end of this script`);
await step('C0 U2 User @team2 (baseline, other OU, same rank)', null, null, 'hidden');
await step('C1 U2 Supervisor @team1 (same OU, higher)', T.P_SUPERVISOR, T.OU_TEAM1, 'see');
await step('C2 U2 Manager @team1 (same OU, higher)', T.P_MANAGER, T.OU_TEAM1, 'see');
await step('C3 U2 Manager @team2 (other OU) — NDC-2701', T.P_MANAGER, T.OU_TEAM2, 'hidden');
await step('C4 U2 Supervisor @team2 (other OU)', T.P_SUPERVISOR, T.OU_TEAM2, 'hidden');
await step('C5 U2 User @team1 (same OU, same rank)', T.P_USER, T.OU_TEAM1, 'hidden');
await step('C6 U2 Manager @agent x (child OU of team1)', T.P_MANAGER, T.OU_AGENTX, 'info');
// reverse control: lower rank can't see higher: U2 Supervisor @team1 creates a lead; U1 (User) opens it
await setProf(T.P_SUPERVISOR, T.OU_TEAM1); await sleep(4000);
const L2 = await mk('u2', 'QA RT 2412 U2 lead'); const g2 = L2.s < 300 ? (await api('u1', 'GET', `/modules/${T.LEADS}/records/${L2.j.data.id}`)).s : 'n/a';
res.push({ label: 'C7 U1 User opens a Supervisor @team1 lead (lower → higher)', open: g2, expect: 'hidden', ok: g2 === 403 || g2 === 404 }); log(res.at(-1));
const own = (await api('u1', 'GET', `/modules/${T.LEADS}/records/${id1}`)).s; res.push({ label: 'C8 U1 opens own lead', open: own, expect: 'see', ok: own === 200 }); log(res.at(-1));
const ow = (await api('o', 'GET', `/modules/${T.LEADS}/records/${id1}`)).s; res.push({ label: 'C9 Owner opens U1 lead', open: ow, expect: 'see', ok: ow === 200 }); log(res.at(-1));
const back = await setProf(T.P_USER, T.OU_TEAM2); await sleep(3000);
const u2 = arr((await api('o', 'GET', '/iam/users?limit=200')).j?.data).find(u => u.userId === T.U2);
log('restore U2', back, u2?.profileNames, u2?.orgUnitId === T.OU_TEAM2 ? 'team2' : u2?.orgUnitId);
ledger(`user U2 restored to User @ team2: ${back} (${u2?.profileNames})`);
return { mode, vis, id1, res };
