const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const o = {}; const DD = J.DD;
J.t = {};
J.t.K1 = await mkT('tk', 'K1 owned by owner', { owner: OWNER });
J.t.K2 = await mkT('tk', 'K2 owned by CES2', { owner: AG_A });
J.t.K3 = await mkT('tk', 'K3 owned by owner refusal repeat', { owner: OWNER });
for (const k of ['SF', 'SR', 'SX', 'SN']) J.t[k] = await mkT('sh', k + ' owned by owner', { owner: OWNER }, DD);
J.t.XF = await mkT('xdf', 'XF owned by owner', { owner: OWNER }, DD);
J.t.XR = await mkT('xdr', 'XR owned by owner', { owner: OWNER }, DD);
fs.writeFileSync(RUN + '/scripts/b2/3065.json', JSON.stringify(J, null, 1));
for (const [k, id] of Object.entries(J.t)) { const x = await waitIn(id, 30); const t = (await api('GET', '/desk/tickets/' + id)).j?.data || {}; o[k] = '#' + t.ticket_number + ' st=' + t.status + ' dept=' + (t.department_id === CS ? 'CS' : t.department_id === DD ? 'DD' : t.department_id) + ' bp=' + (x ? (x.stateId || x.state_id || JSON.stringify(x).slice(0, 60)) : 'NONE'); }
// shares as configured
const P = id => '/desk/tickets/' + id + '/shares';
o.shSF = E(await api('PUT', P(J.t.SF), { shares: [{ department_id: CS, access: 'full' }] }));
o.shSR = E(await api('PUT', P(J.t.SR), { shares: [{ department_id: CS, access: 'read_only' }] }));
o.shSX = E(await api('PUT', P(J.t.SX), { shares: [{ department_id: CS, access: 'restricted' }] }));
LED('shares set: SF #' + o.SF + ' CS full; SR CS read_only; SX CS restricted; SN none');
for (const k of ['SF', 'SR', 'SX', 'SN', 'XF', 'XR']) { const g = await api('GET', P(J.t[k])); o['get' + k] = E(g) + ' ' + JSON.stringify(L(g.j?.data).map(x => [x.department_id === CS ? 'CS' : x.department_id, x.access, x.source || x.origin || x.kind || ''])).slice(0, 200); }
J.n = Object.fromEntries(Object.entries(o).filter(([k]) => J.t[k]).map(([k, v]) => [k, v.split(' ')[0]]));
fs.writeFileSync(RUN + '/scripts/b2/3065.json', JSON.stringify(J, null, 1));
return o;
