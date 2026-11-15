const mid = await modId(); const o = {};
const r = await mkRule(mid, { name: P + ' E2 top', layoutId: I.layout, primaryField: 'qa_rt18v_pick', errorPlacement: 'top', branches: [B(C('in', 'qa_rt18v_pick', ['Reject']), 'QA RT18 E2 pick cannot be Reject')] }); o.e2 = SR(r).slice(0, 200); if (r.j && r.j.data) { I.rE2 = r.j.data.id; SAVE(); }
const ok = await api('POST', '/modules/' + mid + '/records/' + I.bpRec2 + '/blueprint-transitions/t_qa_1', { qa_rt18v_text: 'fine-bp' }); o.bpGood = SR(ok).slice(0, 150); const v = await recVals(mid, I.bpRec2); o.bpAfter = v.qa_rt18v_text + ' / ' + v.qa_rt18v_pick;
return o;
