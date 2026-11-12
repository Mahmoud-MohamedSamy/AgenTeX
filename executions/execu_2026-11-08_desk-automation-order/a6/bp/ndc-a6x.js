// A6 13 Nov, NDC-Staging (Customer Support): D8 share limit, D5 owner suspended, F6 Desk email to the Gmail contact. QA records only; everything reverted in finally.
const n = require('./ndc'); const fs = require('fs'); const { call, sleep, ID, CS, TECH } = n;
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', G = 'mahmoud.mmohamedsamy+qaao@gmail.com'; const R = {}; const T = [], B = []; let TPL = null, suspended = false;
const v = x => ({ kind: 'string', value: String(x) }); const j = r => r.json && r.json.data;
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, ...x });
const tr = (id, a, b, before = {}, after = []) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before, during: {}, after: { actions: after } });
const brief = r => r.status + (r.json && r.json.error ? ' ' + r.json.error.code + ' ' + String(r.json.error.message).slice(0, 140) : '');
const list = x => Array.isArray(x) ? x : (x && (x.items || x.transitions || x.shares || x.data)) || [];
const hist = async t => list(j(await call('owner', 'GET', `/desk/tickets/${t}/history`))).map(h => h.action + (h.field_key ? ':' + h.field_key : '') + (h.summary || h.message || h.note ? ' "' + String(h.summary || h.message || h.note).slice(0, 140) + '"' : ''));
const ticket = async (subject, extra = []) => { const r = await call('owner', 'POST', `/modules/${TK}/records`, { data: [['subject', subject], ['department', CS], ['status', 'Open'], ...extra].map(([f, x]) => ({ field: f, value: v(x) })) }); const id = j(r) && j(r).id; if (id) T.push(id); else throw new Error('ticket ' + brief(r)); return id; };
const ids = r => list(j(r)).map(x => x.transitionId || x.id);
(async () => {
  try {
    const deps = list(j(await call('owner', 'GET', '/desk/departments?take=100'))).filter(d => d.is_active !== false && d.id !== CS && d.id !== TECH);
    R.depsAvailable = deps.length;
    const tp = await call('owner', 'POST', '/desk/email-templates', { name: 'QA BP template', module: 'desk_tickets', notification_type: 'contact', use_case: null, subject: 'QA BP F6 {{ticket.subject}}', body_html: '<p>QA BP F6 email for ticket {{ticket.number}}: {{ticket.subject}}</p>' });
    TPL = j(tp) && j(tp).id; R.template = brief(tp);
    const def = { name: 'QA BP A6 ndc', description: 'QA', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP A6X ' },
      states: [st('Open'), st('Escalated'), st('On Hold'), st('Closed', { isTerminal: true })],
      transitions: [tr('tech', 'Open', 'Escalated', { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [ID.C], teamIds: [] }] }), tr('onlyA', 'Open', 'On Hold', { allowedUserIds: [ID.A] }),
        tr('email', 'Open', 'Closed', {}, TPL ? [{ kind: 'deskEmail', templateId: TPL, owner: true, contact: true, teamIds: [], userIds: [], roleTreeIds: [] }] : []), tr('end', 'Escalated', 'Closed'), tr('end2', 'On Hold', 'Closed')] };
    const bp = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); const BID = j(bp) && j(bp).id; if (BID) B.push(BID); R.bp = brief(bp);
    // D8: ticket outside the blueprint, shared with 10 departments, then included at Open
    const t8 = await ticket('QA BP A6Y share limit'); const ten = deps.slice(0, 10).map(d => ({ department_id: d.id, access: 'read_only' }));
    R.D8_share10 = brief(await call('owner', 'PUT', `/desk/tickets/${t8}/shares`, { shares: ten })); R.D8_sharedCount = ten.length;
    R.D8_include = brief(await call('owner', 'POST', `/desk/blueprints/${BID}/include`, { state_id: 'Open', ticket_ids: [t8] })); await sleep(6000);
    R.D8_shares_after = list(j(await call('owner', 'GET', `/desk/tickets/${t8}/shares`))).length;
    R.D8_history = (await hist(t8)).filter(h => /shar|blueprint/i.test(h)).slice(0, 8);
    R.D8_C_transitions = brief(await call('C', 'GET', `/modules/${TK}/records/${t8}/blueprint-transitions`));
    // D5: owner of 'onlyA' suspended
    const t5 = await ticket('QA BP A6X owner suspended'); await sleep(5000);
    R.D5_before_A = ids(await call('A', 'GET', `/modules/${TK}/records/${t5}/blueprint-transitions`));
    R.D5_suspend = brief(await call('owner', 'PATCH', `/iam/users/${ID.A}`, { status: 'suspended' })); suspended = true; await sleep(3000);
    const g = j(await call('owner', 'GET', `/modules/${TK}/blueprints/${BID}`)) || {}; R.D5_bp_flags = JSON.stringify(g.issues || g.warnings || g.validation || null).slice(0, 300);
    R.D5_resave = brief(await call('owner', 'PUT', `/modules/${TK}/blueprints/${BID}`, { definition: g.definition || def, isActive: true }));
    R.D5_owner_sees = ids(await call('owner', 'GET', `/modules/${TK}/records/${t5}/blueprint-transitions`));
    R.D5_owner_runs_onlyA = brief(await call('owner', 'POST', `/desk/tickets/${t5}/blueprint-transitions/onlyA`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {} }));
    // F6: Desk email after-action to the Gmail contact + owner
    const t6 = await ticket('QA BP A6X email to contact', [['email', G]]); await sleep(5000);
    R.F6_run = brief(await call('owner', 'POST', `/desk/tickets/${t6}/blueprint-transitions/email`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {} })); await sleep(15000);
    const rp = list(j(await call('owner', 'GET', `/desk/tickets/${t6}/replies`)));
    R.F6_outbound = rp.filter(x => x.direction === 'outbound').map(x => x.subject + ' | ' + x.status + ' | to ' + JSON.stringify(x.to || []).replace(/[\w.+-]+@[\w.-]+/g, m => m.includes('+qaao') ? '<gmail +qaao>' : '<addr>'));
    R.F6_history = (await hist(t6)).slice(0, 8);
    const rec = j(await call('owner', 'GET', `/modules/${TK}/records/${t6}`)) || {}; R.F6_number = ((rec.data || []).find(x => x.field === 'ticket_number') || {}).value || null;
  } catch (e) { R.error = String(e.message).slice(0, 300); }
  finally {
    if (suspended) R.reactivate = brief(await call('owner', 'PATCH', `/iam/users/${ID.A}`, { status: 'active' }));
    const c = []; for (const t of T) c.push((await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status);
    for (const b of B) { await call('owner', 'POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${b}`)).status); }
    if (TPL) c.push('tpl' + (await call('owner', 'DELETE', `/desk/email-templates/${TPL}`)).status); R.cleanup = c.join(' ');
    fs.writeFileSync(__dirname + '/../ndc-a6x.json', JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1));
  }
})();
