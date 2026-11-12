// J6: no business hours (tenant 24/7): "2 hours before due, business hours" should count elapsed time.
const mark = t => [{ type: 'AddTicketComment', commentBody: `QA AO WF ${t} fired`, commentPublic: false }];
const o = JSON.parse(fs.readFileSync('../a4/bh1-out.json', 'utf8'));
const due = new Date(Date.now() + 2 * 3600e3 + 4 * 60e3);
const t1 = await mkTicket('BH J5bh', { due_date: due.toISOString() }, 'j6 business'); const t2 = await mkTicket('BH J5wall', { due_date: due.toISOString() }, 'j6 wall');
const start = Date.now(); let e1 = [], e2 = [];
for (let i = 0; i < 40; i++) { await sleep(20000); e1 = (await execs(t1.id)).filter(e => e.rule === o.jb); e2 = (await execs(t2.id)).filter(e => e.rule === o.jw); if (e1.some(e => e.outcome === 'Fired') && e2.some(e => e.outcome === 'Fired')) break; }
log({ dueUtc: due.toISOString(), expectedFireUtc: new Date(due - 7200e3).toISOString(), business: e1.map(e => e.outcome), wall: e2.map(e => e.outcome), waitedMin: Math.round((Date.now() - start) / 60000) });
