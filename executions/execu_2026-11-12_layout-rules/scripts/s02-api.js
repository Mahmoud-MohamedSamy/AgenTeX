// API contract cases (owner). Writes only QA LR1112 rules on the QA layout.
const mid = await modId(); const lid = I.layout; const T = 'qa_lr_type';
const base = (name, extra = {}) => ({ name: P + ' ' + name, description: 'qa', layoutId: lid, primaryField: T, branches: [br(eq(T, 'Refund'), [show(['qa_lr_order']), req(['qa_lr_order'])])], ...extra });
const tryRule = async (name, extra) => { const r = await mkRule(mid, base(name, extra)); return r; };
// C1
let r = await tryRule('basic'); const c1 = r.j?.data;
if (r.s < 300) { const g = await getRule(mid, c1.id); const d = g.j.data; RES('C1', d.rowVersion === 1 && d.primaryField === T && d.branches.length === 1 ? 'PASS' : 'FAIL', 'POST ' + r.s + '; GET rowVersion ' + d.rowVersion + ', status ' + d.status + ', branches ' + JSON.stringify(d.branches).slice(0, 200)); I.c1 = c1.id; SAVE(); }
else { RES('C1', 'FAIL', 'create refused ' + SR(r)); return 'stop'; }
// C2 API side: missing pieces
const miss = {};
for (const [k, b] of Object.entries({ noName: { ...base('x'), name: '' }, noLayout: { ...base('x'), layoutId: null }, noPrimary: { ...base('x'), primaryField: null }, noBranches: { ...base('x'), branches: [] }, noActions: { ...base('x'), branches: [br(eq(T, 'Refund'), [])] }, noTargets: { ...base('x'), branches: [br(eq(T, 'Refund'), [show([])])] } })) { const x = await mkRule(mid, b); miss[k] = x.s + ' ' + (x.j?.error?.code || ''); }
RES('C2', Object.values(miss).every(v => /^4/.test(v)) ? 'PASS' : 'FAIL', 'API: ' + JSON.stringify(miss) + ' (UI messages checked in UI step)');
// C3 name lengths
const nl = {};
for (const n of [1, 100, 101, 120, 121, 255, 256]) { const nm = (P + ' ' + 'n'.repeat(400)).slice(0, n); const x = await mkRule(mid, { ...base('x'), name: nm }); nl[n] = x.s + (x.s >= 300 ? ' ' + (x.j?.error?.details ? JSON.stringify(x.j.error.details).slice(0, 120) : x.j?.error?.code) : ''); if (x.s < 300) await delRule(mid, x.j.data.id); }
const sp = await mkRule(mid, { ...base('x'), name: '    ' }); nl.spaces = sp.s; if (sp.s < 300) await delRule(mid, sp.j.data.id);
const tr = await mkRule(mid, { ...base('x'), name: '  ' + P + ' trim  ' }); nl.trim = tr.s < 300 ? JSON.stringify(tr.j.data.name) : tr.s; if (tr.s < 300) await delRule(mid, tr.j.data.id);
RES('C3', 'INFO', 'name length results ' + JSON.stringify(nl));
// C4 duplicate name same layout
const dup = await mkRule(mid, base('basic')); RES('C4', 'INFO', 'duplicate name same layout -> ' + SR(dup)); if (dup.s < 300) await delRule(mid, dup.j.data.id);
// C5 description
const dl = {}; for (const n of [500, 2000, 65535, 70000]) { const x = await mkRule(mid, { ...base('x'), description: 'd'.repeat(n) }); dl[n] = x.s + (x.s >= 300 ? ' ' + JSON.stringify(x.j?.error?.details || x.j?.error?.code).slice(0, 120) : ''); if (x.s < 300) await delRule(mid, x.j.data.id); }
RES('C5', 'INFO', 'description length ' + JSON.stringify(dl));
// C6 / Z1 / Z2: primary field types via API
const pt = {};
for (const f of ['qa_lr_text', 'qa_lr_amount', 'qa_lr_date', 'qa_lr_email2', 'qa_lr_tags', 'qa_lr_vip', 'qa_lr_tier'].concat(APP === 'crm' ? ['qa_lr_radio'] : [])) { const x = await mkRule(mid, { ...base('pt ' + f), primaryField: f, branches: [br({ op: 'isNotEmpty', field: f }, [show(['qa_lr_note'])])] }); pt[f] = x.s + (x.s >= 300 ? ' ' + (x.j?.error?.details ? JSON.stringify(x.j.error.details).slice(0, 160) : x.j?.error?.code) : ''); if (x.s < 300) await delRule(mid, x.j.data.id); }
RES('Z' + (APP === 'crm' ? '1' : '2'), Object.entries(pt).filter(([k]) => /text|amount|date|email2/.test(k)).every(([, v]) => /^4/.test(v)) ? 'GAP' : 'INFO', 'API primary field by type: ' + JSON.stringify(pt));
// C7 primary field not on this layout
const allF = await fieldsOf(mid); const off = allF.find(f => f.datatypeKey === 'pick_list' && !f.isSystemManaged && (f.layouts || []).length && !(f.layouts || []).some(l => l.layoutId === lid));
if (off) { const x = await mkRule(mid, { ...base('off'), primaryField: off.fieldName, branches: [br(eq(off.fieldName, 'zz'), [show(['qa_lr_note'])])] }); RES('C7', x.s >= 400 ? 'PASS' : 'FAIL', 'primary ' + off.fieldName + ' not on QA layout -> ' + SR(x)); if (x.s < 300) await delRule(mid, x.j.data.id); } else RES('C7', 'BLOCKED', 'no off-layout pick list found');
// C8 condition not testing primary
const c8 = await mkRule(mid, { ...base('c8'), branches: [br(eq('qa_lr_tier', 'Gold'), [show(['qa_lr_note'])])] }); RES('C8', c8.s >= 400 ? 'PASS' : 'FAIL', 'first row on another field -> ' + SR(c8)); if (c8.s < 300) await delRule(mid, c8.j.data.id);
// C16 inactive create
const c16 = await mkRule(mid, { ...base('inactive'), status: 'inactive' }); RES('C16', c16.s < 300 && c16.j.data.status !== 'active' ? 'PASS' : 'FAIL', 'status inactive -> ' + SR(c16) + ' status=' + (c16.j?.data?.status)); I.c16 = c16.j?.data?.id; SAVE();
// C18 Desk: CRM-only action
if (APP === 'desk') { const o = {}; for (const a of [{ type: 'read_only_fields', fields: ['qa_lr_note'] }, { type: 'set_value', field: 'qa_lr_note', value: 'x' }, { type: 'show_message', field: 'qa_lr_note', message: { en: 'x' }, tone: 'info' }]) { const x = await mkRule(mid, { ...base('crmonly'), branches: [br(eq(T, 'Refund'), [a])] }); o[a.type] = SR(x); if (x.s < 300) await delRule(mid, x.j.data.id); } RES('C18', Object.values(o).every(v => /^4/.test(v)) ? 'PASS' : 'FAIL', JSON.stringify(o)); }
// I3 stale rowVersion
const g1 = (await getRule(mid, I.c1)).j.data;
const u1 = await putRule(mid, I.c1, { ...g1, description: 'v2', rowVersion: g1.rowVersion }); const u2 = await putRule(mid, I.c1, { ...g1, description: 'v3-stale', rowVersion: g1.rowVersion });
const g2 = (await getRule(mid, I.c1)).j.data;
RES('I3', u1.s < 300 && u2.s >= 400 && g2.description === 'v2' ? 'PASS' : 'FAIL', 'PUT fresh ' + u1.s + ', PUT stale ' + SR(u2) + ', description now ' + g2.description + ', rowVersion ' + g2.rowVersion);
const nov = await putRule(mid, I.c1, { ...g2, rowVersion: undefined, description: 'no-version' }); RES('I3b', 'INFO', 'PUT without rowVersion -> ' + SR(nov));
// C11 edit bumps version
RES('C11', g2.rowVersion === g1.rowVersion + 1 ? 'PASS' : 'FAIL', 'API edit rowVersion ' + g1.rowVersion + ' -> ' + g2.rowVersion);
// I6 conditions per rule, I7 rows, I8/F27 actions
const many = n => Array.from({ length: n }, (_, i) => br(eq(T, ['Refund', 'Question', 'Partner', 'Other'][i % 4]), [show(['qa_lr_note'])]));
const lim = {};
for (const n of [25, 26, 50, 51]) { const x = await mkRule(mid, { ...base('br' + n), branches: many(n) }); lim['branches' + n] = x.s + (x.s >= 300 ? ' ' + JSON.stringify(x.j?.error?.details || x.j?.error?.code).slice(0, 140) : ''); if (x.s < 300) await delRule(mid, x.j.data.id); }
const rows = n => ({ op: 'and', children: [eq(T, 'Refund')].concat(Array.from({ length: n - 1 }, (_, i) => ({ op: 'gt', field: 'qa_lr_amount', value: i }))) });
for (const n of [5, 6, 10, 11]) { const x = await mkRule(mid, { ...base('rows' + n), branches: [br(rows(n), [show(['qa_lr_note'])])] }); lim['rows' + n] = x.s + (x.s >= 300 ? ' ' + JSON.stringify(x.j?.error?.details || x.j?.error?.code).slice(0, 140) : ''); if (x.s < 300) await delRule(mid, x.j.data.id); }
const acts = n => Array.from({ length: n }, () => show(['qa_lr_note']));
for (const n of [25, 26, 40, 41]) { const x = await mkRule(mid, { ...base('acts' + n), branches: [br(eq(T, 'Refund'), acts(n))] }); lim['actions' + n] = x.s + (x.s >= 300 ? ' ' + JSON.stringify(x.j?.error?.details || x.j?.error?.code).slice(0, 140) : ''); if (x.s < 300) await delRule(mid, x.j.data.id); }
RES('I6', 'INFO', 'limits ' + JSON.stringify(lim));
// K3 cross-module
const other = arr((await api('GET', '/modules')).j.data).find(x => x.moduleKey === (APP === 'crm' ? 'contacts' : 'desk_contacts'));
const k3 = await api('GET', '/modules/' + other.id + '/layout-rules/' + I.c1); const k3b = await api('PUT', '/modules/' + other.id + '/layout-rules/' + I.c1, { ...g2 }); const k3c = await api('DELETE', '/modules/' + other.id + '/layout-rules/' + I.c1);
const still = (await getRule(mid, I.c1)).s;
RES('K3', k3.s === 404 && k3b.s >= 400 && k3c.s >= 400 && still === 200 ? 'PASS' : 'FAIL', 'GET ' + SR(k3) + '; PUT ' + k3b.s + '; DELETE ' + k3c.s + '; rule still ' + still);
// K4 type confusion
const tc = {};
const bad = { nameNum: { ...base('x'), name: 12345 }, branchesObj: { ...base('x'), branches: { a: 1 } }, statusMaybe: { ...base('x'), status: 'maybe' }, unknownAction: { ...base('x'), branches: [br(eq(T, 'Refund'), [{ type: 'explode', fields: ['qa_lr_note'] }])] }, unknownField: { ...base('x'), branches: [br(eq(T, 'Refund'), [show(['qa_nope_zz'])])] }, unknownOp: { ...base('x'), branches: [br({ op: 'xor', field: T, value: 'Refund' }, [show(['qa_lr_note'])])] }, layoutOther: { ...base('x'), layoutId: '00000000-0000-0000-0000-000000000000' } };
for (const [k, b] of Object.entries(bad)) { const x = await mkRule(mid, b); tc[k] = x.s + ' ' + (x.j?.error?.code || ''); if (x.s < 300) await delRule(mid, x.j.data.id); }
RES('K4', Object.values(tc).every(v => /^4/.test(v)) ? 'PASS' : 'FAIL', JSON.stringify(tc));
// K5 huge body
const hb = {}; const hx = await mkRule(mid, { ...base('huge'), branches: many(3000) }); hb.branches3000 = SR(hx).slice(0, 160); if (hx.s < 300) await delRule(mid, hx.j.data.id);
const hm = await mkRule(mid, { ...base('hugedesc'), description: 'x'.repeat(1100000) }); hb.desc1MB = SR(hm).slice(0, 160); if (hm.s < 300) await delRule(mid, hm.j.data.id);
const alive = await api('GET', '/modules/' + mid + '/layout-rules'); RES('K5', /^4/.test(hb.branches3000) && /^4/.test(hb.desc1MB) && alive.s === 200 ? 'PASS' : 'FAIL', JSON.stringify(hb) + ' server after: ' + alive.s);
// K6 read-only keys
const g3 = (await getRule(mid, I.c1)).j.data;
const k6 = await putRule(mid, I.c1, { ...g3, id: '11111111-1111-1111-1111-111111111111', createdBy: '11111111-1111-1111-1111-111111111111', createdAt: '2000-01-01T00:00:00Z', moduleId: other.id, description: 'k6' });
const g4 = (await getRule(mid, I.c1)).j.data;
RES('K6', g4.id === g3.id && g4.createdBy === g3.createdBy && g4.createdAt === g3.createdAt && g4.moduleId === g3.moduleId ? 'PASS' : 'FAIL', 'PUT ' + SR(k6) + '; after: id same ' + (g4.id === g3.id) + ', createdBy same ' + (g4.createdBy === g3.createdBy) + ', createdAt same ' + (g4.createdAt === g3.createdAt) + ', moduleId same ' + (g4.moduleId === g3.moduleId));
// K7 bad ids
const k7a = await api('GET', '/modules/' + mid + '/layout-rules/abc'); const k7b = await api('GET', '/modules/' + mid + '/layout-rules/00000000-0000-0000-0000-000000000000');
RES('K7', k7a.s === 404 && k7b.s === 404 ? 'PASS' : 'FAIL', SR(k7a) + ' | ' + SR(k7b));
// K1 XSS stored (UI rendering checked later)
const xss = '<img src=x onerror=alert(1)>';
const kx = await mkRule(mid, { ...base('xss ' + xss), description: xss }); I.xss = kx.j?.data?.id; SAVE(); RES('K1a', 'INFO', 'XSS rule create ' + SR(kx) + ' stored name ' + JSON.stringify(kx.j?.data?.name));
return 'done';
