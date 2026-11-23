// TC-04 confirm (second try, 23 Nov): 2× high→low, 2× low→high, 1 stays low.
const out = {}; const TK = {}; const RID = 'bb755ea7-2fa1-4587-b781-e7150c625305';
const at = s => new Date(Date.now() + s * 1000).toISOString();
const plan = { hl1: ['high', 'low'], hl2: ['high', 'low'], lh1: ['low', 'high'], lh2: ['low', 'high'], ll: ['low', null] };
for (const [k, [p]] of Object.entries(plan)) TK[k] = (await mkTicket('RTTC04', { department: DEPT2, priority: p, due_date: at(210) }, k)).id;
await sleep(20000);
for (const [k, [, p2]] of Object.entries(plan)) if (p2) await patchTicket(TK[k], { priority: p2 });
await sleep(240000);
for (const k of Object.keys(plan)) { const g = await getTicket(TK[k]); out[k] = { prio: g.priority, mark: g.qa_ndc_agency_code || '-', runs: (await execs(TK[k], RID)).map(e => outcome(e) + ' ' + (e.evaluatedAt || '').slice(11, 19)) }; }
return out;
