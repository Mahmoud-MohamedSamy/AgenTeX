const out = {};
const all = await allRules();
const rT = all.find(r => r.name === 'QA WF OBtest');
const tT = (fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => l.includes('"QA WF OBtest ticket"')).pop() || '').split(' ').pop();
const m = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT, triggerKind: 'RecordCreated', fields: { priority: S('high') } });
const n = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT, triggerKind: 'RecordCreated', fields: { priority: S('low') } });
const bad = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT, triggerKind: 'RecordCreated', fields: 'not json' });
const { id, version, createdAt, updatedAt, createdBy, updatedBy, position, ...draft } = rT;
const ev = await api('POST', '/workflow/rules/evaluate', { rule: draft, sampleRecord: { recordId: 'rec-sample', triggerKind: 'RecordCreated', fields: { subject: S('QA WF OBtest x'), priority: S('high') } } });
await sleep(6000);
out.OB = { match: m.s + ' ' + m.t.slice(0, 400), noMatch: n.s + ' ' + n.t.slice(0, 250), badFields: bad.s + ' ' + bad.t.slice(0, 150), evaluate: ev.s + ' ' + ev.t.slice(0, 300), ticketUnchanged: (await getTicket(tT)).qa_ndc_company_name || 'unchanged', realRuns: (await execs(tT, rT.id)).length };
// XSS name stored
const x = all.find(r => r.name.includes('<script>')) ; out.xssLeft = x ? x.name : 'deleted ok';
// reorder with all ids: move 'QA WF MRord 2' before 'QA WF MRord'
const ordered = all.sort((a, b) => a.position - b.position).map(r => r.id);
const r1 = all.find(r => r.name === 'QA WF MRord'), r2 = all.find(r => r.name === 'QA WF MRord 2');
const before = { r1: ordered.indexOf(r1.id), r2: ordered.indexOf(r2.id) };
const re = ordered.filter(i => i !== r2.id); re.splice(re.indexOf(r1.id), 0, r2.id);
const ro = await api('PUT', '/workflow/rules/reorder', { moduleId: T, orderedRuleIds: re });
const t2 = await mkTicket('MRord', {}, 'reordered'); await sleep(30000);
const after = (await allRules()).sort((a, b) => a.position - b.position).map(r => r.id);
out.reorder = { before, put: ro.s + ' ' + (errOf(ro) || ''), afterPos: { r1: after.indexOf(r1.id), r2: after.indexOf(r2.id) }, value: (await getTicket(t2.id)).qa_ndc_agency_code, firstTicketValue: 'SECOND' };
return out;
