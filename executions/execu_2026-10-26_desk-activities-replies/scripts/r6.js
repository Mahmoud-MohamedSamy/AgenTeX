// RPL batch 6 (mostly API, same bodies the UI sends): C3/C4 with a non-delivering CC, F2 send+close, K1/K2 review, J1/J2/J3/J4, G snippets
const CCX = 'qa.rpl.cc@example.com';
const tk = (await mk('tickets', { subject: 'QA RPL ticket 3', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email' }, 'rpl-ticket-3')).id;
const send = b => api('POST', `/desk/tickets/${tk}/replies`, { mode: 'reply_all', to: [QA_EMAIL], subject: 'Re: QA RPL ticket 3', body_html: '<p>QA RPL</p>', ...b });
const s = r => r.s + ' ' + (r.j && r.j.error ? r.j.error.code + ' ' + r.j.error.message : 'ok').slice(0, 140);
// C3: reply all with CC -> is CC added to the ticket CC list?
const c3 = await send({ cc: [CCX], body_html: '<p>QA RPL C3c</p>' }); const cc1 = await api('GET', `/desk/tickets/${tk}/cc`);
rec('RPL-C3', c3.s === 201 ? (cc1.t.includes(CCX) ? 'PASS' : 'INFO') : 'FAIL', `send ${s(c3)}; ticket CC list after: ${cc1.t.includes(CCX) ? 'contains CC' : 'does not contain CC (Zoho adds secondary contacts from the conversation)'}`);
// add CC on the ticket explicitly, then reply without it (C4)
const add = await api('POST', `/desk/tickets/${tk}/cc`, { email: CCX }); const add2 = add.s >= 400 ? await api('POST', `/desk/tickets/${tk}/cc`, { emails: [CCX] }) : add;
const c4 = await send({ cc: [], body_html: '<p>QA RPL C4c</p>' }); const cc2 = await api('GET', `/desk/tickets/${tk}/cc`);
rec('RPL-C4', cc2.t.includes(CCX) ? 'PASS' : 'FAIL', `add CC to ticket ${s(add)} / ${s(add2)}; reply without it ${s(c4)}; ticket CC still has it: ${cc2.t.includes(CCX)}`);
// C5 bcc stored
const c5 = await send({ bcc: [CCX.replace('cc', 'bcc')], body_html: '<p>QA RPL C5 bcc</p>' }); const r5 = c5.j && c5.j.data && c5.j.data.reply;
rec('RPL-C5', r5 && (r5.bcc || []).length === 1 ? 'PASS' : 'FAIL', `${s(c5)} bcc=${JSON.stringify(r5 && r5.bcc)}`);
// J1 pin / unpin, J2 make private (find the action), J3 headers, J4 split on agent reply
const rid = r5 && r5.id;
const p1 = await api('PUT', `/desk/tickets/${tk}/replies/${rid}/pin`, {}); const p0 = await api('DELETE', `/desk/tickets/${tk}/replies/${rid}/pin`);
rec('RPL-J1', p1.s < 300 && p0.s < 300 ? 'PASS' : 'FAIL', `pin ${s(p1)}; unpin ${s(p0)}`);
const hd = await api('GET', `/desk/tickets/${tk}/replies/${rid}/headers`); rec('RPL-J3', hd.s === 200 && !/authorization|password|api[_-]?key/i.test(hd.t) ? 'PASS' : 'INFO', `headers ${hd.s} len=${hd.t.length} sample=${hd.t.slice(0, 160)}`);
const sp = await api('POST', `/desk/tickets/${tk}/replies/${rid}/split`, {}); if (sp.j && sp.j.data && sp.j.data.ticket_id) CREATED.push({ k: 'tickets', id: sp.j.data.ticket_id, tag: 'J4-split' });
rec('RPL-J4', sp.s >= 400 ? 'PASS' : 'FAIL', `split an AGENT reply -> ${s(sp)} (Zoho: split only incoming threads)`);
// F2 send and close: same POST + close? capture: send then check status via a UI-equivalent field (try body flag first)
const f2 = await send({ body_html: '<p>QA RPL F2 send and close</p>', close_ticket: true, status: 'Closed' }); const tS = await api('GET', `/desk/tickets/${tk}`);
rec('RPL-F2-api', 'INFO', `POST with close flags ${s(f2)} -> ticket status ${tS.j.data.status} (UI path checked separately)`);
// K review: save my draft on server then submit/withdraw
const pd = await api('PUT', `/desk/tickets/${tk}/drafts/mine`, { mode: 'reply_all', to: [QA_EMAIL], subject: 'Re: QA RPL ticket 3', body_html: '<p>QA RPL K1 review</p>' });
const sr = await api('POST', `/desk/tickets/${tk}/drafts/mine/submit-review`, {}); const dl = await api('GET', `/desk/tickets/${tk}/drafts`);
const wr = await api('POST', `/desk/tickets/${tk}/drafts/mine/withdraw-review`, {});
rec('RPL-K1/K2', sr.s < 300 && wr.s < 300 ? 'PASS' : 'FAIL', `PUT draft ${s(pd)}; submit ${s(sr)}; drafts list ${dl.t.slice(0, 200)}; withdraw ${s(wr)}`);
const ap = await api('POST', `/desk/tickets/${tk}/drafts/${(pd.j && pd.j.data && (pd.j.data.id || (pd.j.data.draft && pd.j.data.draft.id))) || 'x'}/approve`, {});
rec('RPL-K5', ap.s >= 400 ? 'PASS' : 'FAIL', `agent approves own draft -> ${s(ap)}`);
await api('DELETE', `/desk/tickets/${tk}/drafts/mine`);
// G snippets
const g4 = await api('POST', '/desk/snippets', { name: 'qa_rpl_snip', content: 'Hello {{customer_name}}, ticket {{ticket_number}}.', is_shared: false });
const sid = g4.j && g4.j.data && (g4.j.data.id || (g4.j.data.snippet && g4.j.data.snippet.id));
rec('RPL-G4', g4.s === 201 ? 'PASS' : 'FAIL', `create snippet ${s(g4)} ${g4.t.slice(0, 200)}`);
const g5 = {}; g5['space in name'] = s(await api('POST', '/desk/snippets', { name: 'qa rpl snip', content: 'x', is_shared: false })); g5['duplicate'] = s(await api('POST', '/desk/snippets', { name: 'qa_rpl_snip', content: 'x', is_shared: false })); g5['25601 chars'] = s(await api('POST', '/desk/snippets', { name: 'qa_rpl_long', content: 'z'.repeat(25601), is_shared: false })); g5['empty'] = s(await api('POST', '/desk/snippets', { name: 'qa_rpl_empty', content: '', is_shared: false }));
rec('RPL-G5', Object.values(g5).some(v => /^201/.test(v)) ? 'FAIL' : 'PASS', JSON.stringify(g5));
const rs = await api('POST', `/desk/tickets/${tk}/snippets/resolve`, { snippet_id: sid, content: 'Hello {{customer_name}}, ticket {{ticket_number}}.' });
rec('RPL-G6', /\{\{/.test(rs.t) ? 'FAIL' : 'INFO', `resolve ${s(rs)} ${rs.t.slice(0, 200)}`);
if (sid) { const dd = await api('DELETE', `/desk/snippets/${sid}`); rec('RPL-G8', dd.s < 300 ? 'PASS' : 'FAIL', 'delete snippet ' + s(dd)); }
const all = await api('GET', '/desk/snippets'); for (const x of ((all.j && all.j.data && all.j.data.snippets) || [])) if (/^qa_rpl/.test(x.name)) await api('DELETE', `/desk/snippets/${x.id}`);
return fin({ tk, rid });
