const o = JSON.parse(fs.readFileSync(RUN + '/out/ui10.json', 'utf8'));
const a = (await api('DELETE', '/workflow/rules/' + o.RID)).s, b = (await api('DELETE', '/desk/assignment-rules/' + o.AR)).s; await sleep(6000);
const items = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF/.test(JSON.stringify([i.record_label, i.name])));
const p = items.length ? (await api('POST', '/audit/recycle-bin/delete', { ids: items.map(i => i.id) })).s : 'none';
const left = { qaRules: (await allRules()).filter(r => /^QA WF /.test(r.name)).length, ar: arr((await api('GET', '/desk/assignment-rules?type=direct&department_id=' + DEPT2)).j?.data).filter(r => /QA WF/.test(r.name)).length };
ledger('CLEANUP ui10 ' + JSON.stringify({ a, b, p, left })); return { ruleDel: a, arDel: b, binPurge: p, binItems: items.length, left };
