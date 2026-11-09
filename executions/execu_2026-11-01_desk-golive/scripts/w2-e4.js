const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const P = `/desk/tickets/${tk}`; const o = {}; const SR = '01a19b74-a01b-7b03-ad16-e98a51692a0d', EM = 'a64b7aab-0652-461f-86af-c6d4a52f1475';
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 240) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 300) : undefined });
const sl = await api('GET', '/desk/scheduled-replies'); o.schedBefore = ((sl.j && sl.j.data && sl.j.data.scheduled_replies) || []).filter(x => x.ticket_id === EM).map(x => [x.id, x.status, x.ticket_number]);
o.schedDiscard = sh(await api('DELETE', `/desk/scheduled-replies/${SR}`));
const sl2 = await api('GET', '/desk/scheduled-replies'); o.schedAfter = ((sl2.j && sl2.j.data && sl2.j.data.scheduled_replies) || []).filter(x => x.ticket_id === EM).map(x => [x.id, x.status]);
// macro
const mc = await api('POST', '/desk/macros', { name: 'QA GL W2 macro', department_id: DQ, actions: [{ kind: 'set_status', value: 'On Hold' }, { kind: 'add_comment', content_html: '<p>QA GL W2 macro comment</p>' }] }); o.macro = sh(mc); const mid = mc.j && mc.j.data && (mc.j.data.id || (mc.j.data.macro && mc.j.data.macro.id));
if (mid) { CREATED.push({ k: 'macro', id: mid }); o.apply = sh(await api('POST', `${P}/apply-macro`, { macro_id: mid })); const g = await getRec(T, tk); o.statusAfterMacro = g.o && g.o.status; const lc = await api('GET', `${P}/comments`); o.macroComment = arr(lc.j && lc.j.data).some(c => /macro comment/.test(c.body_html || '')); }
// template field values
const tl = await api('GET', '/desk/ticket-templates'); const tpl = arr(tl.j && tl.j.data).find(x => x.name === 'QA GL W2 template'); o.tplFound = !!tpl;
if (tpl) o.tplUpdate = sh(await api('PUT', `/desk/ticket-templates/${tpl.id}`, { name: 'QA GL W2 template', department_id: DQ, field_values: { subject: 'QA GL W2 from template', priority: 'low' } }));
// AI
o.aiSummary = sh(await api('POST', `${P}/ai/summary`, {})); o.aiTriage = sh(await api('POST', `${P}/ai/triage`, {})); o.aiSuggest = sh(await api('POST', `${P}/ai/reply-suggestions`, {}));
o.aiAssist = sh(await api('POST', `${P}/ai/draft-assist`, { action: 'expand', text: 'Thanks for writing. We are checking.', body_html: '<p>Thanks for writing. We are checking.</p>' }));
o.translate = sh(await api('POST', `${P}/messages/cb91e9a4-cc27-4885-a44b-7e7d0cdbb9dd/translate`, { target_lang: 'ar' }));
// viewers heartbeat
o.heartbeat = sh(await api('POST', `${P}/viewers/heartbeat`, {})); o.leave = sh(await api('DELETE', `${P}/viewers/me`));
// search
const s1 = await api('GET', '/search?q=' + encodeURIComponent('QA GL W2 base') + '&app=desk'); o.search = s1.s + ' ' + (s1.t.includes('QA GL W2 base') ? 'found' : 'not found');
const s2 = await api('GET', '/search?q=1072&app=desk'); o.searchNum = s2.s + ' ' + (s2.t.includes('3008a52d') || s2.t.includes('QA GL W2 base') ? 'found' : 'not found');
// notifications
o.unread = sh(await api('GET', '/notifications/unread-count')); const nl = await api('GET', '/notifications?limit=5'); o.notif = nl.s + ' ' + JSON.stringify(arr(nl.j && nl.j.data).slice(0, 3).map(n => [n.title || n.type || n.key, (n.body || n.message || '').slice(0, 60)])).slice(0, 500);
// lost update: two PATCHes with the same stale row_version
const g0 = await api('GET', `/modules/${T}/records/${tk}`); const rv = g0.j && g0.j.data && g0.j.data.row_version; o.rv = rv;
const pa = await api('PATCH', `/modules/${T}/records/${tk}`, { ...body({ priority: 'Low' }), row_version: rv }); const pb = await api('PATCH', `/modules/${T}/records/${tk}`, { ...body({ description: 'QA GL W2 stale write' }), row_version: rv });
o.stale = [pa.s, pb.s, pb.j && pb.j.error && pb.j.error.code]; const g1 = await getRec(T, tk); o.afterStale = [g1.o.priority, g1.o.description];
const pc = await api('PATCH', `/modules/${T}/records/${tk}`, body({ description: 'QA GL W2 no version' })); o.noVersion = pc.s;
// unknown id
o.unknown = sh(await api('GET', '/desk/tickets/00000000-1111-2222-3333-444444444444'));
return fin(o);
