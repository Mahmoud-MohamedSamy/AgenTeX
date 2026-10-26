// ACT batch 1 (API): QA ticket, create defaults, D-classes, invalid values, status walk
const T = await mk('tickets', { subject: 'QA ACT ticket 1', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email' }, 'ticket');
rec('setup-ticket', T.id ? 'INFO' : 'BLOCKED', T.s + ' ' + (T.id || T.err));
// C1 minimum task
const c1 = await mk('tasks', { subject: 'QA ACT C1 min' }, 'C1');
const c1r = c1.id && (await recOf('tasks', c1.id)).o;
rec('ACT-C1', c1.id ? 'INFO' : 'FAIL', `create ${c1.s} ${c1.err}; defaults status=${c1r && c1r.status} priority=${c1r && c1r.priority} owner=${c1r && c1r.owner ? 'set' : 'empty'} department=${c1r && c1r.department} created_by=${c1r && c1r.created_by ? 'set' : 'empty'}`, { o: c1r });
// C4 subject D-classes (API)
const subj = { D1: '', D2: '   ', D3: 'Q', D4_300: 'QA ACT ' + 'x'.repeat(293), D5_301: 'QA ACT ' + 'x'.repeat(294), D5_5000: 'QA ACT ' + 'y'.repeat(4993), D6: 'QA ACT مهمة عربية', D7: 'QA ACT \u{1F680}✅', D8: 'QA ACT <img src=x onerror=alert(1)>', D10: '  QA ACT trim  ' };
const c4 = {}; for (const [k, v] of Object.entries(subj)) { const r = await mk('tasks', { subject: v }, 'C4-' + k); const back = r.id ? (await recOf('tasks', r.id)).o.subject : null; c4[k] = r.s + (r.id ? ' saved len=' + (back || '').length + (back === v ? ' same' : ' changed:' + JSON.stringify(String(back).slice(0, 40))) : ' ' + r.err.slice(0, 80)); }
rec('ACT-C4', 'INFO', JSON.stringify(c4));
// C11 picklists
const c11 = {};
for (const [k, vals] of [['tasks', { subject: 'QA ACT C11 st', status: 'Done' }], ['tasks', { subject: 'QA ACT C11 pr', priority: 'urgent' }], ['calls', { subject: 'QA ACT C11 cs', call_start_time: iso(H1), call_status: 'ringing' }], ['events', { title: 'QA ACT C11 ev', from_time: iso(D1), to_time: iso(D1 + H1), status: 'Not Started' }], ['tasks', { subject: 'QA ACT C11 cat', category: 'nonsense' }]]) { const r = await mk(k, vals, 'C11'); c11[k + ':' + Object.keys(vals).slice(-1)[0] + '=' + Object.values(vals).slice(-1)[0]] = r.s + ' ' + (r.id ? 'SAVED' : r.err.slice(0, 90)); }
rec('ACT-C11', Object.values(c11).some(v => /SAVED/.test(v)) ? 'FAIL' : 'PASS', JSON.stringify(c11));
// C12 dates
const c12 = {}; for (const v of ['2026-13-45T10:00:00Z', 'abc', 12345, '2100-01-01T00:00:00Z', '2001-01-01T00:00:00Z']) { const r = await mk('tasks', { subject: 'QA ACT C12 ' + v, due_date: v }, 'C12'); c12[String(v)] = r.s + ' ' + (r.id ? 'SAVED as ' + JSON.stringify((await recOf('tasks', r.id)).o.due_date) : r.err.slice(0, 80)); }
rec('ACT-C12', 'INFO', JSON.stringify(c12));
// C7/C10 required + end before start (API)
const c7 = await mk('calls', { subject: 'QA ACT C7 no start' }, 'C7'); rec('ACT-C7', c7.id ? 'FAIL' : 'PASS', 'API without call_start_time: ' + c7.s + ' ' + (c7.id ? 'SAVED' : c7.err.slice(0, 80)));
const c10 = await mk('events', { title: 'QA ACT C10', from_time: iso(D1 + 2 * H1), to_time: iso(D1) }, 'C10'); rec('ACT-C10-api', c10.id ? 'FAIL' : 'PASS', 'API end before start: ' + c10.s + ' ' + (c10.id ? 'SAVED' : c10.err.slice(0, 80)));
// C8 duration
const c8 = {}; for (const v of ['00:05', '5', '99:99', '-1', 'abc']) { const r = await mk('calls', { subject: 'QA ACT C8 ' + v, call_start_time: iso(-H1), call_status: 'completed', call_duration: v }, 'C8'); c8[v] = r.s + (r.id ? ' SAVED' : ' ' + r.err.slice(0, 60)); }
rec('ACT-C8', Object.entries(c8).filter(([k]) => ['99:99', '-1', 'abc'].includes(k)).some(([, v]) => /SAVED/.test(v)) ? 'FAIL' : 'PASS', JSON.stringify(c8));
// D1 status walk + D8 completed_time
const d = await mk('tasks', { subject: 'QA ACT D1 walk', due_date: iso(D1) }, 'D1'); const walk = [];
for (const st of ['In Progress', 'Waiting on Someone', 'Deferred', 'Completed', 'Not Started', 'Canceled']) { const r = await patch('tasks', d.id, { status: st }); const o = (await recOf('tasks', d.id)).o; walk.push(st + ':' + r.s + ' now=' + o.status + ' ct=' + (o.completed_time ? 'set' : 'none')); }
rec('ACT-D1/D8', 'INFO', walk.join(' | '));
// M2 read-only fields
const m2 = await patch('tasks', d.id, { completed_time: '2001-01-01T00:00:00Z', created_by: '00000000-0000-0000-0000-000000000000', approval_status: 'approved' });
const m2o = (await recOf('tasks', d.id)).o; rec('ACT-M2', String(m2o.completed_time || '').startsWith('2001') || m2o.approval_status === 'approved' || /^0000/.test(m2o.created_by || '') ? 'FAIL' : 'PASS', 'PATCH ' + m2.s + ' ' + (m2.j && m2.j.error ? m2.j.error.message : '') + ' after: ct=' + m2o.completed_time + ' appr=' + m2o.approval_status + ' cb=' + String(m2o.created_by).slice(0, 8));
// A7 no token
const a7 = await page.context().request.fetch(API + `/modules/${M.tasks}/records?page=1&per_page=1`, { headers: { 'x-app-key': 'desk' }, failOnStatusCode: false }); rec('ACT-A7', a7.status() === 401 ? 'PASS' : 'FAIL', 'no bearer -> ' + a7.status());
return fin({ ticket: T.id });
