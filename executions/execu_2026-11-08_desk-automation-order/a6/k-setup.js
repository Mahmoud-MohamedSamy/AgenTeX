// A6 customer rows K3, K4, K5, E2E-2 (user OK 13 Nov). Changes, all undone by k-clean.js:
// Customer Happiness ON scoped to Customer Support (original in k-orig.json); contact "QA BP K customer" (+qaao) + portal invite;
// blueprint "QA BP K"; workflow rule "QA BP K K5 rating mail"; 6 tickets "QA BP K ...".
const n = require('./bp/ndc'); const { call, sleep, CS } = n; const fs = require('fs'); const crypto = require('crypto');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', CONTACTS = '43004ce2-577f-4eda-b00a-0750fe40c3d4', HC = 'e74f2abb-e28d-400e-908c-f2c54862e389';
const G = 'mahmoud.mmohamedsamy+qaao@gmail.com';
const M = { tickets: {}, at: new Date().toISOString() }; const save = () => fs.writeFileSync(__dirname + '/k-made.json', JSON.stringify(M, null, 1));
const E = r => r.status + (r.status >= 300 ? ' ' + (r.code || '') + ' ' + String(r.msg || '').slice(0, 200) + ' ' + JSON.stringify(r.json?.error?.details || '').slice(0, 300) : '');
const v = x => ({ kind: 'string', value: String(x) });
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b, during = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during, after: { actions: [] } });
const val = x => !x ? undefined : x.kind === 'array' ? (x.items || []).map(val) : x.value;
const fld = async t => Object.fromEntries(((await call('owner', 'GET', `/modules/${TK}/records/${t}`)).json?.data?.data || []).map(x => [x.field, val(x.value)]));
const bstate = async t => ((await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`)).json?.data?.states || [])[0] || null;
async function waitIn(t) { for (let i = 0; i < 15; i++) { const s = await bstate(t); if (s) return s; await sleep(2000); } return null; }
const run = (t, tid, from, extra = {}) => call('owner', 'POST', `/desk/tickets/${t}/blueprint-transitions/${tid}`, { run_id: crypto.randomUUID(), expected_state_id: from, fields: {}, ...extra });
(async () => {
  // 1 happiness
  const hs = (await call('owner', 'GET', '/desk/happiness/settings')).json.data; fs.writeFileSync(__dirname + '/k-orig.json', JSON.stringify({ happiness: hs }, null, 1));
  const ro = ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured', 'supervisors_max', 'closed_email_subject_max', 'closed_email_body_max', 'resend_after_hours_max', 'option_icons', 'option_label_max', 'option_text_max', 'option_image_max_bytes'];
  const hb = { ...hs, is_enabled: true, department_scope_enabled: true, department_ids: [CS] }; for (const k of ro) delete hb[k];
  M.happiness = E(await call('owner', 'PUT', '/desk/happiness/settings', hb)); M.happinessTrigger = hs.trigger; M.reopenOnRating = hs.reopen_on_rating; save();
  // 2 contact + portal invite
  const c = await call('owner', 'POST', `/modules/${CONTACTS}/records`, { data: [{ field: 'last_name', value: v('QA BP K customer') }, { field: 'email', value: v(G) }] });
  M.contact = c.json?.data?.id; M.contactRes = E(c); save();
  M.invite = E(await call('owner', 'POST', `/help-centers/${HC}/invitations/contacts`, { contact_ids: [M.contact] })); save();
  // 3 blueprint
  const def = { name: 'QA BP K', description: 'QA A6 K3-K5 + E2E-2 customer rows - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP K ' },
    states: [st('Open', { onRatingTransitionId: 'rgood', onRatingValues: ['good'] }), st('On Hold', { onReplyTransitionId: 'back', autoTransitionId: 'autoclose', autoTransitionAfterMinutes: 2880 }), st('Escalated', { onRatingTransitionId: 'rany' }), st('Closed', { isTerminal: true })],
    transitions: [tr('hold', 'Open', 'On Hold', { deskItems: [{ kind: 'reply', mandatory: true }], itemOrder: ['desk:reply'] }), tr('esc', 'Open', 'Escalated'), tr('back', 'On Hold', 'Open'), tr('autoclose', 'On Hold', 'Closed'), tr('rgood', 'Open', 'Escalated'), tr('rany', 'Escalated', 'Closed')] };
  const b = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); M.blueprint = b.json?.data?.id; M.bpRes = E(b); save(); if (!M.blueprint) throw new Error('bp ' + M.bpRes);
  // 4 workflow rule: rating mail on create for K5 tickets
  const rule = await call('owner', 'POST', '/workflow/rules', { moduleId: TK, departmentIds: [CS], name: 'QA BP K K5 rating mail', isActive: true, mode: 'Recurring', trigger: { kind: 'RecordCreated' },
    criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA BP K K5', caseInsensitive: false }, actions: [{ order: 0, delaySeconds: 0, type: 'SendHappinessEmail' }] });
  M.rule = rule.json?.data?.id; M.ruleRes = E(rule); save();
  // 5 tickets
  const mk = async (key, subj) => { const r = await call('owner', 'POST', `/modules/${TK}/records`, { data: Object.entries({ subject: 'QA BP K ' + subj, status: 'Open', department: CS, contact_id: M.contact, email: G, channel: 'email' }).map(([f, x]) => ({ field: f, value: v(x) })) });
    const id = r.json?.data?.id; M.tickets[key] = { id, res: E(r) }; save(); return id; };
  const K = { K3a: 'K3a please send documents - reply to this email from Gmail', K3b: 'K3b please send documents - reply in the Help Center', K4: 'K4 escalated - reply to this email from Gmail', K5a: 'K5a rate this ticket Good', K5b: 'K5b rate this ticket Bad', K5c: 'K5c rate this ticket Bad' };
  for (const [k, s] of Object.entries(K)) { await mk(k, s); await sleep(1500); }
  for (const k of Object.keys(K)) { const t = M.tickets[k]; t.entered = (await waitIn(t.id))?.activeStates || null; const f = await fld(t.id); t.num = f.ticket_number; t.subject = f.subject; }
  save();
  // 6 moves + agent mails
  const ask = '<p>QA BP K: please send us your documents by replying to this message.</p>';
  M.tickets.K3a.holdWithoutReply = E(await run(M.tickets.K3a.id, 'hold', 'Open'));
  for (const k of ['K3a', 'K3b']) M.tickets[k].hold = E(await run(M.tickets[k].id, 'hold', 'Open', { reply: { to: [G], cc: [], bcc: [], content: ask, template_id: null, from_address_id: null } }));
  M.tickets.K4.esc = E(await run(M.tickets.K4.id, 'esc', 'Open'));
  M.tickets.K4.reply = E(await call('owner', 'POST', `/desk/tickets/${M.tickets.K4.id}/replies`, { mode: 'reply', to: [G], subject: 'QA BP K K4: please reply to this email', body_html: '<p>QA BP K K4: please reply to this email from Gmail.</p>' }));
  M.tickets.K5c.esc = E(await run(M.tickets.K5c.id, 'esc', 'Open'));
  await sleep(15000);
  for (const k of Object.keys(K)) { const t = M.tickets[k]; t.state = (await bstate(t.id))?.activeStates; t.status = (await fld(t.id)).status; }
  M.ruleExec = []; for (const k of ['K5a', 'K5b', 'K5c']) { const x = await call('owner', 'GET', `/workflow/executions?recordId=${M.tickets[k].id}`); const a = x.json?.data; const arr = Array.isArray(a) ? a : (a?.items || a?.data || []); M.ruleExec.push(k + ': ' + arr.map(e => (e.outcome || e.status) + ' ' + JSON.stringify((e.dispatches || e.actions || []).map(d => (d.actionType || d.type) + ':' + d.status))).join(' | ')); }
  save();
  console.log(JSON.stringify(M, null, 1).replace(/mahmoud\.mmohamedsamy/g, 'G'));
})().catch(e => { M.ERROR = String(e.stack || e).slice(0, 500); save(); console.log('ERROR', M.ERROR); });
