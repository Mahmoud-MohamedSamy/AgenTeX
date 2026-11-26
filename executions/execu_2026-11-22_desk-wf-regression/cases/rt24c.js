// NDC-3186 control: plain On Create rule (guard only) must fire on create; Create or Edit + changed must not.
const out = {}; const R = {}; const TK = {};
const mark = FU({ qa_ndc_agency_code: 'WF' });
const rule = async (k, trig, crit) => { const r = await mkRule(k, trig, [mark], { criteria: crit, departmentIds: [DEPT2] }); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; };
await rule('R24K', { kind: 'RecordCreated' });
await rule('R24B2', { kind: 'RecordCreatedOrUpdated' }, changed('subject'));
await sleep(3000);
TK.K = (await mkTicket('R24K', { department: DEPT2 }, 'ctl')).id;
TK.B2 = (await mkTicket('R24B2', { department: DEPT2, priority: 'urgent' }, 'x')).id;
await sleep(25000);
const runs = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ' ' + (e.triggerKind || ''));
out.v = { 'Control On Create no condition': await runs('K', 'R24K'), 'Create or Edit + Subject changed, on create': await runs('B2', 'R24B2'), markOnB2: (await getTicket(TK.B2)).qa_ndc_agency_code || null, markOnK: (await getTicket(TK.K)).qa_ndc_agency_code || null };
out.R = R; out.TK = TK; fs.writeFileSync(RUN + '/out/rt24c-3186.json', JSON.stringify(out, null, 1)); return out;
