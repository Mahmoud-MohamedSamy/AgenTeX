const LG = fs.readFileSync(LEDGER, 'utf8').split('\n').filter(l => l > '- 2026-11-23T10:0' && /"QA WF RT1/.test(l));
const ids = re => [...new Set(LG.filter(l => re.test(l)).map(l => (l.match(/([0-9a-f-]{36})\s*$/) || [])[1]).filter(Boolean))];
const del = async (p, list) => { let ok = 0; for (const i of list) if ((await api('DELETE', p + i)).s < 300) ok++; return ok + '/' + list.length; };
const out = { rules: await del('/workflow/rules/', ids(/ rule "/)), tickets: await del(`/modules/${T}/records/`, ids(/ ticket "/)) };
await sleep(8000); let purged = 0;
for (let p = 0; p < 5; p++) { const it = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF/.test(JSON.stringify([i.record_label, i.name]))); if (!it.length) break; if ((await api('POST', '/audit/recycle-bin/delete', { ids: it.slice(0, 50).map(i => i.id) })).s < 300) purged += Math.min(50, it.length); await sleep(3000); }
out.purged = purged; out.qaRulesLeft = (await allRules()).filter(r => /^QA WF /.test(r.name)).length;
out.binLeft = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF/.test(JSON.stringify([i.record_label]))).length;
ledger('CLEANUP rt3 ' + JSON.stringify(out)); return out;
