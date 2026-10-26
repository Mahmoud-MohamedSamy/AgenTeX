// ---- activities/replies run helpers (26 Oct 2026). Every created id is returned in CREATED so the caller writes the ledger.
const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'; const QA_EMAIL = 'mmohamed@anyware.software'; const QA_CC = 'mahmoud.mmohamedsamy@gmail.com';
const CREATED = [];
const fl = r => { const o = { id: r.id }; for (const x of (r.data || [])) o[x.field] = x.value && x.value.kind === 'array' ? (x.value.items || []).map(i => i.value) : (x.value && x.value.value !== undefined ? x.value.value : x.value); return o; };
const recOf = async (k, id) => { const r = await api('GET', `/modules/${M[k]}/records/${id}`); return { s: r.s, o: r.j && r.j.data ? fl(r.j.data) : null, raw: r }; };
const mk = async (k, vals, tag) => { const r = await mkRec(M[k], vals); if (r.id) CREATED.push({ k, id: r.id, tag }); return r; };
const patch = async (k, id, vals) => api('PATCH', `/modules/${M[k]}/records/${id}`, { data: Object.entries(vals).map(([f, v]) => ({ field: f, value: enc(v) })) });
const iso = ms => new Date(Date.now() + ms).toISOString();
const H1 = 3600e3, D1 = 86400e3;
const fin = extra => done({ R, CREATED, ...(extra || {}) });
