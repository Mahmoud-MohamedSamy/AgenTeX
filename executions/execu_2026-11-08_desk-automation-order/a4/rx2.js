const V = 'عربي 😀 <b>x</b> a‍b';
track('rule', 'f1da26ab-307d-4317-b1d4-053d6241f396', 'RX-E15');
const t1 = await mkTicket('E15', {}, 'match ' + V); track('ticket', t1.id, 'RX-E15'); const t2 = await mkTicket('E15', {}, 'nomatch عربي 😀 <b>x</b> ab'); track('ticket', t2.id, 'RX-E15');
await sleep(15000);
const e1 = await waitExec(t1.id, 1, 30), e2 = await execs(t2.id);
const g1 = await getTicket(t1.id), g2 = await getTicket(t2.id);
log({ match: { ex: e1.map(e => e.outcome), subject: g1.subject }, withoutZWJ: { ex: e2.map(e => e.outcome), subject: g2.subject } });
