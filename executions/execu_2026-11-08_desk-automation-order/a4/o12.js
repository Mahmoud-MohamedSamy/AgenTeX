// O12: 3 active rules, 50 tickets created within ~1 minute; every run recorded once, no lost actions, record timing.
const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const TAG = S.made.tags[0];
const r1 = await mkRule('O12', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: 'QA AO WF O12 comment', commentPublic: false }], { name: 'QA AO WF O12 comment' });
const r2 = await mkRule('O12', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { description: { kind: 'string', stringValue: 'QA AO WF O12 updated' } } }], { name: 'QA AO WF O12 field' });
const r3 = await mkRule('O12', { kind: 'RecordCreated' }, [{ type: 'AddTags', tagIds: [TAG], mode: 'append' }], { name: 'QA AO WF O12 tag' });
const RULES = [r1.id, r2.id, r3.id]; const R = { rules: [r1.s, r2.s, r3.s] }; const ids = []; const t0 = Date.now();
for (let b = 0; b < 10; b++) { const batch = await Promise.all(Array.from({ length: 5 }, (_, i) => mkTicket('O12', {}, 'burst ' + (b * 5 + i + 1)))); batch.forEach(t => ids.push(t)); }
R.createSeconds = Math.round((Date.now() - t0) / 1000); R.createdOk = ids.filter(t => t.id).length; R.createErr = ids.filter(t => !t.id).map(t => t.s + ' ' + (t.err || '').slice(0, 80)).slice(0, 3);
fs.writeFileSync('../a4/o12.json', JSON.stringify({ rules: RULES, ids: ids.map(t => t.id).filter(Boolean), R }, null, 1));
let summary; for (let w = 0; w < 20; w++) { await sleep(15000); const rows = [];
  for (const t of ids.filter(t => t.id)) { const ex = arr2((await api('GET', `/workflow/executions?recordId=${t.id}`)).j?.data).filter(e => RULES.includes(e.ruleId)); rows.push(ex); }
  const per = rows.map(ex => ({ n: ex.length, dup: RULES.some(r => ex.filter(e => e.ruleId === r).length > 1), ok: ex.every(e => e.outcome === 'Fired' && (e.dispatches || []).every(d => d.status === 'Succeeded')), last: Math.max(...ex.map(e => Date.parse(e.evaluatedAt || 0)), ...ex.flatMap(e => (e.dispatches || []).map(d => Date.parse(d.completedAt || 0)))) }));
  summary = { waitedS: (w + 1) * 15, tickets: per.length, all3: per.filter(p => p.n === 3).length, dupTickets: per.filter(p => p.dup).length, allSucceeded: per.filter(p => p.ok).length, drainedS: Math.round((Math.max(...per.map(p => p.last)) - t0) / 1000) };
  if (summary.all3 === per.length && summary.allSucceeded === per.length) break; }
R.summary = summary;
const chk = []; for (const t of ids.filter(t => t.id).slice(0, 50)) { const g = await getTicket(t.id); const tg = (await api('GET', `/desk/tickets/${t.id}/tags`)).j?.data?.tags || []; chk.push(g.description === 'QA AO WF O12 updated' && tg.length === 1); }
R.fieldAndTagApplied = chk.filter(Boolean).length + '/' + chk.length;
fs.writeFileSync('../a4/o12.json', JSON.stringify({ rules: RULES, ids: ids.map(t => t.id).filter(Boolean), R }, null, 1)); log(JSON.stringify(R, null, 1));
