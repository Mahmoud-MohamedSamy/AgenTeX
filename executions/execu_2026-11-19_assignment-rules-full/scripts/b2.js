const L = []; const HOL = '3bf42474-8564-47ae-9aa4-3b70b3907c4d', BHD = 'a0302234-3896-41de-9b85-443a555a7131';
const tg = (sub, op, val, who) => ({ criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: sub }, { field_key: 'execution_time', operator: op, value: val }], pattern: '1 and 2' }, coming_to_department_id: IDS.DB, move_to_department_id: null, assign: AG(who) });
const r = await mkRule({ type: 'direct', name: 'QA AR B08 holiday', description: 'QA', is_active: true, execute_on: ['create'], targets: [tg('QA AR HOL2 t1', 'on_holiday', HOL, IDS.A1), tg('QA AR HOL2 t2', 'not_on_holiday', HOL, IDS.A2)] });
L.push({ rule: r.s, e: r.e });
const got = {}; for (const k of ['t1', 't2']) { const t = await mkTicket('QA AR HOL2 ' + k, IDS.DB); await sleep(4500); got[k] = await ownN(t.id); }
L.push(R_('B-08a', got.t1 === null && got.t2 === 'A2' ? 'Pass' : 'Fail', 'Detached holiday list "QA AS6 HOL today" (only holiday 7 Nov): on_holiday -> ' + got.t1 + ' (exp none), not_on_holiday -> ' + got.t2 + ' (exp A2). Positive "today is a holiday" not run: creating/editing holiday lists needs iam.company.business_hours.manage (owner), and the owner sign-in fails.'));
if (r.id) await setActive(r.id, false);
const bh = (await api('GET', '/desk/business-hours')).j.data; const open = bh.is_open_now;
const r2 = await mkRule({ type: 'direct', name: 'QA AR B08 bh', description: 'QA', is_active: true, execute_on: ['create'], targets: [tg('QA AR BH2', 'during_business_hours', BHD, IDS.A1), tg('QA AR BH2', 'outside_business_hours', BHD, IDS.A2)] });
const t = await mkTicket('QA AR BH2 x', IDS.DB); await sleep(4500); const o = await ownN(t.id);
L.push(R_('B-08b', r2.s === 201 && o === (open ? 'A1' : 'A2') ? 'Pass' : 'Fail', 'Default business hours ' + (open ? 'open' : 'closed') + ' now (UTC ' + new Date().toISOString().slice(11, 16) + '): during -> A1 / outside -> A2 rule gave ' + o + (r2.e ? ' rule err ' + r2.e : '')));
if (r2.id) await setActive(r2.id, false);
return L;
