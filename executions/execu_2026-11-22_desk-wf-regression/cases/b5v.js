// Rebuild batch 5 verdicts from the ledger (run was cut by my timeout after the restore).
const LG = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => l > '- 2026-11-22T21:17');
const id = re => (LG.find(l => re.test(l)) || '').match(/([0-9a-f-]{36})\s*$/)?.[1];
const R = {}; for (const k of ['TD06b', 'TD06w', 'TD06days', 'CF10in', 'CF10out', 'CF10hol']) R[k] = id(new RegExp(`rule "QA WF ${k}"`));
const TKn = { 'TD06b p1': 0, 'TD06w p1': 0, 'CF10in p1': 0, 'CF10out p1': 0, 'CF10hol p1': 0, 'TD06b p2': 0, 'TD06w p2': 0, 'CF10in p2': 0, 'CF10out p2': 0, 'CF10hol p3': 0, 'CF10in p3': 0 };
for (const k of Object.keys(TKn)) TKn[k] = id(new RegExp(`ticket "QA WF ${k}"`));
const rowsOf = async (t, r) => (await execs(t, r)).map(e => ({ o: outcome(e), at: e.createdAt || e.startedAt, sched: e.scheduledFor || e.scheduledAt || e.dueAt || e.runAt, keys: Object.keys(e).join(',') }));
const out = { R, TKn };
for (const [k, t] of Object.entries(TKn)) { const r = R[k.split(' ')[0]]; out[k] = await rowsOf(t, r); }
out.TD06daysSaved = !!R.TD06days;
out.bhNow = JSON.stringify((await api('GET', '/desk/business-hours')).j?.data).slice(0, 200);
out.holLists = arr((await api('GET', '/desk/holiday-lists')).j?.data).filter(x => /QA WF/.test(x.name)).length;
fs.writeFileSync(RUN + '/out/b5.json', JSON.stringify(out, null, 1));
return out;
