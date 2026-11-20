const L = []; const AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a'; const S = x => String(JSON.stringify(x === undefined ? null : x)).slice(0, 260);
const mkRec = async (mod, vals, label) => { const r = await api('POST', '/modules/' + mod + '/records', body(vals)); const d = r.j && r.j.data; const id = d && (d.id || (d.record && d.record.id)); if (id) LED(label + ' ' + id); return { s: r.s, id, e: E(r) }; };
const tk = async (s, d, ex) => { const t = await mkTicket(s, d || IDS.DB, ex || {}); await sleep(4500); return t.id; };
// B-06 / B-07 fields and operators
const FL = (await api('GET', '/desk/assignment-rules/criteria-fields')).j.data.fields;
const keys = ['owner', 'team', 'tags', 'skills', 'contact_id', 'account_id', 'product', 'due_date', 'created_time', 'modified_time', 'closed_time', 'is_overdue', 'is_escalated'];
const have = keys.map(k => k + (FL.some(f => f.key === k || f.key.startsWith(k)) ? ':yes' : ':NO')).join(' ');
L.push(R_('B-06', /is_escalated:NO/.test(have) ? 'Fail' : 'Pass', 'Criteria fields: ticket ' + FL.filter(f => f.group === 'ticket').length + ', contact ' + FL.filter(f => f.group === 'contact').length + ' (Zoho 26), account ' + FL.filter(f => f.group === 'account').length + '; key fields ' + have));
const dateF = FL.find(f => f.type === 'datetime' || f.type === 'date'); const numF = FL.find(f => f.type === 'number' || f.type === 'integer' || f.type === 'decimal'); const ex = FL.filter(f => f.group === 'execution').map(f => f.key + ':' + f.operators.map(o => o.key).join('/'));
L.push(R_('B-07', dateF && numF ? 'Pass' : 'Fail', 'Date ' + (dateF && dateF.key + ': ' + dateF.operators.map(o => o.key).join(',')) + ' | number ' + (numF && numF.key + ': ' + numF.operators.map(o => o.key).join(',')) + ' | execution ' + ex.join(' ')));
// B-01 no criteria (Dept B only) + A-11 delete keeps owner
const r1 = await mkRule({ type: 'direct', name: 'QA AR B01 no criteria', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [], pattern: null }, coming_to_department_id: IDS.DB, move_to_department_id: null, assign: AG(IDS.A2) }] });
let id = await tk('QA AR zq any subject B01'); const o1 = await ownN(id); const g = await getRule(r1.id); const del = sh(await api('DELETE', '/desk/assignment-rules/' + r1.id + '?version=' + g.version)); await sleep(1500);
L.push(R_('B-01', o1 === 'A2' ? 'Pass' : 'Fail', 'Direct rule with no criteria (Dept B): unrelated ticket -> ' + o1));
L.push(R_('A-11', del.s < 300 && (await ownN(id)) === 'A2' && !(await getRule(r1.id)) ? 'Pass' : 'Fail', 'Delete rule (' + del.s + '): ticket it assigned keeps owner ' + await ownN(id) + '; rule gone'));
// B-02 pattern runtime
const crit = { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA AR B02' }, { field_key: 'priority', operator: 'equals', value: 'low' }, { field_key: 'priority', operator: 'equals', value: 'urgent' }], pattern: '1 and (2 or 3)' };
await mkRule({ type: 'direct', name: 'QA AR B02 pattern', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: crit, coming_to_department_id: IDS.DB, move_to_department_id: null, assign: AG(IDS.A1) }] });
const go = async (s, p) => { const t = await tk(s, IDS.DB, { priority: p }); return s + '/' + p + '=' + (await ownN(t)); };
const b2 = [await go('QA AR B02 a', 'Low'), await go('QA AR B02 b', 'Urgent'), await go('QA AR B02 c', 'Medium'), await go('QA AR other B', 'Low')];
L.push(R_('B-02', /=A1$/.test(b2[0]) && /=A1$/.test(b2[1]) && /=null$/.test(b2[2]) && /=null$/.test(b2[3]) ? 'Pass' : 'Fail', 'Pattern 1 and (2 or 3), rule -> A1: ' + b2.join(' | ')));
// B-03/B-04/B-05 validation
const vr = async (crit2) => { const r = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA AR Bv', description: 'QA', is_active: false, execute_on: ['create'], targets: [{ criteria: crit2, coming_to_department_id: IDS.DA, move_to_department_id: null, assign: AG(IDS.A1) }] }); if (r.j && r.j.data && r.j.data.id) { await api('DELETE', '/desk/assignment-rules/' + r.j.data.id); return 'ACCEPTED'; } return r.s + ' ' + (E(r) || '').slice(0, 110); };
const two = [{ field_key: 'subject', operator: 'contains', value: 'x' }, { field_key: 'priority', operator: 'equals', value: 'high' }];
const b3 = { noValue: await vr({ conditions: [{ field_key: 'subject', operator: 'contains', value: '' }], pattern: null }), noField: await vr({ conditions: [{ field_key: '', operator: 'contains', value: 'x' }], pattern: null }) };
L.push(R_('B-03', !/ACCEPTED/.test(b3.noValue + b3.noField) ? 'Pass' : 'Fail', 'Condition without value -> ' + b3.noValue + '; without field -> ' + b3.noField));
const b4 = {}; for (const p of ['1 and (2', '1 and 4', '1 xor 2', '(1 or 2))']) b4[p] = await vr({ conditions: two, pattern: p });
L.push(R_('B-04', !Object.values(b4).some(x => /ACCEPTED/.test(x)) ? 'Pass' : 'Fail', 'Bad patterns: ' + S(b4)));
const cond = n => Array.from({ length: n }, (_, i) => ({ field_key: 'subject', operator: 'does_not_contain', value: 'zz' + i }));
const c25 = await vr({ conditions: cond(25), pattern: null }), c26 = await vr({ conditions: cond(26), pattern: null });
L.push(R_('B-05', /ACCEPTED/.test(c25) && !/ACCEPTED/.test(c26) ? 'Pass' : 'Fail', '25 conditions -> ' + c25 + '; 26 -> ' + c26));
// B-09 contact + account criteria
const ac = await mkRec(AM, { account_name: 'QA AR Acct B09' }, 'account QA AR Acct B09'); const ct = await mkRec(CM, { first_name: 'Qa', last_name: 'QA AR B09', email: 'qa.ar.b09@example.com', account_id: ac.id }, 'contact QA AR B09');
await mkRule({ type: 'direct', name: 'QA AR B09 contact', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [{ field_key: 'contact.last_name', operator: 'equals', value: 'QA AR B09' }], pattern: null }, coming_to_department_id: IDS.DB, move_to_department_id: null, assign: AG(IDS.A2) }] });
await mkRule({ type: 'direct', name: 'QA AR B09 account', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [{ field_key: 'account.account_name', operator: 'contains', value: 'QA AR Acct B09' }], pattern: null }, coming_to_department_id: IDS.DB, move_to_department_id: null, assign: AG(IDS.A1) }] });
const t1 = await tk('QA AR B09 with contact', IDS.DB, { contact_id: ct.id }), t2 = await tk('QA AR B09 account only', IDS.DB, { account_id: ac.id }), t3 = await tk('QA AR B09 none', IDS.DB);
L.push(R_('B-09', (await ownN(t1)) === 'A2' && (await ownN(t2)) === 'A1' && !(await ownN(t3)) ? 'Pass' : 'Fail', 'Contact last name rule -> ' + await ownN(t1) + ' (exp A2); account name rule -> ' + await ownN(t2) + ' (exp A1); neither -> ' + await ownN(t3) + ' (acct ' + ac.s + ', contact ' + ct.s + ')'));
saveIds(); return L;
