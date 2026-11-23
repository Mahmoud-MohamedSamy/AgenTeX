// TC-01 retest 2 (23 Nov): "changed" on On Create, plus controls.
const out = {}; const R = {}; const TK = {};
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' }, CE = { kind: 'RecordCreatedOrUpdated' };
const rule = async (k, trig, crit) => { const r = await mkRule(k, trig, [mark], { criteria: crit, departmentIds: [DEPT2] }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; };
const tk = async (k, tag, vals, suf) => { TK[k] = (await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf)).id; };
const runs = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ' ' + (e.triggerKind || '') + ' ' + (e.dispatches || []).map(d => d.status).join(','));
await rule('RT1C', CR, changed('priority'));                 // On Create + Priority changed
await rule('RT1S', CR, changed('subject'));                  // On Create + Subject changed
await rule('RT1E', UP, changed('priority'));                 // On Edit control
await rule('RT1B', CE, changed('priority'));                 // Create or Edit
await sleep(3000);
await tk('Ch', 'RT1C', { priority: 'high' }, 'high'); await tk('Cm', 'RT1C', {}, 'default'); await tk('Cl', 'RT1C', { priority: 'low' }, 'low');
await tk('S', 'RT1S', {}, 'x');
await tk('E1', 'RT1E', { priority: 'low' }, 'prio'); await tk('E2', 'RT1E', { priority: 'low' }, 'other');
await tk('B', 'RT1B', { priority: 'low' }, 'x');
await sleep(20000);
out.createdRunsE = { prio: await runs('E1', 'RT1E'), other: await runs('E2', 'RT1E') };
await patchTicket(TK.E1, { priority: 'high' }); await patchTicket(TK.E2, { qa_ndc_company_name: 'other field' });
await patchTicket(TK.B, { priority: 'high' });
await sleep(30000);
out.v = {
  'On Create + Priority changed, created High': await runs('Ch', 'RT1C'),
  'On Create + Priority changed, created default (Medium)': await runs('Cm', 'RT1C'),
  'On Create + Priority changed, created Low': await runs('Cl', 'RT1C'),
  'On Create + Subject changed': await runs('S', 'RT1S'),
  'On Edit + Priority changed, priority edited Low→High': await runs('E1', 'RT1E'),
  'On Edit + Priority changed, other field edited': await runs('E2', 'RT1E'),
  'Create or Edit + Priority changed (create, then Low→High)': await runs('B', 'RT1B'),
};
out.R = R; out.TK = TK; fs.writeFileSync(RUN + '/out/rt3.json', JSON.stringify(out, null, 1)); return out.v;
