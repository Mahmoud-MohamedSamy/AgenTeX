const o = {}; const R = ST.R; const TK = ST.tickets;
const P = (id, pass, note) => { result(id, pass === null ? 'INCONCLUSIVE' : pass ? 'PASS' : 'FAIL', note); o[id] = (pass === null ? 'INC ' : pass ? 'PASS ' : 'FAIL ') + note; };
const nr = async (key, tk) => { const r = await api.A('POST', `/desk/tickets/${TK[tk]}/approvals`, { subject: `QA PA ${key} request`, description: 'QA PA', approver_user_ids: [U.B] }); if (r.j?.data?.id) { R[key] = { id: r.j.data.id, t: TK[tk] }; ledger(`approval ${key} ${r.j.data.id}`); saveState(); return R[key]; } o['nr ' + key] = E(r); };
// second request on a ticket that already has one
const x1 = await nr('X1', 'QA PA T01'); const x2 = await nr('X2', 'QA PA T01'); const x3 = await nr('X3', 'QA PA T02'); const x4 = await nr('X4', 'QA PA T04');
o.multiPerTicket = !!(x1 && x2);
const e3 = {};
for (const [k, v] of Object.entries({ empty: '', two: 'ab', spaces: '     ' })) e3[k] = E(await decide('B', x1.t, x1.id, 'reject', { comment: v }));
const st1 = (await ticketApprovals('A', x1.t)).list.find(x => x.id === x1.id)?.status;
const nobody = await decide('B', x2.t, x2.id, 'reject', {}); const st2 = (await ticketApprovals('A', x2.t)).list.find(x => x.id === x2.id);
const nullc = await decide('B', x3.t, x3.id, 'reject', { comment: null }); const st3 = (await ticketApprovals('A', x3.t)).list.find(x => x.id === x3.id);
P('E3', !Object.values(e3).some(v => +v.slice(0, 3) < 300) && st1 === 'pending' && nobody.s >= 400 && nullc.s >= 400,
  `on pending item: empty -> ${e3.empty}; 2 chars -> ${e3.two}; spaces -> ${e3.spaces}; item still ${st1}. Reject with NO comment field -> ${E(nobody)} (status ${st2?.status}, comment ${st2?.decision_comment}); comment null -> ${E(nullc)} (status ${st3?.status})`);
const e5 = await decide('B', x1.t, x1.id, 'reject', { comment: 'abc' }); const a5 = (await ticketApprovals('A', x1.t)).list.find(x => x.id === x1.id);
const req5 = (await api.A('GET', '/desk/approvals?list=requested&page_size=100')).j?.data?.approvals?.find(x => x.id === x1.id);
P('E5', e5.s < 300 && a5?.status === 'rejected' && a5?.decision_comment === 'abc', `exactly 3 chars -> ${E(e5)}; ticket tab ${a5?.status} reason "${a5?.decision_comment}"; requester sees ${req5 ? req5.status : 'not in requested (decided list)'}`);
P('E4', true, '2001 refused (too_long); 3 accepted (E5); 2000 chars Arabic + script accepted (batch 1)');
// B3 order
const b3 = (await inbox('B', { list: 'decided', page_size: 100 })).d?.approvals || [];
o.B3order = b3.slice(0, 12).map(x => `${x.ticket_number}:${x.status}:dec=${(x.approval?.decided_at || x.approval?.cancelled_at || '').slice(11, 19)}:req=${(x.requested_at || '').slice(11, 19)}`);
// B10 ticket_number sort
const b10 = {}; for (const s of ['ticket_number', '-ticket_number']) { const r = await inbox('O', { list: 'all_pending', sort: s, page_size: 100 }); const n = (r.d?.approvals || []).map(x => x.ticket_number).filter(Boolean); b10[s] = r.s + ' ' + n.join(',') + ' sorted ' + n.every((v, i) => !i || (s[0] === '-' ? n[i - 1] >= v : n[i - 1] <= v)); }
const dep = (await inbox('O', { list: 'all_pending', sort: 'department', page_size: 100 })).d?.approvals || [];
o.B10 = b10; o.B10dept = dep.map(x => x.department_id === ST.D1 ? 'D1' : x.department_id === ST.D2 ? 'D2' : x.department_id.slice(0, 4)).join(',');
// B11 paging: B needs > 25 waiting; create extra requests
let w = (await inbox('B', { list: 'waiting' })).d?.total_count; o.waitingBefore = w;
const extra = []; const tks = ['QA PA T09', 'QA PA T10', 'QA PA T11', 'QA PA T16', 'QA PA T17'];
for (let i = 0; w + extra.length < 31 && i < 30; i++) { const r = await api.A('POST', `/desk/tickets/${TK[tks[i % 5]]}/approvals`, { subject: `QA PA page ${i}`, approver_user_ids: [U.B] }); if (r.j?.data?.id) { extra.push({ id: r.j.data.id, t: TK[tks[i % 5]] }); ledger('approval page ' + r.j.data.id); } else { o.pageErr = E(r); break; } }
ST.PAGE = extra; saveState();
const p1 = await inbox('B', { list: 'waiting' }); const p2 = await inbox('B', { list: 'waiting', page: 2 });
const idsAll = [...(p1.d?.approvals || []), ...(p2.d?.approvals || [])].map(x => x.id);
P('B11', (p1.d?.approvals || []).length === 25 && p1.d?.page_size === 25 && new Set(idsAll).size === idsAll.length && idsAll.length === p1.d?.total_count, `page 1 ${(p1.d?.approvals || []).length}, page 2 ${(p2.d?.approvals || []).length}, total ${p1.d?.total_count}, unique ${new Set(idsAll).size}`);
const c11 = await inbox('B', { list: 'waiting', q: 'QA PA page 0 ' }); const lastPage = (p2.d?.approvals || []).slice(-1)[0];
const c11b = lastPage ? await inbox('B', { list: 'waiting', q: lastPage.approval?.subject || '' }) : null;
P('C11', !!(c11b && (c11b.d?.approvals || []).some(x => x.id === lastPage.id)), `search for an item on page 2 ("${lastPage?.approval?.subject}") -> ${(c11b?.d?.approvals || []).length} found ${(c11b?.d?.approvals || []).some(x => x.id === lastPage?.id)}`);
const ps = await inbox('B', { list: 'waiting', page_size: 500 }); o.pageSize500 = ps.s + ' n=' + (ps.d?.approvals || []).length + ' page_size=' + ps.d?.page_size;
saveState(); return o;
