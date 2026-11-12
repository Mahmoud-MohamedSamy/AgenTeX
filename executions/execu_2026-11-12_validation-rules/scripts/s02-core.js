const mid = await modId(); const L = I.layout; const isDesk = APP === 'desk';
let base = { first_name: 'QA', last_name: P + ' rec' };
if (isDesk) { const c = arr((await api('GET', '/modules/' + (await modId('desk_contacts')) + '/records?limit=1')).j?.data)[0]; const depts = arr((await api('GET', '/desk/departments')).j?.data); I.depts = depts.map(d => [d.id, d.name]); SAVE(); base = { subject: P + ' rec', contact_id: c && c.id, status: 'Open', department: (I.depts.find(d => /customer/i.test(d[1])) || I.depts[0])[0] }; }
I.base = base; SAVE();
const rec = (v, lid = L, extra) => mkRec(mid, { ...base, ...v }, lid);
// R1 / R5
const r1 = await mkRule(mid, { name: P + ' R1 text', layoutId: L, primaryField: 'qa_vr_text', branches: [B(C('startsWith', 'qa_vr_text', 'BAD'), 'QA R1 text cannot start with BAD')] });
log('R1 rule', SR(r1).slice(0, 300)); if (r1.s >= 300) return 'stop';
const rid = r1.j.data.id; I.r1 = rid; SAVE(); log('R1 saved', JSON.stringify({ ce: r1.j.data.conditionError, w: r1.j.data.warnings, lay: r1.j.data.layoutId }));
const bad = await api('POST', '/modules/' + mid + '/records', { data: Object.entries({ ...base, qa_vr_text: 'BAD-1' }).map(([k, v]) => ({ field: k, value: enc(v) })), layout_id: L });
const good = await rec({ qa_vr_text: 'OK-1' });
let upd = null; if (good.id) upd = await updRec(mid, good.id, { qa_vr_text: 'BAD-2' });
const other = await rec({ qa_vr_text: 'BAD-3' }, I.defLayout);
RES(isDesk ? 'R5' : 'R1', bad.s === 422 && good.s < 300 && upd && upd.s === 422 ? 'PASS' : 'FAIL', `bad create ${SR(bad).slice(0, 300)} | good ${good.s} ${good.err} | update to bad ${upd && SR(upd.r).slice(0, 200)}`);
RES('E12', 'INFO', 'error body ' + bad.t.slice(0, 600));
RES('C5', other.s < 300 ? 'PASS' : 'FAIL', `rule on QA layout; same bad value on default layout -> ${other.s} ${other.err}`);
I.goodRec = good.id; SAVE();
// verify endpoint
const vf = await api('POST', VR(mid) + '/verify', { field: 'qa_vr_text', data: { qa_vr_text: 'BAD-x' }, layoutId: L, recordId: null });
const vf2 = await api('POST', VR(mid) + '/verify', { field: 'qa_vr_text', data: { qa_vr_text: 'fine' }, layoutId: L, recordId: null });
RES('E6-api', vf.j && vf.j.data && vf.j.data.results[0] && vf.j.data.results[0].status !== 'ok' ? 'PASS' : 'FAIL', `verify bad -> ${vf.s} ${vf.t.slice(0, 400)} | fine -> ${vf2.s} ${vf2.t.slice(0, 200)}`);
// R2 nonsense
const bads = { op: { check: C('bogusOp', 'qa_vr_text', 'x') }, field: { check: C('eq', 'no_such_field', 'x') }, nobranch: null, lookup: { pf: isDesk ? 'contact_id' : 'connected_to' }, checkbox: { pf: 'qa_vr_chk' }, regex: { check: C('regexMatches', 'qa_vr_text', '([a-z') } };
const r2 = {}; const pfs = ['qa_vr_note','qa_vr_ml','qa_vr_url','qa_vr_email','qa_vr_phone','qa_vr_dec']; let pi = 0;
for (const [k, v] of Object.entries(bads)) {
  const pf = (v && v.pf) || pfs[pi++];
  const body = { name: P + ' R2 ' + k, layoutId: L, primaryField: pf, branches: v === null ? [] : [B((v.check) || C('isNull', pf), 'QA R2 ' + k)] };
  const r = await mkRule(mid, body); r2[k] = SR(r).slice(0, 220) + (r.j && r.j.data ? ' ce=' + r.j.data.conditionError : '');
  if (r.s < 300) { const t = await rec({ qa_vr_text: 'lookup-test' }); r2[k] += ' | record with empty ' + pf + ' -> ' + t.s + ' ' + t.err.slice(0, 120); const d = await delRule(mid, r.j.data.id); r2[k] += ' | deleted ' + d.s; }
}
log('R2', r2);
RES(isDesk ? 'R2-desk' : 'R2', Object.entries(r2).every(([k,x]) => k === 'lookup' || x.startsWith('4')) ? 'PASS' : 'FAIL', JSON.stringify(r2));
// R4 pick list
const r4 = await mkRule(mid, { name: P + ' R4 pick', layoutId: L, primaryField: 'qa_vr_pick', branches: [B(C('in', 'qa_vr_pick', ['Reject']), 'QA R4 pick cannot be Reject')] });
const p1 = await rec({ qa_vr_pick: 'Reject' }), p2 = await rec({ qa_vr_pick: 'Open' });
RES(isDesk ? 'D11-desk' : 'R4', r4.s < 300 && p1.s === 422 && p2.s < 300 ? 'PASS' : 'FAIL', `rule ${SR(r4).slice(0, 150)} | Reject ${p1.s} ${p1.err.slice(0, 150)} | Open ${p2.s}`);
// J8 inactive
const g = (await getRule(mid, rid)).j.data;
const off = await putRule(mid, rid, { ...g, status: 'disabled' });
const offRec = await rec({ qa_vr_text: 'BAD-off' });
const g2 = (await getRule(mid, rid)).j.data; const on = await putRule(mid, rid, { ...g2, status: 'active' });
RES('J8', off.s < 300 && offRec.s < 300 ? 'PASS' : 'FAIL', `disable ${SR(off).slice(0, 120)} -> bad record ${offRec.s} ${offRec.err.slice(0, 100)}; re-enable ${on.s}`);
// I3 rowVersion
const g3 = (await getRule(mid, rid)).j.data; const { rowVersion, ...noRv } = g3;
const pNo = await putRule(mid, rid, { ...noRv, description: 'no rv' });
const g4 = (await getRule(mid, rid)).j.data;
const pOld = await putRule(mid, rid, { ...g4, rowVersion: g4.rowVersion - 1, description: 'old rv' });
const pOk = await putRule(mid, rid, { ...g4, description: 'right rv' });
RES('I3', pOld.s === 409 || pOld.s === 412 ? (pNo.s >= 400 ? 'PASS' : 'INFO') : 'FAIL', `PUT no rowVersion ${SR(pNo).slice(0, 160)} | old rowVersion ${SR(pOld).slice(0, 160)} | right ${pOk.s}`);
// C17 same name
const dup = await mkRule(mid, { name: P + ' R1 text', layoutId: L, primaryField: 'qa_vr_note', branches: [B(C('eq', 'qa_vr_note', 'zz'), 'QA dup')] });
RES('C17', 'INFO', 'same name twice -> ' + SR(dup).slice(0, 200));
// K3 other module
const other_m = await modId(isDesk ? 'desk_contacts' : 'contacts');
const k3 = await getRule(other_m, rid); const k3d = await delRule(other_m, rid); const still = await getRule(mid, rid);
RES('K3', k3.s === 404 && k3d.s === 404 && still.s === 200 ? 'PASS' : 'FAIL', `GET via other module ${k3.s}; DELETE via other module ${k3d.s}; rule still there ${still.s}`);
// A8 signed out is done by curl separately
return 'ok';
