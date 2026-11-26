const o = {}; const R = ST.R = ST.R || {}; const TK = ST.tickets;
const nm = id => (Object.entries(U).find(([, v]) => v === id) || [])[0] || id;
const P = (id, pass, note, ex) => { result(id, pass === null ? 'INCONCLUSIVE' : pass ? 'PASS' : 'FAIL', note, ex); o[id] = (pass === null ? 'INC ' : pass ? 'PASS ' : 'FAIL ') + note; };
const req = async (key, tk, approvers, teams, who = 'A', subj) => { if (R[key]) return R[key]; const r = await api[who]('POST', `/desk/tickets/${TK[tk]}/approvals`, { subject: subj || `QA PA ${key} request`, description: `QA PA ${key} description`, approver_user_ids: approvers, ...(teams ? { approver_team_ids: teams } : {}) }); if (r.j?.data?.id) { R[key] = { id: r.j.data.id, t: TK[tk] }; ledger(`approval ${key} ${r.j.data.id} on ${tk}`); saveState(); } else o['req ' + key] = E(r); return R[key]; };
R.R1 = R.R1 || { id: '79ce7747-e69c-41aa-9236-f3a92efde7fd', t: TK['QA PA T01'] };
for (const s of ['QA PA T13', 'QA PA T14', 'QA PA T15', 'QA PA T16', 'QA PA T17']) if (!TK[s]) await mkTicket('O', s);
if (!Object.keys(TK).some(k => /T18/.test(k))) await mkTicket('O', 'QA PA T18 عربي طلب استرداد');
if (!TK['QA PA T23']) await mkTicket('O', 'QA PA T23', { department: ST.D2 });
const T18 = Object.keys(TK).find(k => /T18/.test(k));
await req('R2', 'QA PA T02', [U.B], [ST.TEAM]);
await req('R4', 'QA PA T04', [U.B]); await req('R5', 'QA PA T05', [U.B]); await req('R6', 'QA PA T06', [], [ST.TEAM]);
await req('R7', 'QA PA T07', [U.B]); await req('R8', 'QA PA T08', [U.B]);
await req('R9', 'QA PA T09', [U.B]); await req('R10', 'QA PA T10', [U.B]); await req('R11', 'QA PA T11', [U.B]);
await req('R12', 'QA PA T12', [U.B, U.D]); await req('R13', 'QA PA T13', [U.B, U.D]); await req('R14', 'QA PA T14', [U.B]);
await req('R3', 'QA PA T03', [U.B]); await req('R15', 'QA PA T15', [U.B]); await req('R16', 'QA PA T16', [U.B]); await req('R17', 'QA PA T17', [U.B]);
await req('R18', T18, [U.B], null, 'A', 'QA PA طلب موافقة عربي');
await req('R21', 'QA PA T21', [U.S], null, 'O'); await req('R23', 'QA PA T23', [U.S], null, 'O');
if (!R.R6) { const r6 = await api.A('POST', `/desk/tickets/${TK['QA PA T06']}/approvals`, { subject: 'QA PA R6 request', approver_user_ids: [], approver_team_ids: [ST.TEAM] }); o.R6try = E(r6); }
o.R2shape = JSON.stringify((await api.B('GET', '/desk/approvals/' + R.R2?.id)).j?.data?.item?.approval?.approver_teams);
// F3
const f3 = await api.A('POST', `/desk/tickets/${TK['QA PA T02']}/approvals`, { subject: 'QA PA F3', approver_user_ids: [U.S] });
P('F3', f3.s >= 400, 'request with approver S (no Dept 1 access) -> ' + E(f3)); if (f3.s < 300) { R.F3 = { id: f3.j.data.id, t: TK['QA PA T02'] }; saveState(); }
const elig = await api.A('GET', `/desk/tickets/${TK['QA PA T02']}/approvals/eligible-approvers`); o.F3elig = elig.s + ' S offered: ' + elig.t.includes(U.S) + ', B offered: ' + elig.t.includes(U.B);
// A2
const cB = await api.B('GET', '/desk/approvals/count'); const ibB = await inbox('B', { list: 'waiting', page_size: 100 });
P('A2', cB.j?.data?.waiting === ibB.d?.total_count, `B nav count ${cB.j?.data?.waiting}, waiting list total ${ibB.d?.total_count}; A count ${(await api.A('GET', '/desk/approvals/count')).j?.data?.waiting}`);
// A6
const a6 = await api.S('GET', '/desk/approvals/' + R.R1.id); P('A6', a6.s === 404 && !a6.t.includes('QA PA'), 'S GET Dept 1 item -> ' + a6.s + ', leaks subject: ' + a6.t.includes('QA PA'));
// A7
const a7 = await inbox('B', { list: 'all_pending' }); P('A7', a7.s >= 400 || !(a7.d?.approvals || []).some(x => x.kind === 'ticket_approval' && !(x.approval?.approver_user_ids || []).includes(U.B)), `B list=all_pending -> ${a7.s} items ${(a7.d?.approvals || []).length} perms ${JSON.stringify(a7.d?.permissions)} ${a7.err || ''}`);
// A8
const a8 = await inbox('S', { list: 'all_pending', page_size: 100 }); const a8d = [...new Set((a8.d?.approvals || []).map(x => x.department_id))];
P('A8', !a8d.includes(ST.D1) && a8d.includes(ST.D2), `S all_pending depts ${JSON.stringify(a8d.map(d => d === ST.D2 ? 'D2' : d === ST.D1 ? 'D1' : d.slice(0, 8)))}, count ${a8.d?.counts?.all_pending}, total ${a8.d?.total_count}`);
// A9
const a9 = await inbox('O', { list: 'all_pending', page_size: 100 }); const a9d = [...new Set((a9.d?.approvals || []).map(x => x.department_id))];
P('A9', a9d.includes(ST.D1) && a9d.includes(ST.D2), `O all_pending has D1 ${a9d.includes(ST.D1)}, D2 ${a9d.includes(ST.D2)}, total ${a9.d?.total_count}`);
// A10
const a10a = await inbox('S', { list: 'all_pending', department_id: ST.D1 }); const a10b = await inbox('S', { list: 'all_pending', q: 'QA PA T01' }); const a10w = await inbox('S', { list: 'waiting', department_id: ST.D1 });
P('A10', !(a10a.d?.approvals || []).length && !(a10b.d?.approvals || []).length && !(a10w.d?.approvals || []).length, `S dept=D1 -> ${a10a.s} ${(a10a.d?.approvals || []).length} items, counts ${JSON.stringify(a10a.d?.counts)}; search T01 -> ${(a10b.d?.approvals || []).length}`);
// A15
const a15s = await decide('S', R.R1.t, R.R1.id, 'approve', {}); const a15a = await decide('A', R.R1.t, R.R1.id, 'approve', {}); const a15r = await decide('A', R.R1.t, R.R1.id, 'reject', { comment: 'QA PA no' });
P('A15', a15s.s >= 400 && a15a.s === 403 && a15r.s === 403, `S approve -> ${E(a15s)}; A (requester) approve -> ${E(a15a)}; A reject -> ${E(a15r)}`);
// D9
const d9 = {}; for (const k of ['A', 'B', 'S', 'O', 'D']) { const r = await api[k]('GET', '/desk/approvals/' + R.R1.id); const it = r.j?.data?.item; d9[k] = r.s + (it ? ` dec:${it.can_decide} can:${it.can_cancel} rem:${it.can_remind} rea:${it.can_reassign} com:${it.can_comment} obh:${it.can_decide_on_behalf}` : ''); }
P('D9', /dec:true/.test(d9.B) && /can:true/.test(d9.A) && /dec:false/.test(d9.A) && /^404/.test(d9.S) && /obh:true/.test(d9.O), JSON.stringify(d9));
// D2
const d2 = (await api.B('GET', '/desk/approvals/' + R.R12.id)).j?.data?.item; o.D2item = JSON.stringify(d2).slice(0, 1200);
P('D2', !!(d2 && d2.approval?.subject && d2.approval?.description && d2.approval?.requested_by && (d2.approval?.approvers || []).length === 2), `approvers ${JSON.stringify(d2?.approval?.approvers)}; mode field present: ${'mode' in (d2?.approval || {}) || 'approval_mode' in (d2?.approval || {})}`);
// D7
const cm = (who, r, body) => api[who]('POST', `/desk/tickets/${r.t}/approvals/${r.id}/comments`, { body });
const d7b = await cm('B', R.R12, 'QA PA comment from B'), d7a = await cm('A', R.R12, 'QA PA comment from A'), d7s = await cm('S', R.R12, 'QA PA comment from S');
P('D7', d7b.s < 300 && d7a.s < 300 && d7s.s >= 400, `B ${E(d7b)}, A ${E(d7a)}, S (no access) ${E(d7s)}`);
// D8
const d8 = {}; for (const [k, v] of Object.entries({ empty: '', spaces: '   ', c2000: 'x'.repeat(2000), c2001: 'x'.repeat(2001), script: '<script>alert(1)</script>', arabic: 'تعليق عربي', emoji: '👍 QA', html: '<b>bold</b>' })) d8[k] = (await cm('B', R.R12, v)).s;
const act = await api.B('GET', `/desk/tickets/${R.R12.t}/approvals/${R.R12.id}/activity`); fs.writeFileSync(RUN + '/out/b1-activity-R12.json', act.t);
P('D8', d8.empty >= 400 && d8.spaces >= 400 && d8.c2000 < 300 && d8.c2001 >= 400 && d8.script < 300, JSON.stringify(d8) + ' activity stores script raw: ' + act.t.includes('<script>alert(1)</script>'));
// E13
const rm = (who, r) => api[who]('POST', `/desk/tickets/${r.t}/approvals/${r.id}/remind`, {});
const e13a = await rm('A', R.R7), e13b = await rm('A', R.R7), e13c = await rm('B', R.R7);
P('E13', e13a.s < 300 && e13b.s >= 400, `first ${E(e13a)} ${e13a.t.slice(0, 160)}; second ${E(e13b)}; approver B reminds -> ${E(e13c)}`);
// E3/E4/E5
const e3 = {}; for (const [k, v] of Object.entries({ none: null, empty: '', two: 'ab', spaces: '     ', c2001: 'r'.repeat(2001) })) e3[k] = E(await decide('B', R.R5.t, R.R5.id, 'reject', v === null ? {} : { comment: v }));
P('E3', ['none', 'empty', 'two', 'spaces'].every(k => +e3[k].slice(0, 3) >= 400), JSON.stringify(e3));
const e5 = await decide('B', R.R5.t, R.R5.id, 'reject', { comment: 'abc' });
const e4b = await decide('B', R.R9.t, R.R9.id, 'reject', { comment: 'ر'.repeat(1975) + '<script>alert(1)</script>' });
P('E4', +e3.c2001.slice(0, 3) >= 400 && e5.s < 300 && e4b.s < 300, `2001 -> ${e3.c2001}; exactly 3 -> ${E(e5)}; 2000 Arabic+script -> ${E(e4b)}`);
const a5 = (await ticketApprovals('A', R.R5.t)).list.find(x => x.id === R.R5.id);
P('E5', a5?.status === 'rejected' && a5?.decision_comment === 'abc', `ticket tab status ${a5?.status}, comment "${a5?.decision_comment}", decided_by ${nm(a5?.decided_by)}`);
// E1
const c0 = (await api.B('GET', '/desk/approvals/count')).j?.data?.waiting;
const e1 = await decide('B', R.R1.t, R.R1.id, 'approve', { comment: 'QA PA approved by B' }); const c1 = (await api.B('GET', '/desk/approvals/count')).j?.data?.waiting;
const a1 = (await ticketApprovals('A', R.R1.t)).list.find(x => x.id === R.R1.id); const inW = (await inbox('B', { list: 'waiting', page_size: 100 })).d?.approvals?.some(x => x.id === R.R1.id);
P('E1', e1.s < 300 && a1?.status === 'approved' && c1 === c0 - 1 && !inW, `approve ${E(e1)}; count ${c0}->${c1}; tab ${a1?.status} "${a1?.decision_comment}"; still in waiting ${inW}`);
const e2 = await decide('B', R.R4.t, R.R4.id, 'approve', {}); P('E2', e2.s < 300, 'approve without comment -> ' + E(e2));
// E6
const dBefore = (await inbox('D', { list: 'waiting', page_size: 100 })).d?.approvals?.some(x => x.id === R.R12.id);
const e6 = await decide('B', R.R12.t, R.R12.id, 'approve', {}); const dAfter = (await inbox('D', { list: 'waiting', page_size: 100 })).d?.approvals?.some(x => x.id === R.R12.id);
const a12 = (await ticketApprovals('A', R.R12.t)).list.find(x => x.id === R.R12.id);
P('E6', e6.s < 300 && a12?.status === 'approved' && dBefore && !dAfter, `B approves -> ${E(e6)}; status ${a12?.status}; in D's list before ${dBefore} after ${dAfter}`);
// E14/E15
const e14a = await decide('O', R.R14.t, R.R14.id, 'approve', { comment: 'QA PA' });
const e15 = await decide('S', R.R14.t, R.R14.id, 'approve', { comment: 'QA PA', on_behalf_reason: 'QA PA supervisor on behalf', on_behalf_of_user_id: U.B });
const e14b = await decide('O', R.R14.t, R.R14.id, 'approve', { comment: 'QA PA', on_behalf_reason: 'QA PA B is on leave', on_behalf_of_user_id: U.B });
const a14 = (await ticketApprovals('A', R.R14.t)).list.find(x => x.id === R.R14.id);
P('E14', e14a.s >= 400 && e14b.s < 300 && a14?.on_behalf, `no reason -> ${E(e14a)}; with reason -> ${E(e14b)}; on_behalf ${a14?.on_behalf} of ${nm(a14?.on_behalf_of)} reason "${a14?.on_behalf_reason}" decided_by ${nm(a14?.decided_by)}`);
P('E15', e15.s >= 400, 'S on behalf -> ' + E(e15));
// E16/E17
const e16 = await api.A('POST', `/desk/tickets/${R.R8.t}/approvals/${R.R8.id}/cancel`, {}); const a8x = (await ticketApprovals('A', R.R8.t)).list.find(x => x.id === R.R8.id);
P('E16', e16.s < 300 && a8x?.status === 'cancelled', `A cancels -> ${E(e16)}; status ${a8x?.status}`);
const e17a = await api.B('POST', `/desk/tickets/${R.R10.t}/approvals/${R.R10.id}/cancel`, {}); const e17b = await api.A('POST', `/desk/tickets/${R.R1.t}/approvals/${R.R1.id}/cancel`, {});
P('E17', e17a.s >= 400 && e17b.s >= 400, `B cancels A's request -> ${E(e17a)}; A cancels decided -> ${E(e17b)} (blueprint part in group H)`);
// E18/E19
const ra = (who, r, from, to) => api[who]('POST', `/desk/tickets/${r.t}/approvals/${r.id}/reassign`, { from, to });
const e19 = await ra('O', R.R7, { user_id: U.B }, { user_id: U.S });
const e18 = await ra('O', R.R7, { user_id: U.B }, { user_id: U.D });
const a7x = (await ticketApprovals('A', R.R7.t)).list.find(x => x.id === R.R7.id); const bHas = (await inbox('B', { list: 'waiting', page_size: 100 })).d?.approvals?.some(x => x.id === R.R7.id); const dHas = (await inbox('D', { list: 'waiting', page_size: 100 })).d?.approvals?.some(x => x.id === R.R7.id);
const e18a = await ra('A', R.R7, { user_id: U.D }, { user_id: U.B });
P('E18', e18.s < 300 && dHas && !bHas, `O reassign B->D -> ${E(e18)}; approvers ${JSON.stringify((a7x?.approver_user_ids || []).map(nm))}; B has ${bHas}, D has ${dHas}; A (Supervisor, requester) reassign -> ${E(e18a)}`);
P('E19', e19.s >= 400, 'reassign to S (no Dept 1 access) -> ' + E(e19));
// E20
const [x1, x2] = await Promise.all([decide('B', R.R13.t, R.R13.id, 'approve', {}), decide('D', R.R13.t, R.R13.id, 'reject', { comment: 'QA PA reject race' })]);
const a13 = (await ticketApprovals('A', R.R13.t)).list.find(x => x.id === R.R13.id);
P('E20', [x1.s, x2.s].filter(s => s < 300).length === 1, `B approve ${E(x1)} | D reject ${E(x2)} | final ${a13?.status} by ${nm(a13?.decided_by)}`);
// E21
const [y1, y2] = await Promise.all([decide('B', R.R15.t, R.R15.id, 'approve', {}), decide('B', R.R15.t, R.R15.id, 'approve', {})]);
const act15 = await api.B('GET', `/desk/tickets/${R.R15.t}/approvals/${R.R15.id}/activity`); const nDec = (act15.t.match(/approval\.approved/g) || []).length;
P('E21', [y1.s, y2.s].some(s => s < 300) && nDec <= 1, `two approve calls -> ${E(y1)} / ${E(y2)}; approved events ${nDec}`);
// A14
const tm = await api.O('GET', '/desk/teams/' + ST.TEAM); o.teamShape = Object.keys(tm.j?.data || {}).join(',');
if (R.R6) {
  const up = await api.O('PUT', '/desk/teams/' + ST.TEAM, { name: 'QA PA Team', description: 'QA PA NDC-2871, delete after', department_id: ST.D1, sources: [{ kind: 'agent', ref_id: U.B }], color: 'blue', icon: 'star' }); o.teamUpdate = E(up);
  await sleep(2000);
  const a14d = await decide('D', R.R6.t, R.R6.id, 'approve', {}); const a14b = await decide('B', R.R6.t, R.R6.id, 'approve', {});
  P('A14', up.s < 300 && a14d.s >= 400 && a14b.s < 300, `team now B only (${E(up)}); D (removed) approve -> ${E(a14d)}; B (added) approve -> ${E(a14b)}`);
}
// B3/B4
const b3 = await inbox('B', { list: 'decided', page_size: 100 }); const decd = (b3.d?.approvals || []).filter(x => /QA PA/.test(JSON.stringify(x)));
const order = decd.map(x => x.approval?.decided_at || x.approval?.cancelled_at || x.requested_at); const newestFirst = order.every((v, i) => !i || order[i - 1] >= v);
P('B3', decd.length >= 5 && newestFirst, `B decided QA PA items ${decd.length}, statuses ${JSON.stringify([...new Set(decd.map(x => x.status))])}, newest first ${newestFirst}`);
const b4 = await inbox('S', { list: 'decided', page_size: 100 }); P('B4', !(b4.d?.approvals || []).some(x => x.department_id === ST.D1), `S decided has D1 items: ${(b4.d?.approvals || []).some(x => x.department_id === ST.D1)}`);
// B9
const w = (await inbox('B', { list: 'waiting', page_size: 100 })).d?.approvals || []; const wr = w.map(x => x.requested_at); const rq = (await inbox('A', { list: 'requested', page_size: 100 })).d?.approvals || []; const rr = rq.map(x => x.requested_at);
P('B9', wr.every((v, i) => !i || wr[i - 1] <= v) && rr.every((v, i) => !i || rr[i - 1] >= v), `waiting oldest first ${wr.every((v, i) => !i || wr[i - 1] <= v)} (${w.length}); requested newest first ${rr.every((v, i) => !i || rr[i - 1] >= v)} (${rq.length})`);
// B10
const b10 = {}; for (const s of ['number', '-number', 'waiting', '-waiting', 'department', '-department', 'requested_at', '-requested_at', 'requester']) { const r = await inbox('O', { list: 'all_pending', sort: s, page_size: 100 }); b10[s] = r.s + ' ' + (r.d?.approvals || []).map(x => x.ticket_number || 'wf').slice(0, 8).join(','); }
o.B10 = b10;
// C1
const c1m = await inbox('O', { list: 'all_pending', source: 'manual', page_size: 100 }); const c1w = await inbox('O', { list: 'all_pending', source: 'web_form', page_size: 100 }); const c1mb = await inbox('O', { list: 'all_pending', source: 'manual,blueprint', page_size: 100 });
P('C1', (c1m.d?.approvals || []).every(x => x.source === 'manual') && (c1w.d?.approvals || []).every(x => x.source === 'web_form') && (c1w.d?.approvals || []).length > 0, `manual ${(c1m.d?.approvals || []).length}; web_form ${(c1w.d?.approvals || []).length}; manual,blueprint ${(c1mb.d?.approvals || []).length} sources ${JSON.stringify([...new Set((c1mb.d?.approvals || []).map(x => x.source))])}`);
// C2
const c2d = await inbox('O', { list: 'all_pending', department_id: ST.D2, page_size: 100 }); const c2o = await inbox('O', { list: 'all_pending', waiting: 'overdue', page_size: 100 });
const c2 = { dept2: (c2d.d?.approvals || []).every(x => x.department_id === ST.D2) + ' n=' + (c2d.d?.approvals || []).length, overdue: (c2o.d?.approvals || []).every(x => x.overdue) + ' n=' + (c2o.d?.approvals || []).length };
for (const wv of ['over_4h', '4h', 'over_1d', '1d', '3d', 'any']) { const r = await inbox('O', { list: 'all_pending', waiting: wv }); c2['waiting=' + wv] = r.s + ' n=' + (r.d?.approvals || []).length; }
for (const [k, v] of [['requested_by', U.A], ['approver_id', U.D], ['priority', 'high'], ['form_id', ST.FORM], ['from', '2026-11-24']]) { const r = await inbox('O', { list: 'all_pending', [k]: v, page_size: 100 }); c2[k] = r.s + ' n=' + (r.d?.approvals || []).length; }
o.C2 = c2;
// C6..C11
const num = (await inbox('O', { list: 'all_pending', page_size: 100 })).d?.approvals?.find(x => x.id === R.R16.id)?.ticket_number;
const s = async q => (await inbox('O', { list: 'all_pending', q, page_size: 100 })).d?.approvals || [];
const c6a = await s(String(num)), c6b = await s('#' + num);
P('C6', c6a.some(x => x.id === R.R16.id) && c6b.some(x => x.id === R.R16.id), `"${num}" -> ${c6a.length} (has ${c6a.some(x => x.id === R.R16.id)}); "#${num}" -> ${c6b.length} (has ${c6b.some(x => x.id === R.R16.id)})`);
const c7 = { subject: (await s('QA PA T16')).some(x => x.id === R.R16.id), email: (await s('qapa@gmail')).some(x => x.id === R.R16.id), approvalSubject: (await s('R16 request')).some(x => x.id === R.R16.id), submitterEmail: (await s('mmohamed@anyware')).length };
P('C7', c7.subject && c7.email && c7.approvalSubject, JSON.stringify(c7));
const c8 = await s('عربي'); P('C8', c8.some(x => x.id === R.R18?.id), `"عربي" -> ${c8.length}, has R18 ${c8.some(x => x.id === R.R18?.id)}`);
const c10 = {}; for (const [k, v] of Object.entries({ script: '<script>alert(1)</script>', sql: "' OR 1=1 --", emoji: '👍', long: 'x'.repeat(10000), spaces: '   ', html: '<b>bold</b>' })) { const r = await inbox('O', { list: 'all_pending', q: v }); c10[k] = r.s + ' n=' + (r.d?.approvals || []).length; }
P('C10', Object.values(c10).every(v => +v.slice(0, 3) < 500) && !/^200 n=[1-9]/.test(c10.sql), JSON.stringify(c10));
const c3 = await inbox('B', { list: 'waiting', approver_id: U.D }); o.C3 = `B with approver_id=D -> ${c3.s} n=${(c3.d?.approvals || []).length}`;
const d6 = await api.O('GET', `/desk/tickets/${R.R7.t}/approvals/${R.R7.id}/activity`); o.D6 = d6.s + ' ' + (d6.t.match(/approval\.[a-z_]+/g) || []).join(',');
P('F2', a1?.status === 'approved' && a5?.status === 'rejected', 'decisions made via the page API show on the ticket Approval tab');
// B14
const del = await api.O('DELETE', `/modules/${T}/records/${R.R3.t}`); await sleep(3000);
const b14 = await api.B('GET', '/desk/approvals/' + R.R3.id); const b14w = (await inbox('B', { list: 'waiting', page_size: 100 })).d?.approvals?.some(x => x.id === R.R3.id);
P('B14', del.s < 300 && !b14w, `delete T03 ${E(del)}; still in B waiting ${b14w}; detail -> ${b14.s} ${JSON.stringify(b14.j?.data?.item ? { status: b14.j.data.item.status, reason: b14.j.data.item.approval?.cancel_reason } : b14.j?.error?.code)}`);
saveState(); return o;
