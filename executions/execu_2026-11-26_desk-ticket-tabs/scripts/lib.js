// Shared constants and helpers (prepended by multi.js). Everything made here starts with "QA TT ".
const T = '88e8ea44-1658-4df3-9930-d0902b91073d', STD_LAYOUT = '1b55c25d-eb27-4046-afd1-b292398b435b';
const QA_EMAIL = 'mmohamed@anyware.software';
const ST = fs.existsSync(RUN + '/out/state.json') ? JSON.parse(fs.readFileSync(RUN + '/out/state.json', 'utf8')) : {};
const saveState = () => fs.writeFileSync(RUN + '/out/state.json', JSON.stringify(ST, null, 1));
const L = { O: 'ndc-staging-owner', C: ST.C_LABEL || 'Customer Experience Specialists 2' };
const api = { O: as(L.O), C: as(L.C) };
const errOf = r => r.s >= 300 ? ((r.j && r.j.error && (r.j.error.code + ' ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || ''))) || r.t).slice(0, 400) : undefined;
const E = r => r.s + (r.s >= 300 ? ' ' + errOf(r) : '');
const TK = id => `/desk/tickets/${id}`;
async function mkTicket(who, subject, vals = {}) {
  const v = { subject, status: 'Open', department: ST.CS, channel: 'web', priority: 'medium', ...vals };
  const r = await api[who]('POST', `/modules/${T}/records`, { data: Object.entries(v).filter(([k, x]) => x !== undefined).map(([field, x]) => ({ field, value: enc(x) })), layout_id: STD_LAYOUT });
  const id = r.j && r.j.data && r.j.data.id; if (id) { ledger(`ticket "${subject}" ${id}`); (ST.tickets = ST.tickets || {})[subject] = id; saveState(); }
  return { s: r.s, id, err: errOf(r), num: r.j?.data?.ticket_number || r.j?.data?.display_number };
}
const getTicket = async (id, who = 'O') => { const r = await api[who]('GET', `/modules/${T}/records/${id}`); const o = {}; for (const x of ((r.j && r.j.data && r.j.data.data) || [])) o[x.field] = dec(x.value); o._s = r.s; return o; };
const history = async (id, who = 'O') => { const r = await api[who]('GET', TK(id) + '/history?page_size=100'); return { s: r.s, items: arr(r.j?.data?.items || r.j?.data?.events || r.j?.data) }; };
async function waitFor(fn, sec = 40, every = 2500) { const end = Date.now() + sec * 1000; let last; while (Date.now() < end) { last = await fn(); if (last) return last; await sleep(every); } return null; }
const short = (o, n = 300) => String(JSON.stringify(o)).slice(0, n);
