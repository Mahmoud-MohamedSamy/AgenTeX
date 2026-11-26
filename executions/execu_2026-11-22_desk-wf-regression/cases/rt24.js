// NDC-3186 retest (24 Nov): "changed" on On Create, plus controls.
const dchk = await api("GET", "/desk/departments/" + DEPT2); if (dchk.s >= 300) return { deptMissing: dchk.s };
const out = {}; const R = {}; const TK = {};
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' }, CE = { kind: 'RecordCreatedOrUpdated' };
const rule = async (k, trig, crit) => { const r = await mkRule(k, trig, [mark], { criteria: crit, departmentIds: [DEPT2] }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; };
const tk = async (k, tag, vals, suf) => { TK[k] = (await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf)).id; };
const runs = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ' ' + (e.triggerKind || '') + ' ' + (e.dispatches || []).map(d => d.status).join(','));
await rule('R24C', CR, changed('priority'));                 // On Create + Priority changed
await rule('R24S', CR, changed('subject'));                  // On Create + Subject changed
await rule('R24E', UP, changed('priority'));                 // On Edit control
await rule('R24B', CE, changed('priority'));                 // Create or Edit
await sleep(3000);
await tk('Ch', 'R24C', { priority: 'high' }, 'high'); await tk('Cm', 'R24C', {}, 'default'); await tk('Cl', 'R24C', { priority: 'low' }, 'low');
await tk('S', 'R24S', {}, 'x');
await tk('E1', 'R24E', { priority: 'low' }, 'prio'); await tk('E2', 'R24E', { priority: 'low' }, 'other');
await tk('B', 'R24B', { priority: 'low' }, 'x');
await sleep(20000);
out.createdRunsE = { prio: await runs('E1', 'R24E'), other: await runs('E2', 'R24E') };
await patchTicket(TK.E1, { priority: 'high' }); await patchTicket(TK.E2, { qa_ndc_company_name: 'other field' });
await patchTicket(TK.B, { priority: 'high' });
await sleep(30000);
out.v = {
  'On Create + Priority changed, created High': await runs('Ch', 'R24C'),
  'On Create + Priority changed, created default (Medium)': await runs('Cm', 'R24C'),
  'On Create + Priority changed, created Low': await runs('Cl', 'R24C'),
  'On Create + Subject changed': await runs('S', 'R24S'),
  'On Edit + Priority changed, priority edited Low→High': await runs('E1', 'R24E'),
  'On Edit + Priority changed, other field edited': await runs('E2', 'R24E'),
  'Create or Edit + Priority changed (create, then Low→High)': await runs('B', 'R24B'),
};
out.R = R; out.TK = TK; fs.writeFileSync(RUN + '/out/rt24-3186.json', JSON.stringify(out, null, 1)); return out.v;
