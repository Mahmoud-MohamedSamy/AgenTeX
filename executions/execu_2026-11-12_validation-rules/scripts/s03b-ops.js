const mid = await modId(); const L = I.layout; const base = I.base; const isDesk = APP === 'desk';
const out = {};
const keep = (await rules(mid)).filter(r => r.name.startsWith(P) && r.status === 'active');
for (const r of keep) await putRule(mid, r.id, { ...r, status: 'disabled' });
const T = async (id, pf, branches, bads, goods) => {
  const r = await mkRule(mid, { name: P + ' ' + id, layoutId: L, primaryField: pf, branches: Array.isArray(branches) ? branches : [branches] });
  if (r.s >= 300) { (out[id] = out[id] || []).push('RULE ' + SR(r).slice(0, 220)); return; }
  const rid = r.j.data.id; const res = [];
  for (const v of bads) { const x = await mkRec(mid, { ...base, ...v }, L); res.push({ want: 'block', v, s: x.s, ok: x.s === 422 && x.err.includes(rid), msg: (x.err.match(/"message":"([^"]*)"/) || [])[1] }); }
  for (const v of goods) { const x = await mkRec(mid, { ...base, ...v }, L); res.push({ want: 'save', v, s: x.s, ok: x.s < 300, e: x.err.slice(0, 120) }); }
  if (!bads.length && !goods.length) res.push('RULE ACCEPTED (expected refuse?) ce=' + r.j.data.conditionError);
  await delRule(mid, rid);
  (out[id] = out[id] || []).push(...res);
};
const t = 'qa_vr_text', n = 'qa_vr_num', m = 'qa_vr_multi', Br = (c, msg, x) => B(c, msg || 'QA msg', x);
await T('D1', t, Br(C('eq', t, 'X')), [{ [t]: 'X' }], [{ [t]: 'Y' }, { [t]: 'x' }]);
await T('D1', t, Br(C('neq', t, 'X')), [{ [t]: 'Y' }], [{ [t]: 'X' }]);
await T('D2', t, Br(C('contains', t, 'zz')), [{ [t]: 'azzb' }], [{ [t]: 'ab' }]);
await T('D2', t, Br(C('notContains', t, 'zz')), [{ [t]: 'ab' }], [{ [t]: 'azz' }]);
await T('D2', t, Br(C('startsWith', t, 'AB')), [{ [t]: 'ABc' }], [{ [t]: 'cAB' }]);
await T('D2', t, Br(C('endsWith', t, 'END')), [{ [t]: 'xEND' }], [{ [t]: 'ENDx' }]);
await T('D3', t, Br(C('lengthGt', t, 5)), [{ [t]: '123456' }, { [t]: 'عربيعربي' }], [{ [t]: '12345' }, { [t]: 'عربي' }]);
await T('D3', t, Br(C('lengthLt', t, 3)), [{ [t]: 'ab' }], [{ [t]: 'abc' }]);
await T('D3', t, Br(C('lengthEq', t, 4)), [{ [t]: 'abcd' }], [{ [t]: 'abc' }]);
await T('D3', t, Br(C('lengthNeq', t, 4)), [{ [t]: 'abc' }], [{ [t]: 'abcd' }]);
await T('D3', t, Br(C('lengthGte', t, 3)), [{ [t]: 'abc' }], [{ [t]: 'ab' }]);
await T('D3', t, Br(C('lengthLte', t, 2)), [{ [t]: 'ab' }], [{ [t]: 'abc' }]);
await T('D4', t, Br(C('regexMatches', t, '[A-Z]{3}-\\d{3}')), [{ [t]: 'ABC-123' }], [{ [t]: 'abc' }, { [t]: 'xABC-123x' }]);
await T('D4', t, Br(C('regexNotMatches', t, '[A-Z]{3}-\\d{3}')), [{ [t]: 'abc' }], [{ [t]: 'ABC-123' }]);
await T('D4', t, Br(C('regexContains', t, '\\d')), [{ [t]: 'a1' }], [{ [t]: 'ab' }]);
await T('D7', n, Br(C('gt', n, 10)), [{ [n]: 11 }], [{ [n]: 10 }]);
await T('D7', n, Br(C('gte', n, 10)), [{ [n]: 10 }], [{ [n]: 9 }]);
await T('D7', n, Br(C('lt', n, 0)), [{ [n]: -1 }], [{ [n]: 0 }]);
await T('D7', n, Br(C('lte', n, 0)), [{ [n]: 0 }], [{ [n]: 1 }]);
await T('D7', n, Br(C('eq', n, 5)), [{ [n]: 5 }], [{ [n]: 6 }]);
await T('D7', n, Br(C('neq', n, 5)), [{ [n]: 6 }], [{ [n]: 5 }]);
await T('D8', 'qa_vr_dec', Br(C('gt', 'qa_vr_dec', 1.5)), [{ qa_vr_dec: 1.51 }], [{ qa_vr_dec: 1.5 }]);
await T('D8', 'qa_vr_cur', Br(C('gt', 'qa_vr_cur', 1000)), [{ qa_vr_cur: 1000.01 }], [{ qa_vr_cur: 1000 }]);
await T('D8', 'qa_vr_pct', Br(C('gt', 'qa_vr_pct', 50)), [{ qa_vr_pct: 50.5 }], [{ qa_vr_pct: 50 }]);
await T('D9', 'qa_vr_long', Br(C('gt', 'qa_vr_long', 10000000000)), [{ qa_vr_long: 10000000001 }], [{ qa_vr_long: 10000000000 }]);
await T('D10', 'qa_vr_date', Br(C('lt', 'qa_vr_date', '2026-01-01')), [{ qa_vr_date: '2025-12-31' }], [{ qa_vr_date: '2026-01-01' }]);
await T('D10', 'qa_vr_dt', Br(C('gt', 'qa_vr_dt', '2026-12-31T00:00:00Z')), [{ qa_vr_dt: '2027-01-01T00:00:00Z' }], [{ qa_vr_dt: '2026-06-01T00:00:00Z' }]);
await T('D11', 'qa_vr_pick', Br(C('notIn', 'qa_vr_pick', ['Open', 'Done'])), [{ qa_vr_pick: 'Reject' }], [{ qa_vr_pick: 'Open' }]);
await T('D11', 'qa_vr_pick', Br(C('eq', 'qa_vr_pick', 'Done')), [{ qa_vr_pick: 'Done' }], [{ qa_vr_pick: 'Open' }]);
await T('D12', 'qa_vr_radio', Br(C('eq', 'qa_vr_radio', 'No')), [{ qa_vr_radio: 'No' }], [{ qa_vr_radio: 'Yes' }]);
await T('D13', m, Br(C('inAny', m, ['A'])), [{ [m]: ['A', 'B'] }], [{ [m]: ['C'] }]);
await T('D13', m, Br(C('in', m, ['A'])), [{ [m]: ['A', 'B'] }], [{ [m]: ['C'] }]);
await T('D13', m, Br(C('containsAll', m, ['A', 'B'])), [{ [m]: ['A', 'B', 'C'] }], [{ [m]: ['A'] }]);
await T('D13', m, Br(C('notIn', m, ['A'])), [{ [m]: ['B'] }], [{ [m]: ['A', 'B'] }]);
await T('D14', t, Br(C('isNull', t)), [{}, { [t]: '' }], [{ [t]: 'x' }]);
await T('D14', t, Br(C('isNotNull', t)), [{ [t]: 'x' }], [{}]);
await T('D14', n, Br(C('isNull', n)), [{}], [{ [n]: 0 }]);
await T('D14', m, Br(C('isEmpty', m)), [{}, { [m]: [] }], [{ [m]: ['A'] }]);
await T('D14', 'qa_vr_pick', Br(C('isNull', 'qa_vr_pick')), [{}], [{ qa_vr_pick: 'Open' }]);
await T('D15', 'qa_vr_email', Br(C('endsWith', 'qa_vr_email', '@bad.com')), [{ qa_vr_email: 'a@bad.com' }], [{ qa_vr_email: 'a@good.com' }]);
await T('D15', 'qa_vr_phone', Br(C('regexNotMatches', 'qa_vr_phone', '\\+20\\d{10}')), [{ qa_vr_phone: '+1555' }], [{ qa_vr_phone: '+201001234567' }]);
await T('D15', 'qa_vr_url', Br(C('startsWith', 'qa_vr_url', 'http:')), [{ qa_vr_url: 'http://x.com' }], [{ qa_vr_url: 'https://x.com' }]);
await T('D16', 'qa_vr_ml', Br(C('contains', 'qa_vr_ml', 'forbidden')), [{ qa_vr_ml: 'line1\nforbidden word' }], [{ qa_vr_ml: 'line1\nfine' }]);
await T('D17', t, Br(C('regexMatches', t, '[0-9]+'), 'QA must be digits', { triggerOn: 'no_match' }), [{ [t]: 'abc' }], [{ [t]: '123' }]);
await T('D18', t, Br(C('isNull', t), 'QA text needed when Reject', { when: C('eq', 'qa_vr_pick', 'Reject') }), [{ qa_vr_pick: 'Reject' }], [{ qa_vr_pick: 'Reject', [t]: 'why' }, { qa_vr_pick: 'Open' }]);
await T('D19', t, Br(C('isNull', t), 'QA and', { when: { op: 'and', children: [C('eq', 'qa_vr_pick', 'Reject'), C('gt', n, 10)] } }), [{ qa_vr_pick: 'Reject', [n]: 11 }], [{ qa_vr_pick: 'Reject', [n]: 5 }, { qa_vr_pick: 'Open', [n]: 11 }]);
await T('D19', t, Br(C('isNull', t), 'QA or', { when: { op: 'or', children: [C('eq', 'qa_vr_pick', 'Reject'), C('gt', n, 10)] } }), [{ qa_vr_pick: 'Reject' }, { qa_vr_pick: 'Open', [n]: 11 }], [{ qa_vr_pick: 'Open', [n]: 5 }]);
// D20: b1 when Reject -> text must not be empty; b2 (no when) text must not start with X. Record Reject + 'Xa': first branch decides -> saves (Zoho: first matching condition only)
await T('D20', t, [Br(C('isNull', t), 'QA D20 first', { when: C('eq', 'qa_vr_pick', 'Reject') }), Br(C('startsWith', t, 'X'), 'QA D20 second')], [{ qa_vr_pick: 'Open', [t]: 'Xa' }], [{ qa_vr_pick: 'Reject', [t]: 'Xa' }]);
await T('D24', t, Br(C('eq', t, 123)), [{ [t]: '123' }], [{ [t]: '124' }]);
await T('D24', n, Br(C('eq', n, '5')), [{ [n]: 5 }], [{ [n]: 6 }]);
await T('D24', 'qa_vr_date', Br(C('lt', 'qa_vr_date', 'not-a-date')), [], []);
await T('D24', n, Br(C('gt', n, 'abc')), [], []);
if (isDesk) {
  await T('D25', t, Br(C('isNull', t), 'QA D25 status', { when: C('eq', 'status', 'Open') }), [{ status: 'Open' }], [{ status: 'Open', [t]: 'x' }]);
  await T('D25', t, Br(C('isNull', t), 'QA D25 chk', { when: C('eq', 'qa_vr_chk', true) }), [{ qa_vr_chk: true }], [{ qa_vr_chk: false }]);
}
for (const r of keep) { const g = (await getRule(mid, r.id)).j.data; await putRule(mid, r.id, { ...g, status: 'active' }); }
fs.writeFileSync(RUN + '/out/ops-' + APP + '.json', JSON.stringify(out, null, 1));
for (const [id, rows] of Object.entries(out)) { const bad = rows.filter(r => typeof r === 'string' || !r.ok); RES(id + (isDesk ? '-desk' : ''), bad.length ? 'CHECK' : 'PASS', `${rows.length - bad.length}/${rows.length} ok` + (bad.length ? ' | not ok: ' + JSON.stringify(bad).slice(0, 700) : '')); }
return 'done';
