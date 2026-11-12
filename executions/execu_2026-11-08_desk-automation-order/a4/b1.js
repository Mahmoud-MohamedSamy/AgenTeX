// A4 batch 1 (12 Nov): API rows H14, K6, K7, K8, L1, L2, L3, L6, M4, M7, M8, B12, G10/N4, N1, O2, O4, O6. Run: bash a4/run.sh b1.js
const R = {}; const cut = (x, n = 260) => String(typeof x === 'string' ? x : JSON.stringify(x)).slice(0, n);
const WH = 'https://webhook.site/' + JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid;
const s = v => ({ kind: 'string', value: v });
const FU = (v) => ({ type: 'FieldUpdate', fieldUpdates: { description: s(v) } });

// H14 + O2: API-created ticket fires an On Create rule; merge value rendered once
const ro2 = await mkRule('O2', { kind: 'RecordCreated' }, [FU('QA WF O2 [${subject}]')]);
const to2 = await mkTicket('O2', {}, '{{recipient_email}} ${description} #{7*7}');
const eo2 = await waitExec(to2.id, 1, 45); await sleep(3000); const g2 = await getTicket(to2.id);
R.H14 = { rule: ro2.s + (ro2.err || ''), ticket: to2.s, execs: eo2 };
R.O2 = { subject: g2.subject, description: g2.description };

// K6 / K7 / K8: saved action used by 2 rules
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA AO WF K6 action', description: null, isActive: true, action: { type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { description: s('QA WF K6 saved') } } });
const aid = sa.j?.data?.id; if (aid) track('action', aid, 'K6');
const k1 = await mkRule('K6a', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', standaloneActionId: aid }]);
const k2 = await mkRule('K6b', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', standaloneActionId: aid }]);
const use = await api('GET', '/workflow/actions/' + aid + '/usage');
R.K6 = { create: sa.s, rules: [k1.s + (k1.err || ''), k2.s + (k2.err || '')], usage: use.s + ' ' + cut(use.j?.data, 400) };
const inact = await api('PATCH', '/workflow/actions/' + aid, { isActive: false });
const ga = (await api('GET', '/workflow/actions/' + aid)).j?.data;
R.K8 = { patch: inact.s, isActive: ga && ga.isActive };
const del = await api('DELETE', '/workflow/actions/' + aid);
const after = await api('GET', '/workflow/actions/' + aid);
const rk = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).find(x => x.id === k1.id);
R.K7 = { deleteInUse: del.s + ' ' + cut(del.t, 220), getAfter: after.s, ruleActionAfter: cut(rk && rk.actions, 300) };

// L1 / L2 / L6: Test rule against a matching and non-matching ticket, with a delayed action
const rl = await mkRule('L1', { kind: 'RecordCreated' }, [FU('QA WF L1 instant'), { type: 'Webhook', method: 'POST', url: WH, bodyTemplate: '{"t":"L6"}', headers: {}, timeoutSeconds: 10, delaySeconds: 120 }], { isActive: false });
const tm = await mkTicket('L1', {}, 'match'); await sleep(4000);
const before = await getTicket(tm.id); const exB = (await execs(tm.id)).length;
const x1 = await api('POST', '/workflow/rules/' + rl.id + '/execute', { sampleRecordId: tm.id, triggerKind: 'RecordCreated' });
await sleep(5000); const aft = await getTicket(tm.id); const exA = (await execs(tm.id)).length;
R.L1 = { rule: rl.s + (rl.err || ''), status: x1.s, resp: cut(x1.j?.data || x1.t, 500), descBefore: before.description, descAfter: aft.description, execsBefore: exB, execsAfter: exA };
const tn = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: 'QA AO WF other L2 nomatch', status: 'Open', department: D, email: QA_EMAIL, channel: 'email' }).map(([k, v]) => ({ field: k, value: enc(v) })) });
if (tn.j?.data?.id) track('ticket', tn.j.data.id, 'L2');
const x2 = await api('POST', '/workflow/rules/' + rl.id + '/execute', { sampleRecordId: tn.j?.data?.id, triggerKind: 'RecordCreated' });
R.L2 = { status: x2.s, resp: cut(x2.j?.data || x2.t, 300) };
// L3: evaluate with field values, valid and invalid
const draft = { moduleId: T, name: 'QA AO WF L3 draft', trigger: { kind: 'RecordCreated' }, mode: 'Recurring', criteria: guard('QA AO WF L3 '), actions: [{ order: 0, delaySeconds: 0, ...FU('x') }] };
const e1 = await api('POST', '/workflow/rules/evaluate', { rule: draft, fieldValues: [{ field: 'subject', value: s('QA AO WF L3 yes') }] });
const e2 = await api('POST', '/workflow/rules/evaluate', { rule: draft, fieldValues: [{ field: 'subject', value: { value: 'no kind' } }] });
const e3 = await api('POST', '/workflow/rules/evaluate', { rule: draft, fieldValues: 'not json' });
R.L3 = { valid: e1.s + ' ' + cut(e1.j?.data || e1.t, 300), badValue: e2.s + ' ' + cut(e2.t, 200), notArray: e3.s + ' ' + cut(e3.t, 200) };

// M4 / M7: execution detail and paging
const exList = await execs(to2.id); const raw = arr2((await api('GET', '/workflow/executions?recordId=' + to2.id)).j?.data);
const det = raw[0] ? await api('GET', '/workflow/executions/' + raw[0].id) : { s: 'none' };
R.M4 = { status: det.s, keys: det.j?.data ? Object.keys(det.j.data).join(',') : cut(det.t), dispatch: cut(det.j?.data && (det.j.data.dispatches || det.j.data.actions), 300) };
const p1 = await api('GET', '/workflow/executions?take=5'), p2 = await api('GET', '/workflow/executions?take=5&skip=5'), p3 = await api('GET', '/workflow/executions?take=5&page=2');
const ids = r => arr2(r.j?.data).map(x => x.id.slice(0, 6)).join(',');
R.M7 = { take5: p1.s + ' ' + ids(p1), skip5: p2.s + ' ' + ids(p2), page2: p3.s + ' ' + ids(p3), meta: cut(p1.j?.meta || p1.j?.pagination, 200) };

// M8 + B12: delete the O2 rule, its run still readable, then restore from the Recycle Bin
const dr = await api('DELETE', '/workflow/rules/' + ro2.id);
const m8 = arr2((await api('GET', '/workflow/executions?recordId=' + to2.id)).j?.data);
R.M8 = { delete: dr.s, runsAfter: m8.map(e => (e.ruleName || e.ruleId) + ':' + (e.outcome || e.status)) };
const bin = arr2((await api('GET', '/audit/recycle-bin/items?limit=100&app_key=workflow')).j?.data);
const item = bin.find(i => JSON.stringify(i).includes(ro2.id));
const rs = item ? await api('POST', '/audit/recycle-bin/restore', { ids: [item.id] }) : { s: 'not in bin', t: cut(bin.slice(0, 2), 300) };
const back = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).find(x => x.id === ro2.id);
R.B12 = { binItem: item ? cut(item, 250) : 'none', restore: rs.s + ' ' + cut(rs.t, 200), back: back ? { isActive: back.isActive, actions: (back.actions || []).length } : 'not back' };

// G10 / N4: audit events for workflow
const au = await api('GET', '/audit/events?app_key=workflow&limit=40');
R.N4 = { status: au.s, events: arr2(au.j?.data).slice(0, 12).map(e => [e.action || e.event_type || e.type, e.entity_type || e.resource_type, (e.entity_name || e.resource_name || '').slice(0, 30), e.actor_name || e.actor_id || e.user_id ? 'actor' : 'no-actor'].join(' | ')) };

// N1: ticket history after a workflow field update
const h = await api('GET', '/desk/tickets/' + to2.id + '/history'); const a = await api('GET', '/desk/tickets/' + to2.id + '/activity');
R.N1 = { history: h.s + ' ' + cut(h.j?.data, 500), activity: a.s + ' ' + cut(arr2(a.j?.data).slice(0, 4), 500) };

// O4: header injection
const o4a = await mkRule('O4a', { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: WH, bodyTemplate: '{}', headers: { 'X-QA': 'a\r\nInjected: 1' }, timeoutSeconds: 10 }], { isActive: false });
const o4b = await mkRule('O4b', { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: WH, bodyTemplate: '{}', headers: { Host: 'evil.example' }, timeoutSeconds: 10 }], { isActive: false });
const o4c = await mkRule('O4c', { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: WH, bodyTemplate: '{}', headers: { Authorization: 'Bearer qa' }, timeoutSeconds: 10 }], { isActive: false });
R.O4 = { crlf: o4a.s + ' ' + (o4a.err || ''), host: o4b.s + ' ' + (o4b.err || ''), authorization: o4c.s + ' ' + (o4c.err || '') };

// O6: random ids
const rnd = () => crypto.randomUUID(); const tm6 = async p => { const t0 = Date.now(); const r = await api('GET', p); return r.s + ' ' + (Date.now() - t0) + 'ms ' + cut(r.t, 120); };
R.O6 = { rule: await tm6('/workflow/rules/' + rnd()), action: await tm6('/workflow/actions/' + rnd()), execution: await tm6('/workflow/executions/' + rnd()), knownExecution: raw[0] ? await tm6('/workflow/executions/' + raw[0].id) : '' };
fs.writeFileSync('../a4/b1.json', JSON.stringify(R, null, 1));
return R;
