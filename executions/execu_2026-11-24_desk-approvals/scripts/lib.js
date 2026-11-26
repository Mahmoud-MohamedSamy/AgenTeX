// Shared constants and helpers (prepended by multi.js). Everything made here starts with "QA PA ".
const T = '88e8ea44-1658-4df3-9930-d0902b91073d', STD_LAYOUT = '1b55c25d-eb27-4046-afd1-b292398b435b';
const U = { O: '97be04b6-0a08-4883-aa51-e1650b11cab7', A: '876ce871-2b02-4854-89a7-68050391c62b', B: '9d182dfa-05f3-4af7-9685-8615a2fbe537', D: 'e82f62cb-9904-42c7-a13c-77a7449820b9', S: '23f0f9d7-2fc0-429b-9334-9933fe5c429b' };
const L = { O: 'ndc-staging-owner', A: 'Test User 1', B: 'Customer Experience Specialists 2', D: 'QA Team 1', S: 'Mahmoud TAVIPortal' };
const TECH_FORM = 'ea8a3838-2d86-4f33-ba1b-afb7ab3a8b77';
const QA_EMAIL = 'mahmoud.mmohamedsamy+qapa@gmail.com';
const ST = fs.existsSync(RUN + '/out/state.json') ? JSON.parse(fs.readFileSync(RUN + '/out/state.json', 'utf8')) : {};
const saveState = () => fs.writeFileSync(RUN + '/out/state.json', JSON.stringify(ST, null, 1));
const api = { O: as(L.O), A: as(L.A), B: as(L.B), D: as(L.D), S: as(L.S) };
const errOf = r => r.s >= 300 ? ((r.j && r.j.error && (r.j.error.code + ' ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || ''))) || r.t).slice(0, 400) : undefined;
const E = r => r.s + (r.s >= 300 ? ' ' + errOf(r) : '');
async function mkTicket(who, subject, vals = {}) {
  const v = { subject, status: 'Open', department: ST.D1, email: QA_EMAIL, channel: 'web', priority: 'medium', ...vals };
  const r = await api[who]('POST', `/modules/${T}/records`, { data: Object.entries(v).filter(([k, x]) => x !== undefined).map(([field, x]) => ({ field, value: enc(x) })), layout_id: STD_LAYOUT });
  const id = r.j && r.j.data && r.j.data.id; if (id) { ledger(`ticket "${subject}" ${id}`); (ST.tickets = ST.tickets || {})[subject] = id; saveState(); }
  return { s: r.s, id, err: errOf(r), num: r.j?.data?.ticket_number || r.j?.data?.display_number };
}
const getTicket = async (id, who = 'O') => { const r = await api[who]('GET', `/modules/${T}/records/${id}`); const o = {}; for (const x of ((r.j && r.j.data && r.j.data.data) || [])) o[x.field] = dec(x.value); o._s = r.s; return o; };
const inbox = async (who, q = {}) => { const qs = new URLSearchParams(q).toString(); const r = await api[who]('GET', '/desk/approvals' + (qs ? '?' + qs : '')); return { s: r.s, d: r.j?.data, err: errOf(r) }; };
const reqApproval = (who, tid, body) => api[who]('POST', `/desk/tickets/${tid}/approvals`, { subject: 'QA PA request', description: 'QA PA please approve', ...body });
const ticketApprovals = async (who, tid) => { const r = await api[who]('GET', `/desk/tickets/${tid}/approvals`); return { s: r.s, list: arr(r.j?.data?.approvals || r.j?.data), raw: r }; };
const decide = (who, tid, aid, verb, body = {}) => api[who]('POST', `/desk/tickets/${tid}/approvals/${aid}/${verb}`, body);
async function waitFor(fn, sec = 40, every = 2500) { const end = Date.now() + sec * 1000; let last; while (Date.now() < end) { last = await fn(); if (last) return last; await sleep(every); } return null; }
const ids = l => (l || []).map(x => x.id);
