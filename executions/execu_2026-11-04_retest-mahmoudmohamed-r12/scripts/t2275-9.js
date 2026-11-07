const M = require("./p2275.js"); const Z = M({api, X, sleep, arr, ledger, log}); const o = {}; const E = { api, X, sleep, arr }; const { U, A, cond } = Z;
const s = v => ({ kind: 'string', stringValue: v }); const sm = (f, op, v) => ({ kind: 'StringMatch', field: f, operator: op, stringValue: v, caseInsensitive: false });
const and = (...ops) => ({ kind: 'Logical', operator: 'And', operands: ops });
const wf = async (name, trig, criteria, actions) => { const r = await api('o', 'POST', 'desk:/workflow/rules', { moduleId: X.TK, layoutId: '', name: 'QA RT12 2275 ' + name, description: 'QA retest r12 - safe to delete', mode: 'Recurring', isActive: true, trigger: { kind: trig }, criteria, actions }); const id = r.j?.data?.id; if (id) ledger(`NDC-2275: workflow rule "QA RT12 2275 ${name}" ${id}`); return [X.err(r), id, r.s >= 400 ? r.t.slice(0, 400) : ''];};
o.wf1 = await wf('WF EO2', 'RecordCreated', and(sm('subject', 'Contains', 'DA1 EO2'), { kind: 'Comparison', field: 'owner', operator: 'Equal', value: s(U.A1) }), [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { description: s('eo2-workflow-saw-owner-A1') } }]);
o.wf2 = await wf('WF EO5', 'RecordCreated', sm('subject', 'Contains', 'DA3 EO5'), [{ type: 'OwnerAssignment', order: 0, delaySeconds: 0, ownerTargetKind: 'SpecificUser', ownerValue: U.A1 }]);
o.wf3 = await wf('WF EO3', 'RecordUpdated', sm('subject', 'Contains', 'SEQ EO3'), [{ type: 'OwnerAssignment', order: 0, delaySeconds: 0, ownerTargetKind: 'SpecificUser', ownerValue: U.A2 }]);
const da3 = await Z.mkRule({ type: 'direct', department_id: null, name: 'DA3', targets: [{ criteria: { conditions: [cond('subject', 'contains', 'QA RT12 2275 DA3')], pattern: null }, coming_to_department_id: A, move_to_department_id: null, assign: { kind: 'agent', user_id: U.A3, team_id: null } }] }); o.da3 = X.err(da3);
await sleep(3000);
// EO-2
const t1 = await Z.tk('DA1 EO2'); await sleep(15000); const f1 = await X.fields(t1); o.EO2 = { owner: Z.N[f1.owner], description: f1.description || null };
// EO-5 + control
const nBefore = arr((await api('a', 'GET', 'desk:/notifications?limit=50')).j?.data?.items || (await api('a', 'GET', 'desk:/notifications?limit=50')).j?.data).map(n => n.id);
const t2 = await Z.tk('DA3 EO5'); const t3 = await Z.tk('DA3 control'); await sleep(20000);
o.EO5 = { owner: (await Z.owner(t2)).owner, hist: await M.hist(Z, E, t2), auto: await M.auto(Z, E, t2) }; o.control = { owner: (await Z.owner(t3)).owner, auto: await M.auto(Z, E, t3) };
const nr = await api('a', 'GET', 'desk:/notifications?limit=50'); const NL = arr(nr.j?.data?.items || nr.j?.data); o.notifRaw = nr.s + ' keys=' + Object.keys(NL[0] || {}).join(',');
o.A3newNotifs = NL.filter(n => !nBefore.includes(n.id)).map(n => [n.title || n.type, JSON.stringify(n.data || n.payload || n.metadata || {}).slice(0, 200), n.created_at].join(' | '));
o.ids = { t1, t2, t3 };
// EO-3
const r3 = await M.rrRun(Z, E, 'SEQ EO3', 'high', 20000); await sleep(5000); o.EO3 = { owner: (await Z.owner(r3.id)).owner, auto: await M.auto(Z, E, r3.id), hist: await M.hist(Z, E, r3.id) };
return o;
