const a = JSON.parse(fs.readFileSync(RUN + '/out/rt24-3186.json', 'utf8')); const c = JSON.parse(fs.readFileSync(RUN + '/out/rt24c-3186.json', 'utf8'));
const out = {}; let r = 0, t = 0;
for (const id of [...Object.values(a.R), ...Object.values(c.R)].filter(Boolean)) if ((await api('DELETE', '/workflow/rules/' + id)).s < 300) r++;
for (const x of (await allRules()).filter(x => /^QA WF R24/.test(x.name))) if ((await api('DELETE', '/workflow/rules/' + x.id)).s < 300) r++;
for (const id of [...Object.values(a.TK), ...Object.values(c.TK)].filter(Boolean)) if ((await api('DELETE', `/modules/${T}/records/${id}`)).s < 300) t++;
out.rules = r; out.tickets = t; await sleep(10000); let p = 0;
for (let k = 0; k < 6; k++) { const it = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF R24/.test(JSON.stringify([i.record_label, i.name, i.title]))); if (!it.length) break; const d = await api('POST', '/audit/recycle-bin/delete', { ids: it.map(i => i.id) }); if (d.s < 300) p += it.length; await sleep(3000); }
out.purged = p; out.qaRulesLeft = (await allRules()).filter(x => /^QA WF R24/.test(x.name)).length;
out.binLeft = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF R24/.test(JSON.stringify([i.record_label, i.name, i.title]))).length;
ledger('CLEANUP NDC-3186 retest ' + JSON.stringify(out)); return out;
