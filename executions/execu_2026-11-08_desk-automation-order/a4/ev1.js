// Evidence for the Plane batch (12 Nov, user: "make the images then file them all"). Rules guarded by subject "QA AO WF EVn ".
// D-05 placeholders, D-07 close by workflow, D-08 header injection, D-12 happiness while off, D-14 Create Record, D-13 key order.
const S = v => ({ kind: 'string', stringValue: v });
const TOK = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid; const WH = 'https://webhook.site/' + TOK;
const CALLS = 'f7e488b5-0232-42fd-811c-1f24356af653', CALLS_LAYOUT = 'fdb13486-6c74-4a80-8401-c9a25255dfe1';
const R = {};
const r5 = await mkRule('EV5', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { description: S('R[${recordId}] M[${moduleId}] S[${subject}]') } }]);
const r7 = await mkRule('EV7', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { status: S('Closed') } }]);
const r8 = await mkRule('EV8', { kind: 'RecordCreated' }, [{ type: 'Webhook', method: 'POST', url: WH, bodyTemplate: '{"qa":"EV8"}', headers: { 'X-QA': 'a\r\nInjected: 1' }, timeoutSeconds: 10 }]);
const r12 = await mkRule('EV12', { kind: 'RecordCreated' }, [{ type: 'SendHappinessEmail' }]);
const r14 = await mkRule('EV14', { kind: 'RecordCreated' }, [{ type: 'CreateRecord', targetModuleId: CALLS, targetLayoutId: CALLS_LAYOUT, fieldMappings: { call_start_time: { kind: 'timestamp', timestampValue: new Date(Date.now() + 86400000).toISOString() } } }]);
R.rules = { r5: r5.s + (r5.err || ''), r7: r7.s + (r7.err || ''), r8: r8.s + (r8.err || ''), r12: r12.s + (r12.err || ''), r14: r14.s + (r14.err || '') };
const hs = await api('GET', '/desk/happiness/settings'); R.happiness = JSON.stringify(hs.j?.data || hs.j).slice(0, 200);
const t = {};
for (const k of ['EV5', 'EV7', 'EV8', 'EV12', 'EV14']) { const x = await mkTicket(k); t[k] = x.id; R['t_' + k] = x.s; }
await sleep(20000);
for (const k of Object.keys(t)) R['ex_' + k] = await waitExec(t[k], 1, 45);
const g5 = await getTicket(t.EV5); R.EV5 = { id: t.EV5, number: g5.ticket_number, description: g5.description };
const g7 = await getTicket(t.EV7); R.EV7 = { id: t.EV7, number: g7.ticket_number, status: g7.status };
R.EV12 = { id: t.EV12, number: (await getTicket(t.EV12)).ticket_number };
await sleep(10000);
const wr = await fetch('https://webhook.site/token/' + TOK + '/requests?sorting=newest&per_page=10').then(r => r.json()).catch(e => ({ err: String(e) }));
const hit = (wr.data || []).find(x => /EV8/.test(x.content || ''));
R.EV8 = hit ? { uuid: hit.uuid, headers: Object.fromEntries(Object.entries(hit.headers || {}).filter(([k]) => /x-qa|injected|host|content-type|user-agent/i.test(k))), at: hit.created_at } : { none: true, n: (wr.data || []).length };
const calls = arr((await api('GET', `/modules/${CALLS}/records?take=20`)).j?.data);
const c = calls.find(x => { const at = x.createdAt || x.created_at; return at && Date.now() - new Date(at) < 10 * 60000; });
if (c) { track('record:' + CALLS, c.id, 'EV14'); R.EV14 = { id: c.id, keys: JSON.stringify(c).slice(0, 600) }; } else R.EV14 = { none: true, n: calls.length };
// D-13: same field value, keys in two orders
const bad = await api('POST', `/modules/${T}/records`, { data: [{ field: 'subject', value: { value: 'QA AO WF EV13 order', kind: 'string' } }, { field: 'department', value: { kind: 'string', value: D } }, { field: 'status', value: { kind: 'string', value: 'Open' } }] });
const good = await api('POST', `/modules/${T}/records`, { data: [{ field: 'subject', value: { kind: 'string', value: 'QA AO WF EV13 order' } }, { field: 'department', value: { kind: 'string', value: D } }, { field: 'status', value: { kind: 'string', value: 'Open' } }] });
if (good.j?.data?.id) track('ticket', good.j.data.id, 'EV13'); if (bad.j?.data?.id) track('ticket', bad.j.data.id, 'EV13');
R.EV13 = { bad: bad.s + ' ' + String(bad.t).slice(0, 300), good: good.s + ' ' + (good.j?.data?.id ? 'created' : String(good.t).slice(0, 200)) };
fs.writeFileSync('../a4/ev1-out.json', JSON.stringify({ t, R }, null, 1));
log(JSON.stringify(R, null, 1).slice(0, 6000));
