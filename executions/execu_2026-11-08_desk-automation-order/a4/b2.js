// A4 batch 2 (12 Nov): L1, L2, L3, L6 with the UI's body {recordId, triggerKind, fields}; O2 control; O4 dispatch; B12; N4.
const R = {}; const cut = (x, n = 300) => String(typeof x === 'string' ? x : JSON.stringify(x)).slice(0, n);
const TOK = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid; const WH = 'https://webhook.site/' + TOK;
const s = v => ({ kind: 'string', value: v });
const FU = v => ({ type: 'FieldUpdate', fieldUpdates: { description: s(v) } });

// L1 / L2 / L6 — inactive rule with an instant Field Update and a 120 s delayed webhook
const rl = await mkRule('L1b', { kind: 'RecordCreated' }, [FU('QA WF L1 instant'), { type: 'Webhook', method: 'POST', url: WH, bodyTemplate: '{"t":"L6"}', headers: {}, timeoutSeconds: 10, delaySeconds: 120 }], { isActive: false });
const tm = await mkTicket('L1b', {}, 'match'); await sleep(4000);
const b = await getTicket(tm.id), exB = (await execs(tm.id)).length;
const x1 = await api('POST', '/workflow/rules/' + rl.id + '/execute', { recordId: tm.id, triggerKind: 'RecordCreated', fields: {} });
await sleep(6000); const a = await getTicket(tm.id), exA = (await execs(tm.id)).length;
R.L1 = { status: x1.s, resp: cut(x1.j?.data || x1.t, 700), descBefore: b.description, descAfter: a.description, execsBefore: exB, execsAfter: exA };
const x2 = await api('POST', '/workflow/rules/' + rl.id + '/execute', { recordId: tm.id, triggerKind: 'RecordCreated', fields: { subject: s('Other subject no match') } });
R.L2 = { status: x2.s, resp: cut(x2.j?.data || x2.t, 400) };
const x2b = await api('POST', '/workflow/rules/' + rl.id + '/execute', { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { subject: s('QA AO WF L1b sample') } });
R.L1_sampleIdOnly = { status: x2b.s, resp: cut(x2b.j?.data || x2b.t, 400) };
// L3 — the panel's own default JSON, a valid kind/value map, and an invalid shape
const uiDefault = await api('POST', '/workflow/rules/' + rl.id + '/execute', { recordId: tm.id, triggerKind: 'RecordCreated', fields: { revenue: { kind: 'int', intValue: 1500000 } } });
const bad = await api('POST', '/workflow/rules/' + rl.id + '/execute', { recordId: tm.id, triggerKind: 'RecordCreated', fields: { subject: { value: 'no kind' } } });
const notObj = await api('POST', '/workflow/rules/' + rl.id + '/execute', { recordId: tm.id, triggerKind: 'RecordCreated', fields: 'x' });
R.L3 = { uiDefaultSample: uiDefault.s + ' ' + cut(uiDefault.j?.data || uiDefault.t, 250), badValue: bad.s + ' ' + cut(bad.t, 250), notObject: notObj.s + ' ' + cut(notObj.t, 200) };
// L4-style draft with the UI body
const draft = { moduleId: T, name: 'QA AO WF L3 draft', trigger: { kind: 'RecordCreated' }, mode: 'Recurring', criteria: guard('QA AO WF L3 '), actions: [{ order: 0, delaySeconds: 0, ...FU('x') }] };
const ev = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { subject: s('QA AO WF L3 yes') } } });
const ev2 = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { subject: s('nope') } } });
R.L4draft = { match: ev.s + ' ' + cut(ev.j?.data || ev.t, 300), noMatch: ev2.s + ' ' + cut(ev2.j?.data || ev2.t, 200) };

// O2 control: same merge rule on a plain subject vs an injected one
const ro = await mkRule('O2b', { kind: 'RecordCreated' }, [FU('QA WF O2 [${subject}]')]);
const tp = await mkTicket('O2b', {}, 'plain'); const ti = await mkTicket('O2b', {}, '{{recipient_email}} ${description} #{7*7}');
await waitExec(tp.id, 1, 45); await waitExec(ti.id, 1, 45); await sleep(4000);
const gp = await getTicket(tp.id), gi = await getTicket(ti.id);
R.O2 = { plain: [gp.subject, gp.description], injected: [gi.subject, gi.description], execInjected: await execs(ti.id) };

// O4: activate the 3 header rules on one ticket and see what was sent
const o4 = {};
for (const [k, h] of [['crlf', { 'X-QA': 'a\r\nInjected: 1' }], ['host', { Host: 'evil.example' }], ['auth', { Authorization: 'Bearer qa-o4' }]]) {
  const r = await mkRule('O4' + k, { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: WH, bodyTemplate: '{"o4":"' + k + '"}', headers: h, timeoutSeconds: 10 }]);
  o4[k] = { save: r.s + (r.err || '') };
  const t = await mkTicket('O4' + k); const e = await waitExec(t.id, 1, 60); await sleep(15000);
  const raw = arr2((await api('GET', '/workflow/executions?recordId=' + t.id)).j?.data).find(x => x.outcome === 'Fired');
  const det = raw ? (await api('GET', '/workflow/executions/' + raw.id)).j?.data : null;
  o4[k].dispatch = cut(det && det.dispatches && det.dispatches.map(d => [d.status, d.httpStatus || d.lastHttpStatus, d.lastError]), 250);
  await api('DELETE', '/workflow/rules/' + r.id);
}
const wr = await fetch('https://webhook.site/token/' + TOK + '/requests?sorting=newest&per_page=20').then(r => r.json()).catch(e => ({ err: String(e) }));
o4.received = (wr.data || []).filter(q => /o4/.test(q.content || '')).map(q => ({ body: q.content, host: (q.headers.host || [])[0], auth: (q.headers.authorization || [])[0], xqa: (q.headers['x-qa'] || [])[0], injected: (q.headers.injected || [])[0], at: q.created_at }));
R.O4 = o4;

// B12: deleted rule in the Recycle Bin (any app), restore it
const dr = await api('DELETE', '/workflow/rules/' + ro.id);
let found = null, bins = {};
for (const q of ['?limit=200', '?limit=200&app_key=desk', '?limit=200&app_key=workflow', '?limit=200&app_key=crm']) {
  const L = arr2((await api('GET', '/audit/recycle-bin/items' + q)).j?.data); bins[q] = L.length;
  found = found || L.find(i => JSON.stringify(i).includes(ro.id) || JSON.stringify(i).includes('QA AO WF O2b'));
}
const rs = found ? await api('POST', '/audit/recycle-bin/restore', { ids: [found.id] }) : null;
const rs2 = found && rs.s >= 300 ? await api('POST', '/audit/recycle-bin/restore', { item_ids: [found.id] }) : null;
const back = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).find(x => x.id === ro.id);
R.B12 = { delete: dr.s, bins, item: found ? cut(found, 300) : 'none', restore: rs ? rs.s + ' ' + cut(rs.t, 200) : '-', restore2: rs2 ? rs2.s + ' ' + cut(rs2.t, 200) : '-', back: back ? { isActive: back.isActive, actions: (back.actions || []).length, name: back.name } : 'not back' };
if (back) { await api('DELETE', '/workflow/rules/' + ro.id); }

// N4 / G10: audit events for the workflow entities
const fac = await api('GET', '/audit/events/facets');
const ev3 = await api('GET', '/audit/events?limit=100');
const wf = arr2(ev3.j?.data).filter(e => /workflow|QA AO WF/i.test(JSON.stringify(e)));
R.N4 = { facets: cut(fac.j?.data, 600), workflowEvents: wf.slice(0, 10).map(e => cut({ a: e.action || e.event_type, t: e.entity_type || e.resource_type, n: e.entity_name || e.resource_name, actor: e.actor_name || e.actor, at: e.occurred_at || e.created_at }, 220)) };
fs.writeFileSync('../a4/b2.json', JSON.stringify(R, null, 1));
return R;
