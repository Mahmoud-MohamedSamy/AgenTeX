// Cleanup of the 12 Nov evening run: every "QA AO WF" rule except I29; ledger tickets/records since 14:00 UTC except the I29 ticket; the P22 custom action + source.
const keep = JSON.parse(fs.readFileSync('../a4/i29.json', 'utf8'));
const out = {};
const rules = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF/.test(r.name || '') && !/^QA AO WF I29/.test(r.name));
for (const r of rules) { const d = await api('DELETE', '/workflow/rules/' + r.id); out['rule ' + d.s] = (out['rule ' + d.s] || 0) + 1; }
const L = JSON.parse(fs.readFileSync(LEDGER, 'utf8')).filter(x => x.at >= '2026-11-12T14:00' && x.id !== keep.ticket && x.id !== keep.rule);
for (const x of L.filter(x => x.k === 'ticket')) { const d = await api('DELETE', `/modules/${T}/records/` + x.id); out['ticket ' + d.s] = (out['ticket ' + d.s] || 0) + 1; }
for (const x of L.filter(x => x.k === 'customAction')) out['customAction'] = (await api('DELETE', '/workflow/custom-actions/' + x.id)).s;
for (const x of L.filter(x => x.k === 'apiSource')) out['apiSource'] = (await api('DELETE', '/workflow/custom-actions/sources/' + x.id)).s;
// tickets made by mkTicket in this run whose ledger tag differs: scan recent QA AO WF tickets (except I29)
const tk = arr2((await api('GET', `/modules/${T}/records?take=80`)).j?.data).filter(t => t.id !== keep.ticket && (t.data || []).some(f => f.field === 'subject' && /^QA AO WF (BH|M5|E15|P22|P23|O5|EV)/.test(f.value?.value || '')));
for (const t of tk) { const d = await api('DELETE', `/modules/${T}/records/` + t.id); out['ticket(scan) ' + d.s] = (out['ticket(scan) ' + d.s] || 0) + 1; }
const all = arr2((await api('GET', '/workflow/rules?take=500')).j?.data);
log({ out, rulesNow: all.length, qaLeft: all.filter(r => /^QA AO WF/.test(r.name)).map(r => r.name), customActions: arr2((await api('GET', '/workflow/custom-actions')).j?.data).filter(a => /QA AO WF/.test(a.name)).length, bh: (await api('GET', '/desk/business-hours')).j?.data?.preset });
