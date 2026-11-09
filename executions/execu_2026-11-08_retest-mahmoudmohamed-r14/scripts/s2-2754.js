const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-08_retest-mahmoudmohamed-r14/';
const O = X.ids.OWNER, AG = X.ids.AG, A = X.ids.DEPT_A, B = X.ids.DEPT_B; const P = 'QA RT14 2754F';
const o = {}; const uuid = () => require('crypto').randomUUID(); const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const run = (who, tid, tr, exp, extra = {}) => api(who, 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/${tr}`, { run_id: uuid(), expected_state_id: exp, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
const owners = (tid, tr, b) => api('o', 'PUT', `desk:/modules/${X.TK}/records/${tid}/blueprint/owners/${tr}`, { userIds: [], teamIds: [], departmentOwners: [], ...b });
const me = await api('a', 'GET', 'desk:/iam/me'); o.agent = JSON.stringify(me.j?.data || me.t).match(/"display_name":"[^"]*"|"name":"[^"]*"/)?.[0];
const def = X.bp('2754 share', { marker: P }).state('Open').state('Escalated').terminal('Closed')
  .tr('alt', 'Open', 'Closed', {}, { messages: [], deskItems: [{ kind: 'share', mandatory: true }], itemOrder: ['desk:share'], requiredFields: [], fieldValidations: [], instructionalMessage: null })
  .tr('go', 'Open', 'Escalated').build();
def.strictMode = { scope: 'all', fields: [], actions: [] }; def.dynamicOwners = true;
const b = await X.createBp(def, true); o.bp = X.err(b) + ' ' + (b.s >= 400 ? b.t.slice(0, 400) : ''); o.bpId = b.j?.data?.id; if (!o.bpId) return o;
const G = {}; for (const k of ['g1', 'g2', 'g3', 'g4']) { const r = await X.ticket(P + ' ' + k + ' admin-owned', { owner: O }); G[k] = r.j?.data?.id; }
await sleep(7000); o.states = {}; for (const k in G) o.states[k] = await st(G[k]);
o['1 agent GET g1 before owner'] = full(await api('a', 'GET', `desk:/modules/${X.TK}/records/${G.g1}`));
for (const k of ['g1', 'g2', 'g3']) o['owners alt ' + k] = full(await owners(G[k], 'alt', { userIds: [AG] }));
o['2 agent GET g1 as step owner'] = full(await api('a', 'GET', `desk:/modules/${X.TK}/records/${G.g1}`));
o['3 agent runs alt, no share'] = full(await run('a', G.g1, 'alt', 'Open'));
o['4 agent runs alt, own dept'] = full(await run('a', G.g1, 'alt', 'Open', { shares: [{ department_id: A, access: 'full' }] })); o['4 state'] = await st(G.g1);
const r5 = await run('a', G.g1, 'alt', 'Open', { shares: [{ department_id: B, access: 'full' }] }); o['5 agent runs alt, share Dept B full'] = full(r5) + ' ' + (r5.s >= 400 ? '' : JSON.stringify(r5.j?.data || '').slice(0, 200));
await sleep(3000); o['5 state'] = await st(G.g1); o['5 shares (admin read)'] = (await api('o', 'GET', `desk:/desk/tickets/${G.g1}/shares`)).t.slice(0, 300);
o['5 agent GET g1 after (left state)'] = full(await api('a', 'GET', `desk:/modules/${X.TK}/records/${G.g1}`));
const r6 = await run('a', G.g3, 'alt', 'Open', { shares: [{ department_id: B, access: 'read_only' }] }); o['6 agent runs alt g3, Dept B read_only'] = full(r6); await sleep(2500); o['6 state'] = await st(G.g3); o['6 shares'] = (await api('o', 'GET', `desk:/desk/tickets/${G.g3}/shares`)).t.slice(0, 300);
o['7 agent plain Share on g2 (owner of alt)'] = full(await api('a', 'PUT', `desk:/desk/tickets/${G.g2}/shares`, { shares: [{ department_id: B, access: 'read_only' }] }));
o['7 g2 shares'] = (await api('o', 'GET', `desk:/desk/tickets/${G.g2}/shares`)).t.slice(0, 200);
o['8 agent runs go on g2 (not owner)'] = full(await run('a', G.g2, 'go', 'Open')); o['8 g2 state'] = await st(G.g2);
o['9 agent GET g4 (no owner role)'] = full(await api('a', 'GET', `desk:/modules/${X.TK}/records/${G.g4}`));
o.G = G; fs.writeFileSync(RUN + 'out/t2754.json', JSON.stringify(o, null, 1)); return o;
