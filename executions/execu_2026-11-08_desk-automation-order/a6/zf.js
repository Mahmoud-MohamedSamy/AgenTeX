// Functional check of Z11 (escalation levels) and Z12 (business-hours set per state). node zf.js run | clean ; ids in zf.json
const n = require('./bp/ndc'); const { call, sleep, CS } = n; const fs = require('fs');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const OUT = __dirname + '/zf.json'; const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const v = x => ({ kind: 'string', value: String(x) });
const tr = (id, a, b) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during: {}, after: { actions: [] } });
const bstate = async t => ((await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`)).json?.data?.states || [])[0] || null;
(async () => {
  const mode = process.argv[2]; let M = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {}; const save = () => fs.writeFileSync(OUT, JSON.stringify(M, null, 1));
  if (mode === 'run') {
    M = { at: new Date().toISOString() };
    const p = await call('owner', 'POST', '/iam/tenant/business-hours/profiles', { name: 'QA ZM BH weekdays', preset: '24_5', timing_mode: 'same', hours: { open: '00:00', close: '23:59' }, days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], time_zone: 'Africa/Cairo', week_starts_on: 'mon' });
    M.bh = p.json?.data?.id; M.bhRes = p.status + ' ' + (p.code || '') + ' ' + (p.msg || ''); save(); if (!M.bh) { console.log(JSON.stringify(M)); return; }
    const def = (tag, open) => ({ name: 'QA BP ' + tag, description: 'QA functional check - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
      entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' + tag + ' ' }, states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 }, ...open }, { id: 'Closed', name: 'Closed', position: { x: 300, y: 0 }, slaClock: 'calendar', isTerminal: true }], transitions: [tr('end', 'Open', 'Closed')] });
    const mk = async (k, d) => { const r = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: d, isActive: true }); M['B' + k] = r.json?.data?.id; M['B' + k + 'res'] = r.status + ' ' + (r.msg || ''); save(); };
    const tk = async (k, tag) => { const r = await call('owner', 'POST', `/modules/${TK}/records`, { data: [['subject', 'QA BP ' + tag + ' ticket'], ['department', CS], ['status', 'Open']].map(([f, x]) => ({ field: f, value: v(x) })) }); M['T' + k] = r.json?.data?.id; save(); for (let i = 0; i < 15 && !(await bstate(M['T' + k])); i++) await sleep(2000); };
    await mk('H', def('ZH hours', { slaClock: 'business', slaBusinessHoursId: M.bh, slaMinutes: 120 }));
    await mk('C', def('ZC cal', { slaClock: 'calendar', slaMinutes: 120 }));
    await mk('E', def('ZE esc', { slaClock: 'calendar', slaMinutes: 2, slaEscalationLevels: [
      { id: 'level-qa1', timing: 'before', offsetMinutes: 1, recipients: { teamIds: [], userIds: [OWNER], ticketOwner: false, transitionOwners: false }, templateId: null },
      { id: 'level-qa2', timing: 'at', offsetMinutes: 0, recipients: { teamIds: [], userIds: [OWNER], ticketOwner: false, transitionOwners: false }, templateId: null },
      { id: 'level-qa3', timing: 'after', offsetMinutes: 1, recipients: { teamIds: [], userIds: [OWNER], ticketOwner: false, transitionOwners: false }, templateId: null }] }));
    M.Esaved = JSON.stringify((await call('owner', 'GET', `/modules/${TK}/blueprints/${M.BE}`)).json?.data?.definition?.states?.[0]?.slaEscalationLevels?.map(l => l.timing + ':' + l.offsetMinutes));
    M.t0 = new Date().toISOString();
    await tk('E', 'ZE esc'); await tk('H', 'ZH hours'); await tk('C', 'ZC cal');
    await sleep(30000);
    for (const k of ['H', 'C', 'E']) { const s = await bstate(M['T' + k]); M['due' + k] = s && { slaDueAt: s.slaDueAt, enteredAt: s.enteredAt, provisional: s.provisional, keys: Object.keys(s).join(',') }; }
    save(); console.log(JSON.stringify(M, null, 1)); return;
  }
  if (mode === 'check') {
    const s = await bstate(M.TE); M.Estate = JSON.stringify(s).slice(0, 800);
    const nn = await call('owner', 'GET', '/notifications?limit=30'); M.notifs = (nn.json?.data?.data || []).filter(x => x.created_at > M.t0).map(x => x.created_at.slice(11, 19) + ' ' + x.event_type + ' | ' + x.title);
    const h = await call('owner', 'GET', `/modules/${TK}/records/${M.TE}/history?limit=50`); M.hist = h.status + ' ' + JSON.stringify(h.json?.data).slice(0, 1500);
    save(); console.log(JSON.stringify({ Estate: M.Estate, notifs: M.notifs, hist: M.hist }, null, 1)); return;
  }
  if (mode === 'clean') { const c = [];
    for (const k of ['TH', 'TC', 'TE']) if (M[k]) c.push(k + ':' + (await call('owner', 'DELETE', `/modules/${TK}/records/${M[k]}`)).status);
    for (const k of ['BH', 'BC', 'BE']) if (M[k]) { await call('owner', 'POST', `/desk/blueprints/${M[k]}/revoke`, { ticket_ids: null, after: null }); c.push(k + ':' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${M[k]}`)).status); }
    if (M.bh) c.push('bh:' + (await call('owner', 'DELETE', '/iam/tenant/business-hours/profiles/' + M.bh)).status);
    console.log(c.join(' ')); }
})();
