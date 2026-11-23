// P1 batch 9 (API) — value cases. '?' = record what happens (judged afterwards). refuse: true = every field must be refused 4xx.
const OUT = 'b9'; const M = made.mod, LID = made.layouts[0], AID = made.acc;
const S = (k, e) => ({ k, e });
// extra inputs for E21/E31 (multi-select lookup, field not on any layout)
{ const have0 = L((await api('GET', `/modules/${M}/fields`)).j?.data).map(f => f.fieldName); const accMod = L((await api('GET', '/modules')).j?.data).find(m => m.moduleKey === 'accounts' || m.moduleKey === 'desk_accounts');
  if (!have0.includes('qa_accs')) log('qa_accs', E(await api('POST', `/modules/${M}/fields`, { fields: [fdef('qa_accs', 'QA Accounts', 'multi_select_lookup', { target_module_id: accMod.id, related_list_title: 'QA FX multi' })] })));
  if (!have0.includes('qa_offlayout')) log('qa_offlayout', E(await api('POST', `/modules/${M}/fields`, { fields: [fdef('qa_offlayout', 'QA Off layout', 'number')] }))); }
const C = {
 B6: { f: { '': S('number', 'upper(qa_text)') }, rows: [{ in: { qa_text: 'ab' }, exp: { '': '?' } }], note: 'pass = refused, or blank; fail = text stored in a number formula' },
 B7: { f: { '': S('date', 'qa_num + 1') }, rows: [{ in: { qa_num: 4 }, exp: { '': '?' } }], note: 'pass = refused or blank' },
 B8: { f: { cur: S('currency', 'qa_num'), dt: S('datetime', 'qa_num'), xyz: S('xyz', 'qa_num') }, refuse: true },
 B9: { f: { d: S('number', 'qa_num / 3'), r: S('number', 'round(qa_num / 3, 2)') }, rows: [{ in: { qa_num: 10 }, exp: { d: 10 / 3, r: 3.33 } }] },
 C3: { f: { '': S('number', 'qa_num % 3') }, rows: [{ in: { qa_num: 10 }, exp: { '': 1 } }] },
 C4: { f: { '': S('number', '-qa_num + 1') }, rows: [{ in: { qa_num: 5 }, exp: { '': -4 } }] },
 C5: { f: { '': S('string', 'qa_text & " " & qa_text2') }, rows: [{ in: { qa_text: 'A', qa_text2: 'B' }, exp: { '': 'A B' } }] },
 C10: { f: { bang: S('boolean', '!qa_check'), not: S('boolean', 'not (qa_num > 3)') }, rows: [{ in: { qa_check: true, qa_num: 5 }, exp: { bang: false, not: false } }, { in: { qa_check: false, qa_num: 1 }, exp: { bang: true, not: true } }] },
 C11: { f: { t: S('number', 'if(qa_check = true, 1, 0)'), n: S('number', 'coalesce(null, 5)') }, rows: [{ in: { qa_check: true }, exp: { t: 1, n: 5 } }] },
 C12: { f: { '': S('string', 'concat("a, b", "c\\"d")') }, rows: [{ in: {}, exp: { '': 'a, bc"d' } }] },
 D2: { f: { '': S('string', 'if(qa_num > 10, "A", if(qa_num > 5, "B", "C"))') }, rows: [{ in: { qa_num: 11 }, exp: { '': 'A' } }, { in: { qa_num: 7 }, exp: { '': 'B' } }, { in: { qa_num: 1 }, exp: { '': 'C' } }] },
 D4: { f: { one: S('string', 'concat(qa_text)'), s16: S('string', 'concat(' + Array(16).fill('"a"').join(', ') + ')') }, rows: [{ in: { qa_text: 'x' }, exp: { one: 'x', s16: 'a'.repeat(16) } }] },
 D8: { f: { '': S('number', 'min(qa_num, qa_num2)') }, rows: [{ in: { qa_num: 4 }, exp: { '': 4 } }], note: 'blank qa_num2 should be skipped (0 = treats blank as 0)' },
 D10: { f: { '': S('number', 'avg(qa_num, qa_dec, qa_num2)') }, rows: [{ in: { qa_num: 4, qa_dec: 2 }, exp: { '': 3 } }], note: 'help text: blanks are skipped' },
 D11: { f: { '': S('number', 'count(qa_num, qa_num2, qa_text)') }, rows: [{ in: { qa_num: 4, qa_text: 'x' }, exp: { '': 2 } }] },
 D12: { f: { up: S('string', 'upper("aBc é")'), lo: S('string', 'lower(qa_email)') }, rows: [{ in: { qa_email: 'Ab@X.com' }, exp: { up: 'ABC É', lo: 'ab@x.com' } }] },
 D13: { f: { '': S('string', 'trim("  a b  ")') }, rows: [{ in: {}, exp: { '': 'a b' } }] },
 D14: { f: { '': S('number', 'len(qa_text)') }, rows: [{ in: { qa_text: 'hello' }, exp: { '': 5 } }, { in: {}, exp: { '': 0 } }, { in: { qa_text: 'مرحبا' }, exp: { '': 5 } }, { in: { qa_text: '👍a' }, exp: { '': '?' } }] },
 D15: { f: { '': S('number', 'abs(qa_dec)') }, rows: [{ in: { qa_dec: -7.25 }, exp: { '': 7.25 } }] },
 D18: { f: { s: S('number', 'number("12.5") + 1'), bad: S('number', 'number("abc")'), pick: S('number', 'number(qa_pick)') }, rows: [{ in: { qa_pick: '3' }, exp: { s: 13.5, bad: null, pick: 3 } }] },
 D19: { f: { n: S('string', 'concat(text(qa_num), "x")'), d: S('string', 'text(qa_date)'), b: S('string', 'text(qa_check)') }, rows: [{ in: { qa_num: 4, qa_date: '2026-11-23', qa_check: true }, exp: { n: '4x', d: '?', b: 'true' } }] },
 D20: { f: { '': S('string', 'upper(trim(concat(" a", text(round(qa_dec, 1)))))') }, rows: [{ in: { qa_dec: 2.46 }, exp: { '': 'A2.5' } }] },
 D21: { f: { abs: S('number', 'abs("x")'), up: S('string', 'upper(5)'), rnd: S('number', 'round(qa_text, 2)') }, rows: [{ in: { qa_text: 'zz' }, exp: { abs: '?', up: '?', rnd: '?' } }], note: 'pass = refused on save or blank, never 500' },
 E2: { f: { '': S('number', 'len(qa_multi)') }, rows: [{ in: { qa_multi: 'ab\ncd' }, exp: { '': 5 } }] },
 E4: { f: { '': S('string', 'concat("+", qa_phone)') }, rows: [{ in: { qa_phone: '201001234567' }, exp: { '': '+201001234567' } }] },
 E5: { f: { '': S('string', 'concat(qa_url, "/x")') }, rows: [{ in: { qa_url: 'https://example.com' }, exp: { '': 'https://example.com/x' } }] },
 E6: { f: { '': S('number', 'len(qa_rich)') }, rows: [{ in: { qa_rich: '<b>Hi</b>' }, exp: { '': '?' } }] },
 E10: { f: { '': S('number', 'qa_pct * 2') }, rows: [{ in: { qa_pct: 15 }, exp: { '': 30 } }] },
 E12: { f: { '': S('string', 'concat("ID-", qa_auto)') }, rows: [{ in: {}, exp: { '': '?' } }], note: 'must carry the auto number given in the same save' },
 E15: { f: { '': S('boolean', 'qa_radio = "B"') }, rows: [{ in: { qa_radio: 'B' }, exp: { '': true } }, { in: { qa_radio: 'A' }, exp: { '': false } }] },
 E16: { f: { '': S('string', 'concat(qa_status)') }, rows: [{ in: { qa_status: 'Closed' }, exp: { '': 'Closed' } }] },
 E17: { f: { s: S('string', 'concat(qa_msel)'), n: S('number', 'len(qa_msel)') }, rows: [{ in: { qa_msel: ['A', 'C'] }, exp: { s: '?', n: '?' } }] },
 E21: { f: { '': S('string', 'concat(qa_accs)') }, rows: [{ in: { qa_accs: [AID] }, exp: { '': '?' } }] },
 E22: { f: { '': S('string', 'concat(qa_user)') }, rows: [{ in: { qa_user: '97be04b6-0a08-4883-aa51-e1650b11cab7' }, exp: { '': '?' } }], note: 'expected the user name, not the id' },
 E30: { f: { nm: S('string', 'upper(name)'), ct: S('string', 'text(created_at)'), cb: S('string', 'concat(created_by)') }, rows: [{ in: {}, exp: { nm: 'QA FX E30 R0', ct: '?', cb: '?' } }] },
 E31: { f: { '': S('number', 'qa_offlayout * 2') }, rows: [{ in: { qa_offlayout: 4 }, exp: { '': '?' } }] },
 L3: { f: { proto: S('number', '__proto__ + 1'), ctor: S('string', 'constructor'), tmpl: S('string', '${qa_num}'), mus: S('string', '{{qa_num}}') }, refuse: true },
 L3s: { f: { '': S('string', 'concat("); DROP TABLE records;--", qa_text)') }, rows: [{ in: { qa_text: 'x' }, exp: { '': '); DROP TABLE records;--x' } }] },
 L4: { f: { '': S('string', 'concat(lead_source)') }, refuse: true },
};
