const mid = I.mod_leads; const o = {};
for (const r of ['rText','rJ2','rE2']) { const g=(await getRule(mid, I[r])).j.data; o[r]=g.name+' msg='+JSON.stringify(g.branches.map(b=>b.message&&b.message.en)); }
const tries = { two: { first_name: 'QA RT18', last_name: '3021 two rules', qa_rt18v_text: 'BAD two' },
  three: { first_name: 'QA RT18', last_name: '3021 three rules', qa_rt18v_text: 'BAD three', qa_rt18v_pick: 'Reject' },
  control: { first_name: 'QA RT18', last_name: '3021 one rule', qa_rt18v_text: 'BAD one', qa_rt18v_email: 'qa.rt18.3021@example.com' } };
for (const [k, v] of Object.entries(tries)) { const r = await mkRec(mid, v, I.layout); const d = r.r.j && r.r.j.error && r.r.j.error.details; o[k] = r.s + ' ' + (r.r.j && r.r.j.error ? r.r.j.error.code : '') + ' n=' + (d ? d.length : 0) + ' ' + JSON.stringify(d).slice(0, 700); if (r.id) { I['c3021_' + k] = r.id; SAVE(); } }
return o;
