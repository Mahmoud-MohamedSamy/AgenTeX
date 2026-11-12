// Cleanup for the evidence run (ev1/ev2 + screen rules EV2/EV4/EV10), 12 Nov afternoon. Deletes only ledger items tagged EV* and rules named "QA AO WF EV…".
const L = JSON.parse(fs.readFileSync(LEDGER, 'utf8')).filter(x => x.at >= '2026-11-12T13:30' && /^EV/.test(x.tag || ''));
const out = {};
for (const x of L) {
  const p = x.k === 'rule' ? '/workflow/rules/' : x.k === 'action' ? '/workflow/actions/' : x.k === 'ticket' ? `/modules/${T}/records/` : x.k.startsWith('record:') ? `/modules/${x.k.slice(7)}/records/` : null;
  if (!p) continue; const r = await api('DELETE', p + x.id); out[x.k.split(':')[0] + ' ' + r.s] = (out[x.k.split(':')[0] + ' ' + r.s] || 0) + 1;
}
// rules saved on screen that might not be in the ledger
const rules = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF EV/.test(r.name || ''));
for (const r of rules) { const d = await api('DELETE', '/workflow/rules/' + r.id); out['screen rule ' + d.s] = (out['screen rule ' + d.s] || 0) + 1; }
// tickets with EV subjects created today (incl. the EV13 one that was created)
const tk = arr2((await api('GET', `/modules/${T}/records?take=60`)).j?.data);
const evT = tk.filter(t => (t.data || []).some(f => f.field === 'subject' && /^QA AO WF EV/.test(f.value?.value || f.value?.stringValue || '')));
for (const t of evT) { const d = await api('DELETE', `/modules/${T}/records/` + t.id); out['ticket(scan) ' + d.s] = (out['ticket(scan) ' + d.s] || 0) + 1; }
const left = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF/.test(r.name || '')).map(r => r.name);
const total = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).length;
log(JSON.stringify({ out, leftQAAOWF: left, totalRules: total }));
