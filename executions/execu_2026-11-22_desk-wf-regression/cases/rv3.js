const o = JSON.parse(fs.readFileSync(RUN + '/out/rv1.json', 'utf8')); const out = {};
const TID = '7d65de68-9c59-44ec-acb3-741cc077282f'; ledger(`tag "zz wf rv92b" ${TID}`);
const r = await mkRule('RVCO92b', { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'WF' })], { departmentIds: [DEPT2], criteria: mem('tags', 'In', [TID]) });
const d = await api('DELETE', '/desk/tags/' + TID + '?confirm=true'); await sleep(2000);
const g = (await allRules()).find(x => x.id === r.id); out.CO92 = { save: r.s, tagDelete: d.s, ruleActive: g && g.isActive, ruleStillHasTag: JSON.stringify(g && g.criteria || '').includes(TID) };
// cleanup
const rules = [...Object.values(o.R), r.id].filter(Boolean); const tix = Object.values(o.TK).filter(Boolean);
let a = 0, b = 0; for (const id of rules) if ((await api('DELETE', '/workflow/rules/' + id)).s < 300) a++; for (const id of tix) if ((await api('DELETE', `/modules/${T}/records/${id}`)).s < 300) b++;
for (const x of (await allRules()).filter(x => /^QA WF RV/.test(x.name))) { await api('DELETE', '/workflow/rules/' + x.id); a++; }
await sleep(8000); let p = 0;
for (let k = 0; k < 5; k++) { const it = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF|zz wf/.test(JSON.stringify([i.record_label, i.name]))); if (!it.length) break; if ((await api('POST', '/audit/recycle-bin/delete', { ids: it.slice(0, 50).map(i => i.id) })).s < 300) p += Math.min(50, it.length); await sleep(3000); }
out.cleanup = { rules: a, tickets: b + '/' + tix.length, purged: p, qaRulesLeft: (await allRules()).filter(x => /^QA WF /.test(x.name)).length, binLeft: arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF|zz wf/.test(JSON.stringify([i.record_label]))).length };
ledger('CLEANUP rv ' + JSON.stringify(out.cleanup)); return out;
