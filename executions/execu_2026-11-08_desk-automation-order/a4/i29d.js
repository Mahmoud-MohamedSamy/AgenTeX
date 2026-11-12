const s = JSON.parse(fs.readFileSync('../a4/i29.json'));
const r = await api('GET', '/desk/hq/ratings?take=20'); const L = arr(r.j?.data || r.j?.data?.items);
log('ratings', r.s, JSON.stringify(L.filter(x => JSON.stringify(x).includes(s.ticket) || JSON.stringify(x).includes('3194')).map(x => ({ v: x.rating || x.value || x.key, at: x.created_at || x.rated_at, t: x.ticket_number }))), 'total', L.length, L[0] ? Object.keys(L[0]).join(',') : '');
const inv = await api('POST', '/iam/users/invitations/f56966bb-4d14-4de1-b244-afa4f1cefc27/resend', {}); log('resend', inv.s, inv.s >= 300 ? inv.t.slice(0, 200) : '');
const u = arr((await api('GET', '/iam/users?search=WF%20Agent')).j?.data).map(x => x.status); log('agent', u);
