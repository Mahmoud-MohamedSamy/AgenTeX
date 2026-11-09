const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', M2 = 'bb375218-6a5d-48ec-a832-fb062fd0311b', LM = '98c36ff8-3621-411b-b373-14455f4df087', L2 = '3a58c8a9-a334-4607-b4b3-c5129751f3ab', out = {}, ids = [];
const s = v => ({ kind: 'string', value: v }), n = v => ({ kind: 'number', value: v });
const v = (j, f) => { const d = j && j.data && j.data.data; const x = (d || []).find(e => e.field === f); return x && x.value && (x.value.value !== undefined ? x.value.value : x.value); };
const mk = async (data) => { const r = await call('POST', `/modules/${M}/records`, { layout_id: LM, data }); if (r.s < 300) ids.push(r.j.data.id); return r; };
const a = await mk([{ field: 'name', value: s('QA W5 R1') }, { field: 'qa_w5_email', value: s('qa.w5.r1@example.com') }, { field: 'qa_w5_pick_list', value: s('Red') }, { field: 'qa_w5_phone', value: s('01011112222') }]);
out.create = a.s + ' ' + (a.s < 300 ? '' : a.t.slice(0, 300));
const noReq = await mk([{ field: 'name', value: s('QA W5 R2 no pick') }]); out.requiredPickMissing = noReq.s + ' ' + noReq.t.slice(0, 220);
const dupEmail = await mk([{ field: 'name', value: s('QA W5 R3 dup') }, { field: 'qa_w5_email', value: s('QA.W5.R1@example.com') }, { field: 'qa_w5_pick_list', value: s('Green') }]); out.duplicateEmailOtherCase = dupEmail.s + ' ' + dupEmail.t.slice(0, 220);
const dupEmail2 = await mk([{ field: 'name', value: s('QA W5 R4 dup') }, { field: 'qa_w5_email', value: s('qa.w5.r1@example.com') }, { field: 'qa_w5_pick_list', value: s('Green') }]); out.duplicateEmailSame = dupEmail2.s + ' ' + dupEmail2.t.slice(0, 220);
const badPick = await mk([{ field: 'name', value: s('QA W5 R5 bad pick') }, { field: 'qa_w5_pick_list', value: s('Purple') }]); out.pickNotAllowed = badPick.s + ' ' + badPick.t.slice(0, 200);
if (a.s < 300) {
  const g = await call('GET', `/modules/${M}/records/${a.j.data.id}`);
  out.formula = v(g.j, 'qa_w5_formula'); out.autoNumber = v(g.j, 'qa_w5_auto_number');
  // children for rollup
  for (const amt of [5, 7]) { const c = await call('POST', `/modules/${M2}/records`, { layout_id: L2, data: [{ field: 'name', value: s('QA W5 child ' + amt) }, { field: 'qa_w5_parent', value: s(a.j.data.id) }, { field: 'qa_w5_amount', value: n(amt) }] }); out['child' + amt] = c.s + ' ' + (c.s < 300 ? c.j.data.id : c.t.slice(0, 200)); if (c.s < 300) (globalThis.__kids = globalThis.__kids || []).push(c.j.data.id); }
  await new Promise(r => setTimeout(r, 8000));
  const g2 = await call('GET', `/modules/${M}/records/${a.j.data.id}`); out.rollupCount = v(g2.j, 'qa_w5_rollup_count'); out.rollupSum = v(g2.j, 'qa_w5_rollup_sum');
}
out.ids = ids; out.kids = globalThis.__kids || []; return out;
