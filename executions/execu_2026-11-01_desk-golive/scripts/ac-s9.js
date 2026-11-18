const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', MKT = '2a73bbc0-efb3-4250-bf9b-2fdc98236794';
const U = { B: '3445ec4a-020e-4f12-b156-dd2de7610164', C: '9d182dfa-05f3-4af7-9685-8615a2fbe537' };
const spec = { MV2: [CS, U.C], MV3: [MKT, U.B] }; out.T = {};
for (const [k, [d, o]] of Object.entries(spec)) { const r = await mk(TM, 'ticket', 'QA AC ' + k, { subject: 'QA AC ' + k + ' access run', department: d, status: 'Open', email: 'qa-ac-c1@example.com', channel: 'phone', description: 'QA AC access run 17 Nov ' + k, owner: o }); out.T[k] = r.id || ('ERR ' + r.s + ' ' + r.err); }
const ids = { MK1: '43d637c7-140c-4e70-8033-16bd2a4f4cf9', CSD: '27146cf7-5d12-4fb4-b118-87d7b06c31e3', CST: '51010fcc-7f0f-4c31-8906-c336abc18841', CSU: 'd2dcb7fb-faf9-4d59-97cb-3edb5ccc2715' };
out.chk = {}; for (const [k, id] of Object.entries(ids)) { const g = await get(TM, id); out.chk[k] = [g.owner, g.team, g.department, g.ticket_number].join(' | '); }
const c = await api('POST', '/desk/tickets/' + ids.MK1 + '/comments', { content: 'QA AC private comment on MK1', is_private: true }); out.cmt = c.s + ' ' + c.t.slice(0, 200);
return fin({ out });
