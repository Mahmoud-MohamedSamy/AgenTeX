// E2E-2 (due + 10 min, Status Open -> Task + Webhook) and E2E-5 (webhook 500 -> fix receiver -> next ticket).
const W = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid; const OUT = '../a4/e2e25.json';
const S = {}; const save = () => fs.writeFileSync(OUT, JSON.stringify(S, null, 1));
const C = (f, v) => ({ kind: 'Comparison', field: f, operator: 'Equal', negate: false, value: { kind: 'string', stringValue: v } });
const disp = async (id, rid) => arr2((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).filter(e => e.ruleId === rid).map(e => ({ outcome: e.outcome, err: e.errorMessage, d: (e.dispatches || []).map(d => ({ type: d.actionType || d.type, st: d.status, attempts: d.attempts ?? d.attemptCount, err: String(d.lastError || d.error || '').slice(0, 120), next: d.nextAttemptAt || d.next_attempt_at })) }));
// receiver for E2E-5: new webhook.site token answering 500
const nt = await fetch('https://webhook.site/token', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ default_status: 500, default_content: 'qa down', default_content_type: 'text/plain' }) }).then(r => r.json());
S.w5 = nt.uuid; save();
// E2E-2
const due = new Date(Date.now() + 3 * 60e3).toISOString();
const r2 = await mkRule('E2E2', { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: 600, offsetMode: 'wall_clock' }, [{ type: 'Task', taskTitle: 'QA AO WF E2E2 follow up', taskStatus: 'Not Started', taskPriority: 'Normal' }, { type: 'Webhook', method: 'POST', url: 'https://webhook.site/' + W + '/qa-ao-wf-e2e2', bodyTemplate: '{"subject":"${subject}","status":"${status}"}', headers: {}, timeoutSeconds: 10 }], { criteria: C('status', 'Open') });
const tOpen = await mkTicket('E2E2', { due_date: due }, 'left open'); const tClosed = await mkTicket('E2E2', { due_date: due }, 'closed early');
await sleep(4000); S.closeEarly = await patchTicket(tClosed.id, { status: 'Closed' });
S.e2 = { rule: r2.id, rs: r2.s + (r2.err || ''), open: tOpen.id, closed: tClosed.id, due, expectFire: new Date(Date.parse(due) + 600e3).toISOString() }; save();
// E2E-5
const r5 = await mkRule('E2E5', { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: 'https://webhook.site/' + S.w5 + '/qa-ao-wf-e2e5', bodyTemplate: '{"subject":"${subject}"}', headers: {}, timeoutSeconds: 10 }]);
const t5a = await mkTicket('E2E5', {}, 'receiver down'); S.e5 = { rule: r5.id, rs: r5.s + (r5.err || ''), a: t5a.id, t0: new Date().toISOString(), trace: [] }; save();
for (let i = 0; i < 24; i++) { await sleep(30000); const d = await disp(t5a.id, r5.id); S.e5.trace.push({ at: new Date().toISOString().slice(11, 19), d }); save();
  const st = d[0]?.d?.[0]?.st || ''; if (/Failed|Dead|Exhaust|Cancel/i.test(st) && !/Retry/i.test(st)) break; }
S.e5.firstFinal = await disp(t5a.id, r5.id);
await fetch('https://webhook.site/token/' + S.w5, { method: 'PUT', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ default_status: 200, default_content: 'ok', default_content_type: 'text/plain' }) }).then(r => S.e5.fixReceiver = r.status);
const t5b = await mkTicket('E2E5', {}, 'receiver fixed'); S.e5.b = t5b.id; await sleep(30000);
S.e5.second = await disp(t5b.id, r5.id);
S.e5.ruleActive = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).find(x => x.id === r5.id)?.isActive;
const ga = await getTicket(t5a.id); S.e5.ticketA = { status: ga.status, subjectOk: /receiver down/.test(ga.subject) }; S.e5.patchA = await patchTicket(t5a.id, { priority: 'low' });
const hits = await fetch('https://webhook.site/token/' + S.w5 + '/requests?sorting=newest&per_page=50').then(r => r.json()).catch(() => ({}));
S.e5.receiverHits = (hits.data || []).map(x => JSON.parse(x.content || '{}').subject + ' @' + String(x.created_at).slice(11, 19));
save();
// E2E-2 result (wait until expected fire + 3 min)
while (Date.now() < Date.parse(S.e2.expectFire) + 180e3) await sleep(30000);
S.e2.open_d = await disp(tOpen.id, r2.id); S.e2.closed_d = await disp(tClosed.id, r2.id);
const h2 = await fetch('https://webhook.site/token/' + W + '/requests?sorting=newest&per_page=50').then(r => r.json()).catch(() => ({}));
S.e2.webhooks = (h2.data || []).filter(x => /qa-ao-wf-e2e2/.test(x.url || '')).map(x => x.content + ' @' + String(x.created_at).slice(11, 19));
save(); log('done');
