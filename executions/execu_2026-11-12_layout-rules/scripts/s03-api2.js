// Re-run probes with status disabled (one ACTIVE rule per primary field per layout)
const mid = await modId(); const lid = I.layout; const T = 'qa_lr_type';
const base = (name, extra = {}) => ({ name: P + ' ' + name, description: 'qa', layoutId: lid, primaryField: T, status: 'disabled', branches: [br(eq(T, 'Refund'), [show(['qa_lr_order']), req(['qa_lr_order'])])], ...extra });
const det = x => x.s + (x.s >= 300 ? ' ' + JSON.stringify(x.j?.error?.details || x.j?.error?.code).slice(0, 160) : '');
const tryDel = async (b) => { const x = await mkRule(mid, b); const s = det(x); if (x.s < 300) await delRule(mid, x.j.data.id); return { s, x }; };
// C3
const nl = {};
for (const n of [1, 100, 101, 120, 121, 200, 201, 255, 256]) nl[n] = (await tryDel({ ...base('x'), name: (P + ' ' + 'n'.repeat(400)).slice(0, n) })).s;
nl.spaces = (await tryDel({ ...base('x'), name: '    ' })).s;
{ const t = await mkRule(mid, { ...base('x'), name: '  ' + P + ' trim  ' }); nl.trim = t.s < 300 ? JSON.stringify(t.j.data.name) : det(t); if (t.s < 300) await delRule(mid, t.j.data.id); }
RES('C3', /^4/.test(nl.spaces) ? 'INFO' : 'FAIL', 'name: ' + JSON.stringify(nl));
// C4 duplicate name, different primary
const d1 = await mkRule(mid, { ...base('dupname'), primaryField: 'qa_lr_tier', status: 'active', branches: [br(eq('qa_lr_tier', 'Gold'), [show(['qa_lr_note'])])] });
const d2 = await mkRule(mid, { ...base('dupname'), primaryField: 'qa_lr_vip', status: 'active', branches: [br(eq('qa_lr_vip', true), [show(['qa_lr_reason'])])] });
RES('C4', 'INFO', 'same name, same layout, other primary: first ' + det(d1) + ', second ' + det(d2));
for (const x of [d1, d2]) if (x.s < 300) await delRule(mid, x.j.data.id);
// C5
const dl = {}; for (const n of [500, 1000, 1001]) dl[n] = (await tryDel({ ...base('x'), description: 'd'.repeat(n) })).s;
RES('C5', 'INFO', 'description max 1000: ' + JSON.stringify(dl));
// C16
const c16 = await mkRule(mid, { ...base('inactive') }); RES('C16', c16.s < 300 && c16.j.data.status === 'disabled' ? 'PASS' : 'FAIL', 'status disabled -> ' + det(c16) + ' (API word is "disabled", UI says Inactive)'); I.c16 = c16.j?.data?.id; SAVE();
// H2 same primary field, two active rules
const h2 = await mkRule(mid, { ...base('h2'), status: 'active' }); RES('H2', h2.s >= 400 ? 'PASS' : 'FAIL', 'second ACTIVE rule on same primary field -> ' + det(h2) + '. A disabled one is allowed: ' + (c16.s < 300)); if (h2.s < 300) await delRule(mid, h2.j.data.id);
// switching the disabled duplicate to active
const g16 = (await getRule(mid, I.c16)).j.data; const on = await putRule(mid, I.c16, { ...g16, status: 'active' }); RES('H2b', on.s >= 400 ? 'PASS' : 'FAIL', 'activate a disabled duplicate-primary rule -> ' + det(on));
// I6/I7/I8
const many = n => Array.from({ length: n }, (_, i) => br(eq(T, ['Refund', 'Question', 'Partner', 'Other'][i % 4]), [show(['qa_lr_note'])]));
const rows = n => ({ op: 'and', children: [eq(T, 'Refund')].concat(Array.from({ length: n - 1 }, (_, i) => ({ op: 'gt', field: 'qa_lr_amount', value: i }))) });
const acts = n => Array.from({ length: n }, () => show(['qa_lr_note']));
const lim = {};
for (const n of [25, 26]) lim['branches' + n] = (await tryDel({ ...base('b' + n), branches: many(n) })).s;
for (const n of [5, 6, 10, 11, 20, 21]) lim['rows' + n] = (await tryDel({ ...base('r' + n), branches: [br(rows(n), [show(['qa_lr_note'])])] })).s;
for (const n of [25, 26, 40, 41, 50, 51]) lim['actions' + n] = (await tryDel({ ...base('a' + n), branches: [br(eq(T, 'Refund'), acts(n))] })).s;
RES('I6', 'INFO', 'limits: ' + JSON.stringify(lim));
// I4 rules per layout: create disabled rules until refused
let made = [], lastErr = '';
for (let i = 0; i < 60; i++) { const x = await mkRule(mid, { ...base('cap ' + i) }); if (x.s >= 300) { lastErr = det(x); break; } made.push(x.j.data.id); }
const cnt = (await rules(mid, '?layoutId=' + lid)).length;
RES('I4', 'INFO', 'created ' + made.length + ' extra disabled rules before refusal; rules on layout ' + cnt + '; refusal: ' + (lastErr || 'none up to 60'));
for (const id of made) await delRule(mid, id);
// K1 XSS stored
const xss = '<img src=x onerror=alert(1)>';
const kx = await mkRule(mid, { ...base('xss ' + xss), description: xss, primaryField: 'qa_lr_filter', status: 'active', branches: [br(eq('qa_lr_filter', 'W'), [show(['qa_lr_reason'])])] }); I.xss = kx.j?.data?.id; SAVE();
RES('K1a', 'INFO', 'XSS rule ' + det(kx) + ' stored name ' + JSON.stringify(kx.j?.data?.name));
// K3 DELETE through another module
const other = arr((await api('GET', '/modules')).j.data).find(x => x.moduleKey === (APP === 'crm' ? 'contacts' : 'desk_contacts'));
const kd = await api('DELETE', '/modules/' + other.id + '/layout-rules/' + I.c1); const still = await getRule(mid, I.c1);
RES('K3', kd.s === 404 ? 'PASS' : (still.s === 200 ? 'FAIL' : 'FAIL'), 'DELETE /modules/<other module>/layout-rules/<rule> -> ' + kd.s + ' (rule still there: ' + (still.s === 200) + '). GET and PUT through the other module give 404.');
const ub = {}; ub.rows300 = (await tryDel({ ...base('r300'), branches: [br(rows(300), [show(['qa_lr_note'])])] })).s; ub.actions500 = (await tryDel({ ...base('a500'), branches: [br(eq(T, 'Refund'), acts(500))] })).s; RES('I7', 'INFO', 'upper bound: ' + JSON.stringify(ub));
return 'done';
