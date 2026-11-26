const o = {};
o.cancel = E(await api.O('POST', `/desk/tickets/${ST.HI.t}/approvals/${ST.HI.a}/cancel`, {}));
for (const id of ['ce', 'cr', 'ctl']) o['rule_' + id] = (await api.O('DELETE', '/workflow/rules/' + ST.R3186[id])).s;
o.t1 = (await api.O('DELETE', `/modules/${T}/records/${ST.HI.t}`)).s; o.t2 = (await api.O('DELETE', `/modules/${T}/records/${ST.R3186.t}`)).s;
await sleep(8000); let pg = 0;
for (let k = 0; k < 5; k++) { const it = arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA PA|QA WF 3186/.test(JSON.stringify([i.record_label, i.name, i.title]))); if (!it.length) break; const d = await api.O('POST', '/audit/recycle-bin/delete', { ids: it.map(i => i.id) }); if (d.s < 300) pg += it.length; await sleep(3000); }
o.purged = pg;
o.left = { rules: arr((await api.O('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).filter(r => /^QA WF 3186|^QA PA/.test(r.name)).length, pending: ((await inbox('O', { list: 'all_pending', q: 'QA PA', page_size: 100 })).d?.approvals || []).length,
  bin: arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA PA|QA WF 3186/.test(JSON.stringify([i.record_label, i.name, i.title]))).length };
ledger('CLEANUP HI + 3186 evidence ' + JSON.stringify(o)); return o;
