// TC-01 retest 2, continued from the ledger after a network drop.
const LG = fs.readFileSync(LEDGER, 'utf8').split('\n').filter(l => l > '- 2026-11-23T10:0');
const id = re => ((LG.filter(l => re.test(l)).pop() || '').match(/([0-9a-f-]{36})\s*$/) || [])[1];
const R = { C: id(/rule "QA WF RT1C"/), S: id(/rule "QA WF RT1S"/), E: id(/rule "QA WF RT1E"/), B: id(/rule "QA WF RT1B"/) };
const TK = { Ch: id(/"QA WF RT1C high"/), Cm: id(/"QA WF RT1C default"/), Cl: id(/"QA WF RT1C low"/), S: id(/"QA WF RT1S x"/), E1: id(/"QA WF RT1E prio"/), E2: id(/"QA WF RT1E other"/), B: id(/"QA WF RT1B x"/) };
const runs = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ' ' + (e.triggerKind || '') + ' ' + (e.dispatches || []).map(d => d.status).join(','));
const out = { R, TK, before: { E1: await runs('E1', 'E'), E2: await runs('E2', 'E'), B: await runs('B', 'B'), E1prio: (await getTicket(TK.E1)).priority, Bprio: (await getTicket(TK.B)).priority } };
if (out.before.E1prio !== 'high') await patchTicket(TK.E1, { priority: 'high' });
if (!((await getTicket(TK.E2)).qa_ndc_company_name)) await patchTicket(TK.E2, { qa_ndc_company_name: 'other field' });
if (out.before.Bprio !== 'high') await patchTicket(TK.B, { priority: 'high' });
await sleep(30000);
out.v = {
  'On Create + Priority changed, created High': await runs('Ch', 'C'),
  'On Create + Priority changed, created default (Medium)': await runs('Cm', 'C'),
  'On Create + Priority changed, created Low': await runs('Cl', 'C'),
  'On Create + Subject changed': await runs('S', 'S'),
  'On Edit + Priority changed, priority edited Low→High': await runs('E1', 'E'),
  'On Edit + Priority changed, other field edited': await runs('E2', 'E'),
  'Create or Edit + Priority changed (create, then Low→High)': await runs('B', 'B'),
};
fs.writeFileSync(RUN + '/out/rt3.json', JSON.stringify(out, null, 1)); return out;
