const ev = L((await api('GET', '/audit/events?app_key=desk&limit=200')).j?.data).filter(x => x.occurred_at >= '2026-11-12T22:40');
out('H12_M4', ev.filter(x => /blueprint/i.test(x.target_type + x.action)).slice(0, 12).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' | ' + x.target_type + ' | ' + x.target_label));
const bm = await mkBp(BASIC('I15')); const src = await mkT('I15', 'merge source'); const dst = await mkT('I15X', 'merge target'); await waitIn(src);
const m1 = await api('POST', '/desk/tickets/merge', { master_ticket_id: dst, ticket_ids: [src], source_ticket_ids: [src], cc_list_from: 'target' }); await sleep(5000);
out('I15', { merge: E(m1), srcGet: (await api('GET', `/modules/${TK}/records/${src}`)).s, srcState: (await bstate(src))?.activeStates || null, count: L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).find(b => b.id === bm.id)?.inProgressCount, dstHist: (await hist(dst)).slice(0, 4) });
out('cleanup', await cleanAll()); log(JSON.stringify(R, null, 1));
