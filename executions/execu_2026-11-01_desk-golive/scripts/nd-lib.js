// Wave 2 NDC helpers (appended after prelude). Every created object is pushed to CREATED.
const T='88e8ea44-1658-4df3-9930-d0902b91073d', CM='43004ce2-577f-4eda-b00a-0750fe40c3d4', DQ='2a73bbc0-efb3-4250-bf9b-2fdc98236794', DS='ef8dc91f-1d30-491d-a1fc-9b62b96eca94', DCS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', ME='97be04b6-0a08-4883-aa51-e1650b11cab7', UB='3445ec4a-020e-4f12-b156-dd2de7610164', UC='9d182dfa-05f3-4af7-9685-8615a2fbe537', CON='183dc191-e233-4dba-a828-d1945358863d';
const CREATED = [];
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'string', value: String(v) };
const body = vals => ({ data: Object.entries(vals).map(([f, v]) => ({ field: f, value: enc(v) })) });
const fl = r => { const o = { id: r.id }; for (const x of (r.data || [])) { const v = x.value || {}; o[x.field] = v.kind === 'array' ? (v.items || []).map(i => i.value) : v.value !== undefined ? v.value : (v.kind === 'null' ? null : v); } return o; };
const mkRec = async (mod, vals, tag) => { const r = await api('POST', `/modules/${mod}/records`, body(vals)); const id = r.j && r.j.data && (r.j.data.id || (r.j.data.record && r.j.data.record.id)); if (id) CREATED.push({ k: mod === T ? 'ticket' : mod === CM ? 'contact' : mod, id, tag }); return { s: r.s, id, e: r.j && r.j.error, raw: r.t.slice(0, 300) }; };
const getRec = async (mod, id) => { const r = await api('GET', `/modules/${mod}/records/${id}`); return { s: r.s, o: r.j && r.j.data ? fl(r.j.data) : null }; };
const patchRec = async (mod, id, vals) => api('PATCH', `/modules/${mod}/records/${id}`, body(vals));
const short = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 160) : undefined });
const fin = extra => done({ R, CREATED, ...(extra || {}) });
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 260) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 260) : undefined });
const wfx = async id => { const r = await api('GET', '/workflow/executions?recordId=' + id); return r.s + ' ' + JSON.stringify(arr(r.j && r.j.data).map(x => [x.ruleName || x.rule_name || x.ruleId, x.status])).slice(0, 300); };
