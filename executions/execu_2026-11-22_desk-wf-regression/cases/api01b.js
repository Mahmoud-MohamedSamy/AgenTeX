const id = JSON.parse(fs.readFileSync(RUN + '/out/api01.json', 'utf8')).id; const g = (await allRules()).find(x => x.id === id);
const out = { storedCriteria: JSON.stringify(g && g.criteria), active: g && g.isActive, actions: g && g.actions.length };
out.deleted = (await api('DELETE', '/workflow/rules/' + id)).s; await sleep(5000);
const it = arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).filter(i => /QA WF/.test(JSON.stringify([i.record_label, i.name]))); if (it.length) out.purged = (await api('POST', '/audit/recycle-bin/delete', { ids: it.map(i => i.id) })).s;
out.qaRulesLeft = (await allRules()).filter(x => /^QA WF /.test(x.name)).length; ledger('CLEANUP api01 ' + JSON.stringify(out)); return out;
