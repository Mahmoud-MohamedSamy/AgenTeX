const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', MKT = '2a73bbc0-efb3-4250-bf9b-2fdc98236794', SAL = 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94', HR = '08fd8684-c5c0-4d4d-86f9-2be70cf61e53';
const U = { B: '3445ec4a-020e-4f12-b156-dd2de7610164', C: '9d182dfa-05f3-4af7-9685-8615a2fbe537', D: '876ce871-2b02-4854-89a7-68050391c62b', E: '23f0f9d7-2fc0-429b-9334-9933fe5c429b' }; const TEAM = '9e444340-ef59-455b-80a1-16b321592447';
const spec = { MK1: [MKT, U.B], MK2: [MKT, null], SA1: [SAL, U.B], HR1: [HR, null], CSC: [CS, U.C], CSD: [CS, U.D], CSE: [CS, U.E], CSU: [CS, null], CST: [CS, null, TEAM], SH1: [MKT, U.B], SH2: [MKT, U.B], MV1: [MKT, U.B], MV2: [CS, U.C], MV3: [MKT, U.B] };
out.T = {};
for (const [k, [d, o, t]] of Object.entries(spec)) { const f = { subject: 'QA AC ' + k + ' access run', department: d, status: 'Open', email: 'qa-ac-c1@example.com', channel: 'phone', description: 'QA AC access run 17 Nov ' + k }; if (o) f.owner = o; if (t) f.team = t; const r = await mk(TM, 'ticket', 'QA AC ' + k, f); out.T[k] = r.id || ('ERR ' + r.s + ' ' + r.err); }
// check owner/team stuck
out.chk = {}; for (const k of ['MK1', 'CSD', 'CST', 'CSU']) { const g = await get(TM, out.T[k]); out.chk[k] = [g.owner, g.team, g.department, g.ticket_number].join(' | '); }
// comment on MK1 for leak tests
const c = await api('POST', '/desk/tickets/' + out.T.MK1 + '/comments', { content: 'QA AC private comment on MK1', is_private: true, visibility: 'private' }); out.cmt = c.s + ' ' + c.t.slice(0, 200);
return fin({ out });
