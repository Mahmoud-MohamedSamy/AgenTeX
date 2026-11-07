const o = {}; const T1 = '79752799-5318-4363-8fea-b7b121f62f49', T3 = 'adfe7f1f-526a-4e36-a951-8a95ab1c3920', T4 = 'f50e00dc-3f08-4d01-8a41-6e81f2db9fdd';
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''} ${r.j?.error?.details ? JSON.stringify(r.j.error.details).slice(0, 300) : ''}`.trim();
// item 4: field check
o.go_amount0 = full(await X.run(T1, 'go', 'Open', { fields: { qa_ndc_amount: 0 } })); o.after0 = await st(T1);
o.go_amountMinus = full(await X.run(T1, 'go', 'Open', { fields: { qa_ndc_amount: -5 } }));
o.go_amount5 = full(await X.run(T1, 'go', 'Open', { fields: { qa_ndc_amount: 5 } })); o.after5 = await st(T1);
const f = await X.fields(T1); o.amountSaved = f.qa_ndc_amount;
// items 5/6: run without the mandatory approval / share to learn the payload
o.hold_noApproval = full(await X.run(T3, 'hold', 'Open', {}));
o.alt_noShare = full(await X.run(T4, 'alt', 'Open', {}));
return o;
