// Owner batch: warn mode, several rules, limits, security, function rules, Desk-only checks
const mid = await modId(); const L = I.layout; const base = I.base; const isDesk = APP === 'desk'; const sfx = isDesk ? '-desk' : '';
const raw = (vals, extra = {}, lid = L) => api('POST', '/modules/' + mid + '/records', { data: Object.entries({ ...base, ...vals }).map(([k, v]) => ({ field: k, value: enc(v) })), layout_id: lid, ...extra });
const tm = async f => { const t0 = Date.now(); const r = await f(); return [r, Date.now() - t0]; };
const all = await rules(mid); const r1 = all.find(r => r.name === P + ' R1 text'), r4 = all.find(r => r.name === P + ' R4 pick');
// E8 several broken rules at once
{ const x = await raw({ qa_vr_text: 'BAD-e8', qa_vr_pick: 'Reject' }); const d = (x.j && x.j.error && x.j.error.details) || [];
  RES('E8' + sfx, d.length === 2 ? 'PASS' : 'FAIL', `${x.s} details=${d.length}: ${JSON.stringify(d.map(z => [z.path, z.message])).slice(0, 300)}`); }
// H1 second active rule on the same field
{ const x = await mkRule(mid, { name: P + ' H1 second', layoutId: L, primaryField: 'qa_vr_text', branches: [B(C('eq', 'qa_vr_text', 'H1'), 'QA H1')] });
  const y = isDesk ? null : await mkRule(mid, { name: P + ' H1 all layouts', layoutId: null, primaryField: 'qa_vr_text', branches: [B(C('eq', 'qa_vr_text', 'H1ALL'), 'QA H1 all')] });
  let z = ''; if (y && y.s < 300) { const a = await raw({ qa_vr_text: 'H1ALL' }); const b = await raw({ qa_vr_text: 'BAD-h1' }); z = ` | QA layout: H1ALL -> ${a.s}, BAD -> ${b.s}`; await delRule(mid, y.j.data.id); }
  if (x.s < 300) await delRule(mid, x.j.data.id);
  RES('H1' + sfx, 'INFO', `2nd active rule same field+layout -> ${SR(x).slice(0, 200)}` + (y ? ` | same field, All layouts -> ${SR(y).slice(0, 160)}` + z : '')); }
// E3/E4/E5 warn (CRM) / C10 Desk refuses warn
{ const w = await mkRule(mid, { name: P + ' E4 warn', layoutId: L, primaryField: 'qa_vr_note', mode: 'warn', branches: [B(C('eq', 'qa_vr_note', 'WARN'), 'QA E4 are you sure?')] });
  if (isDesk) { RES('C10', w.s >= 400 ? 'PASS' : 'FAIL', 'Desk rule with mode warn -> ' + SR(w).slice(0, 250)); if (w.s < 300) await delRule(mid, w.j.data.id); }
  else if (w.s < 300) { const wid = w.j.data.id;
    const a = await raw({ qa_vr_note: 'WARN' }); const b = await raw({ qa_vr_note: 'WARN' }, { confirmed_warnings: [wid] }); const c = await raw({ qa_vr_note: 'WARN' }, { confirmed_warnings: [r1.id] }); const c2 = await raw({ qa_vr_note: 'WARN' }, { confirmed_warnings: ['00000000-0000-0000-0000-000000000000'] });
    RES('E4', a.s >= 400 && E(a).includes('WARNING') && b.s < 300 ? 'PASS' : 'FAIL', `no confirm -> ${SR(a).slice(0, 300)} | confirmed -> ${b.s}`);
    RES('E5', c.s >= 400 && c2.s >= 400 ? 'PASS' : 'FAIL', `confirm with other rule id -> ${SR(c).slice(0, 120)} | random id -> ${SR(c2).slice(0, 120)}`);
    // H8 warn + block together
    const h8 = await raw({ qa_vr_note: 'WARN', qa_vr_text: 'BAD-h8' }); const h8b = await raw({ qa_vr_note: 'WARN', qa_vr_text: 'BAD-h8' }, { confirmed_warnings: [wid] });
    RES('H8', 'INFO', `warn+block -> ${SR(h8).slice(0, 300)} | with warn confirmed -> ${SR(h8b).slice(0, 200)}`);
    // update path
    const ok = await mkRec(mid, { ...base, qa_vr_note: 'fine' }, L); const u1 = await updRec(mid, ok.id, { qa_vr_note: 'WARN' }); const u2 = await updRec(mid, ok.id, { qa_vr_note: 'WARN' }, { confirmed_warnings: [wid] });
    RES('E3', u1.s >= 400 && u2.s < 300 ? 'PASS' : 'FAIL', `API part: edit to WARN -> ${SR(u1.r).slice(0, 150)} | with confirm -> ${u2.s}`);
    I.warnRule = wid; SAVE(); } else RES('E4', 'FAIL', 'warn rule refused ' + SR(w)); }
// I6 message length / I7 name length
{ const res = [];
  for (const n of [500, 1000, 2000, 5000]) { const x = await mkRule(mid, { name: P + ' I6 ' + n, layoutId: L, primaryField: 'qa_vr_url', branches: [B(C('eq', 'qa_vr_url', 'https://i6.x'), 'M'.repeat(n))] }); res.push(n + ':' + SR(x).slice(0, 90)); if (x.s < 300) await delRule(mid, x.j.data.id); }
  RES('I6' + sfx, 'INFO', 'message length -> ' + res.join(' | '));
  const res2 = [];
  for (const n of [100, 255, 256, 1000]) { const x = await mkRule(mid, { name: (P + ' I7 ').padEnd(n, 'N'), layoutId: L, primaryField: 'qa_vr_url', branches: [B(C('eq', 'qa_vr_url', 'https://i7.x'), 'QA I7')] }); res2.push(n + ':' + SR(x).slice(0, 90)); if (x.s < 300) await delRule(mid, x.j.data.id); }
  const e = await mkRule(mid, { name: '   ', layoutId: L, primaryField: 'qa_vr_url', branches: [B(C('eq', 'qa_vr_url', 'https://i7.x'), 'QA I7')] }); res2.push('blank:' + SR(e).slice(0, 90)); if (e.s < 300) await delRule(mid, e.j.data.id);
  const em = await mkRule(mid, { name: P + ' I6 empty msg', layoutId: L, primaryField: 'qa_vr_url', branches: [{ when: null, check: C('eq', 'qa_vr_url', 'https://i7.x'), message: { en: '' }, triggerOn: 'match' }] }); res2.push('empty message:' + SR(em).slice(0, 120)); if (em.s < 300) await delRule(mid, em.j.data.id);
  RES('I7' + sfx, 'INFO', 'name length -> ' + res2.join(' | ')); }
// I9 read-only keys in PUT
{ const g = (await getRule(mid, r1.id)).j.data; const p = await putRule(mid, r1.id, { ...g, id: '11111111-1111-1111-1111-111111111111', moduleId: '22222222-2222-2222-2222-222222222222', createdBy: '33333333-3333-3333-3333-333333333333', createdAt: '2000-01-01T00:00:00Z' });
  const g2 = (await getRule(mid, r1.id)); RES('I9' + sfx, g2.s === 200 && g2.j.data.createdAt === g.createdAt && g2.j.data.createdBy === g.createdBy ? 'PASS' : 'FAIL', `PUT with changed id/moduleId/createdBy/createdAt -> ${SR(p).slice(0, 150)}; after: createdAt kept=${g2.j && g2.j.data && g2.j.data.createdAt === g.createdAt}, createdBy kept=${g2.j && g2.j.data && g2.j.data.createdBy === g.createdBy}`); }
// K4 wrong types
{ const bodies = { nameNumber: { name: 12345 }, branchesString: { branches: 'x' }, modeBad: { mode: 'explode' }, statusBad: { status: 'maybe' }, placementBad: { errorPlacement: 'side' }, layoutBad: { layoutId: 'not-a-uuid' }, layoutOther: { layoutId: '00000000-0000-0000-0000-000000000000' } };
  const res = [];
  for (const [k, v] of Object.entries(bodies)) { const x = await mkRule(mid, { name: P + ' K4 ' + k, layoutId: L, primaryField: 'qa_vr_url', branches: [B(C('eq', 'qa_vr_url', 'https://k4.x'), 'QA K4')], ...v }); res.push(k + ':' + x.s); if (x.s < 300) await delRule(mid, x.j.data.id); }
  RES('K4' + sfx, res.every(x => /:4\d\d$/.test(x)) ? 'PASS' : 'FAIL', res.join(' ')); }
// K8 unknown keys and ops in when
{ const x = await mkRule(mid, { name: P + ' K8 extra', layoutId: L, primaryField: 'qa_vr_url', foo: 'bar', branches: [B(C('eq', 'qa_vr_url', 'https://k8.x'), 'QA K8', { when: C('weird', 'qa_vr_pick', 'x') })] });
  const y = await mkRule(mid, { name: P + ' K8 when field', layoutId: L, primaryField: 'qa_vr_url', branches: [B(C('eq', 'qa_vr_url', 'https://k8.x'), 'QA K8', { when: C('eq', 'nope_field', 'x') })] });
  for (const z of [x, y]) if (z.s < 300) await delRule(mid, z.j.data.id);
  RES('K8' + sfx, x.s >= 400 && y.s >= 400 ? 'PASS' : 'FAIL', `unknown op in when -> ${SR(x).slice(0, 160)} | unknown field in when -> ${SR(y).slice(0, 160)}`); }
// K5 slow regex
{ const x = await mkRule(mid, { name: P + ' K5 redos', layoutId: L, primaryField: 'qa_vr_url', branches: [B(C('regexMatches', 'qa_vr_url', '(a+)+$'), 'QA K5')] });
  let info = 'rule -> ' + SR(x).slice(0, 160);
  if (x.s < 300) { const g = (await getRule(mid, x.j.data.id)).j.data; await putRule(mid, x.j.data.id, { ...g, primaryField: 'qa_vr_note', branches: [B(C('regexMatches', 'qa_vr_note', '(a+)+$'), 'QA K5')] }).then(r => info += ' | moved to note ' + r.s);
    const [r, ms] = await tm(() => raw({ qa_vr_note: 'a'.repeat(40) + '!' })); info += ` | save with 41-char evil value -> ${SR(r).slice(0, 160)} in ${ms} ms`; await delRule(mid, x.j.data.id); }
  RES('K5' + sfx, /in (\d+) ms/.test(info) && +info.match(/in (\d+) ms/)[1] < 5000 ? 'PASS' : 'CHECK', info); }
// N1 save time with rules vs fewer
{ const [, a] = await tm(() => raw({ qa_vr_text: 'n1' })); const [, b] = await tm(() => raw({ qa_vr_text: 'n1b' })); RES('N1' + sfx, 'INFO', `save with ${(await rules(mid)).filter(r => r.status === 'active').length} active rules: ${a} ms, ${b} ms`); }
if (!isDesk) {
  // F1-F4, F10, K7 function rules
  const fn = (url, extra = {}) => ({ name: P + ' F ' + url.slice(0, 40), layoutId: L, primaryField: 'qa_vr_email', kind: 'function', branches: [], function: { url, timeoutMs: 3000, secret: 'QaSecretValue12345', ...extra } });
  const f1 = await mkRule(mid, fn('https://qa-vr1112.invalid/hook'));
  RES('F1', f1.s < 300 ? 'PASS' : 'FAIL', 'function rule save -> ' + SR(f1).slice(0, 250));
  if (f1.s < 300) { const fid = f1.j.data.id; I.fnRule = fid; SAVE();
    const g = await getRule(mid, fid); const lst = await api('GET', VR(mid));
    RES('K7', !g.t.includes('QaSecretValue12345') && !lst.t.includes('QaSecretValue12345') ? 'PASS' : 'FAIL', `secret in GET one: ${g.t.includes('QaSecretValue12345')}, in list: ${lst.t.includes('QaSecretValue12345')}; function object = ${JSON.stringify(g.j.data.function)}`);
    const [down, ms] = await tm(() => raw({ qa_vr_email: 'f8@example.com' }));
    RES('F8', 'INFO', `function host does not resolve -> record save ${SR(down).slice(0, 300)} in ${ms} ms`);
    const tf = await api('POST', VR(mid) + '/' + fid + '/test-function', { data: { qa_vr_email: 'x@y.com' } });
    RES('F5', 'INFO', 'test-function with dead host -> ' + SR(tf).slice(0, 300) + ' ' + tf.t.slice(0, 300));
    // F4: PUT without secret keeps the secret?
    const g1 = g.j.data; const p = await putRule(mid, fid, { ...g1, description: 'F4 put without secret' });
    RES('F4', 'INFO', `PUT back the GET body (no secret) -> ${SR(p).slice(0, 150)}; function after = ${JSON.stringify((await getRule(mid, fid)).j.data.function)}`);
    await delRule(mid, fid); }
  const res = [];
  for (const [k, u, x] of [['http', 'http://example.com/hook'], ['t499', 'https://example.com/hook', { timeoutMs: 499 }], ['t500', 'https://example.com/hook', { timeoutMs: 500 }], ['t10000', 'https://example.com/hook', { timeoutMs: 10000 }], ['t10001', 'https://example.com/hook', { timeoutMs: 10001 }], ['localhost', 'https://localhost/hook'], ['loopback', 'https://127.0.0.1/hook'], ['metadata', 'https://169.254.169.254/latest'], ['private10', 'https://10.0.0.5/hook'], ['ipv6', 'https://[::1]/hook'], ['nourl', '']]) {
    const r = await mkRule(mid, fn(u, x)); res.push(k + ':' + r.s + (r.s >= 400 ? '' : '')); if (r.s < 300) await delRule(mid, r.j.data.id); }
  const s = Object.fromEntries(res.map(x => x.split(':')));
  RES('F2', s.http >= 400 ? 'PASS' : 'FAIL', 'http:// url -> ' + s.http + ', empty url -> ' + s.nourl);
  RES('F3', s.t499 >= 400 && s.t10001 >= 400 && s.t500 < 300 && s.t10000 < 300 ? 'PASS' : 'FAIL', `timeout 499:${s.t499} 500:${s.t500} 10000:${s.t10000} 10001:${s.t10001}`);
  RES('F10', ['localhost', 'loopback', 'metadata', 'private10', 'ipv6'].every(k => s[k] >= 400) ? 'PASS' : 'CHECK', `save-time refusal: localhost ${s.localhost}, 127.0.0.1 ${s.loopback}, 169.254.169.254 ${s.metadata}, 10.0.0.5 ${s.private10}, [::1] ${s.ipv6}`);
  // C4 all layouts
  const c4 = await mkRule(mid, { name: P + ' C4 all', layoutId: null, primaryField: 'qa_vr_dec', branches: [B(C('eq', 'qa_vr_dec', 4.44), 'QA C4 all layouts')] });
  if (c4.s < 300) { const a = await raw({ qa_vr_dec: 4.44 }, {}, I.defLayout); const b = await raw({ qa_vr_dec: 4.44 }); const c = await raw({ qa_vr_dec: 4.44 }, {}, null);
    RES('C4', a.s === 422 && b.s === 422 ? 'PASS' : 'FAIL', `All layouts rule: default layout -> ${a.s}, QA layout -> ${b.s}, no layout given -> ${c.s}`); await delRule(mid, c4.j.data.id); }
  else RES('C4', 'FAIL', SR(c4));
} else {
  // Desk: function / fieldVerification refused, layout required (C5 desk), departments (C6), J7
  const a = await mkRule(mid, { name: P + ' C10 fn', layoutId: L, primaryField: 'qa_vr_email', kind: 'function', branches: [], function: { url: 'https://example.com/x', timeoutMs: 3000 } });
  const b = await mkRule(mid, { name: P + ' C10 fv', layoutId: L, primaryField: 'qa_vr_email', fieldVerification: true, branches: [B(C('eq', 'qa_vr_email', 'a@b.c'), 'QA')] });
  const c = await mkRule(mid, { name: P + ' C5 nolayout', layoutId: null, primaryField: 'qa_vr_email', branches: [B(C('eq', 'qa_vr_email', 'a@b.c'), 'QA')] });
  for (const z of [a, b, c]) if (z.s < 300) await delRule(mid, z.j.data.id);
  RES('C10-desk', a.s >= 400 && b.s >= 400 ? 'PASS' : 'FAIL', `Desk function rule -> ${SR(a).slice(0, 160)} | field verification -> ${SR(b).slice(0, 160)}`);
  RES('C5-desk', c.s >= 400 ? 'PASS' : 'FAIL', 'Desk rule with no layout -> ' + SR(c).slice(0, 200));
  const CS = base.department; const other = I.depts.find(d => d[0] !== CS);
  const c6 = await mkRule(mid, { name: P + ' C6 dept', layoutId: L, departmentIds: [CS], primaryField: 'qa_vr_dec', branches: [B(C('eq', 'qa_vr_dec', 6.66), 'QA C6 dept only')] });
  if (c6.s < 300) { const x = await raw({ qa_vr_dec: 6.66 }); const y = await raw({ qa_vr_dec: 6.66, department: other[0] });
    RES('C6', x.s === 422 && y.s < 300 ? 'PASS' : 'FAIL', `rule for dept ${CS.slice(0, 8)}: ticket in it -> ${x.s}; ticket in '${other[1]}' -> ${SR(y).slice(0, 160)}`); await delRule(mid, c6.j.data.id); }
  else RES('C6', 'FAIL', SR(c6));
  const old = (await rules(mid)).find(r => r.name === 'QA NDC Reject needs a reason');
  const st = arr((await fieldsOf(mid))).find(f => f.fieldName === 'status');
  const j7 = await api('POST', '/modules/' + mid + '/records', { data: Object.entries({ ...base, status: 'QA NDC Reject' }).map(([k, v]) => ({ field: k, value: enc(v) })) });
  RES('J7', 'CHECK', `old rule status=${old && old.status}, layoutId=${old && old.layoutId}, conditionError='${old && old.conditionError}'. Ticket with status 'QA NDC Reject' and no reason on default layout -> ${SR(j7).slice(0, 250)}`);
  if (j7.j && j7.j.data && j7.j.data.id) { (I.recs = I.recs || []).push([mid, j7.j.data.id]); SAVE(); }
}
return 'done';
