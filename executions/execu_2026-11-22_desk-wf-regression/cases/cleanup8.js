const a = JSON.parse(fs.readFileSync(RUN + '/out/rt5.json', 'utf8')), b = JSON.parse(fs.readFileSync(RUN + '/out/rt5b.json', 'utf8'));
const rules = [...new Set([...Object.values(a.R), ...Object.values(b.R)].filter(Boolean))], tix = [...Object.values(a.TK).flat(), ...Object.values(b.TK).flat()].filter(Boolean);
let r = 0, t = 0; for (const id of rules) if ((await api('DELETE', '/workflow/rules/' + id)).s < 300) r++; for (const id of tix) if ((await api('DELETE', `/modules/${T}/records/${id}`)).s < 300) t++;
await sleep(8000); let p = 0;
for (let k = 0; k < 5; k++) { const it = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF/.test(JSON.stringify([i.record_label, i.name]))); if (!it.length) break; if ((await api('POST', '/audit/recycle-bin/delete', { ids: it.slice(0, 50).map(i => i.id) })).s < 300) p += Math.min(50, it.length); await sleep(3000); }
const out = { rules: r + '/' + rules.length, tickets: t + '/' + tix.length, purged: p, qaRulesLeft: (await allRules()).filter(x => /^QA WF /.test(x.name)).length, binLeft: arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF/.test(JSON.stringify([i.record_label]))).length };
ledger('CLEANUP rt5 ' + JSON.stringify(out)); return out;
