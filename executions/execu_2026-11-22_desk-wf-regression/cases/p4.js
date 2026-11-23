const t = await mkTicket('PRB', { priority: 'urgent' });
const a = await getTicket(t.id); await sleep(15000); const b = await getTicket(t.id);
const bad = await api('POST', `/modules/${T}/records`, { data: [['subject','QA WF PRB bad'],['status','Open'],['department',DEPT],['email',QA_EMAIL],['classification','Problem']].map(([f,v])=>({field:f,value:enc(v)})), layout_id: STD_LAYOUT });
if (bad.j && bad.j.data && bad.j.data.id) ledger('ticket "QA WF PRB bad" '+bad.j.data.id);
const all = arr((await api('GET','/workflow/executions?take=30')).j.data).filter(e=>e.recordId===t.id).map(e=>e.ruleId);
return { t: t.id, atCreate: a.priority, after15s: b.priority, otherRuleRuns: all, manualBadPicklist: bad.s + ' ' + (errOf(bad)||'accepted') };
