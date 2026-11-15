const mid = await modId(); const out = {};
const r = await mkRec(mid, { first_name: 'QA RT18 bp rec2', last_name: 'QA RT18 bp rec2', qa_rt18_type: 'Question' }, I.layout); I.bpRec2 = r.id; SAVE(); await sleep(2500);
for (const body of [{ transitionId: 't_qa_rt18_1' }, { transition_id: 't_qa_rt18_1' }]) { const x = await api('POST', '/modules/' + mid + '/records/' + r.id + '/blueprint', body); out[Object.keys(body)[0]] = SR(x).slice(0, 400); if (x.s < 300 || /required/.test(x.t)) break; }
const v = await recVals(mid, r.id); out.after = [v[FP + 'type'], v[FP + 'order']];
return out;
