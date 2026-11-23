const o = JSON.parse(fs.readFileSync(RUN + '/out/rt4.json', 'utf8'));
let r = 0, t = 0; for (const id of Object.values(o.R)) if ((await api('DELETE', '/workflow/rules/' + id)).s < 300) r++;
for (const id of Object.values(o.TK).flat()) if ((await api('DELETE', `/modules/${T}/records/${id}`)).s < 300) t++;
await sleep(8000); let p = 0;
for (let k = 0; k < 5; k++) { const it = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF/.test(JSON.stringify([i.record_label, i.name]))); if (!it.length) break; if ((await api('POST', '/audit/recycle-bin/delete', { ids: it.slice(0, 50).map(i => i.id) })).s < 300) p += Math.min(50, it.length); await sleep(3000); }
const out = { rules: r + '/2', tickets: t + '/6', purged: p, qaRulesLeft: (await allRules()).filter(x => /^QA WF /.test(x.name)).length };
ledger('CLEANUP rt4 ' + JSON.stringify(out)); return out;
