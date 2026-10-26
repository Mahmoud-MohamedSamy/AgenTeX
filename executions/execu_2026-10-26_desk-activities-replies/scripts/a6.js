// ACT reminders via API: G1 options, G3 before, G5 limit 5, G6 validation, G7 no due date, G8 closed before firing, G9 sms
const R_ = (id, b) => api('POST', `/desk/activities/${id}/reminders`, b);
const o1 = await api('GET', '/desk/activities/reminders/options'); rec('ACT-G1', /"popup":true/.test(o1.t) && /"email":true/.test(o1.t) && /"sms":false/.test(o1.t) && /"max_per_activity":5/.test(o1.t) ? 'PASS' : 'FAIL', o1.t.slice(0, 200));
const t = (await mk('tasks', { subject: 'QA ACT G5 task', status: 'Not Started', due_date: iso(D1) }, 'G5')).id;
const g3 = await R_(t, { timing: 'before', offset_value: 5, offset_unit: 'minutes', channels: ['popup', 'email'] }); rec('ACT-G3', g3.s === 201 ? 'PASS' : 'FAIL', g3.s + ' ' + g3.t.slice(0, 300));
const lim = []; for (let i = 0; i < 5; i++) { const r = await R_(t, { timing: 'before', offset_value: 10 + i, offset_unit: 'minutes', channels: ['popup'] }); lim.push(r.s + (r.s >= 400 ? ':' + (r.j && r.j.error ? r.j.error.message : '') : '')); }
rec('ACT-G5', lim.slice(0, 4).every(x => x.startsWith('201')) && /^4/.test(lim[4]) ? 'PASS' : 'FAIL', 'reminders 2..6 -> ' + lim.join(', '));
const bad = { 'offset 0': { timing: 'before', offset_value: 0, offset_unit: 'minutes', channels: ['popup'] }, 'offset -1': { timing: 'before', offset_value: -1, offset_unit: 'minutes', channels: ['popup'] }, 'offset 1.5': { timing: 'before', offset_value: 1.5, offset_unit: 'hours', channels: ['popup'] }, 'offset abc': { timing: 'before', offset_value: 'abc', offset_unit: 'hours', channels: ['popup'] }, 'unit weeks': { timing: 'before', offset_value: 1, offset_unit: 'weeks', channels: ['popup'] }, 'custom past': { timing: 'custom', custom_at: iso(-H1), channels: ['popup'] }, 'no channel': { timing: 'at', channels: [] }, 'sms': { timing: 'at', channels: ['sms'] }, 'unknown channel': { timing: 'at', channels: ['pigeon'] }, 'timing x': { timing: 'sometime', channels: ['popup'] } };
const t2 = (await mk('tasks', { subject: 'QA ACT G6 task', status: 'Not Started', due_date: iso(D1) }, 'G6')).id; const g6 = {};
for (const [k, b] of Object.entries(bad)) { const r = await R_(t2, b); g6[k] = r.s + ' ' + (r.j && r.j.error ? r.j.error.message : 'SAVED').slice(0, 90); if (r.s === 201) { const rid = r.j.data.reminder.id; await api('DELETE', `/desk/activities/${t2}/reminders/${rid}`); } }
rec('ACT-G6', Object.values(g6).some(v => /^20/.test(v)) ? 'FAIL' : 'PASS', JSON.stringify(g6));
rec('ACT-G9', /^4/.test(g6['sms']) ? 'PASS' : 'FAIL', 'sms: ' + g6['sms']);
const t3 = (await mk('tasks', { subject: 'QA ACT G7 task', status: 'Not Started' }, 'G7')).id; const g7 = await R_(t3, { timing: 'at', channels: ['popup'] });
rec('ACT-G7', 'INFO', 'reminder on a task without due date: ' + g7.s + ' ' + g7.t.slice(0, 300));
const t4 = (await mk('tasks', { subject: 'QA ACT G8 task', status: 'Not Started', due_date: iso(6 * 60e3) }, 'G8')).id; const g8 = await R_(t4, { timing: 'before', offset_value: 3, offset_unit: 'minutes', channels: ['popup'] });
await patch('tasks', t4, { status: 'Completed' });
rec('ACT-G8-setup', 'INFO', 'task ' + t4 + ' reminder at due-3min (' + g8.s + '), then completed; check state after ' + iso(3 * 60e3));
const l = await api('GET', `/desk/activities/${t}/reminders`); rec('ACT-G-list', l.s === 200 ? 'PASS' : 'FAIL', 'GET list ' + l.s + ' ' + l.t.slice(0, 200));
return fin({ t, t2, t3, t4 });
