const bm = await mkBp(BASIC('I15')); const src = await mkT('I15', 'merge source'); const dst = await mkT('I15X', 'merge target'); await waitIn(src);
const m = await api('POST', '/desk/tickets/merge', { master_ticket_id: dst, source_ticket_ids: [src], cc_list_from: 'target' });
const m2 = await api('POST', '/desk/tickets/merge', { master_ticket_id: src, source_ticket_ids: [dst], cc_list_from: 'target' }); await sleep(4000);
out('I15', { src: src.slice(0, 8), dst: dst.slice(0, 8), sourceInBlueprint: E(m), masterInBlueprint: E(m2), srcState: (await bstate(src))?.activeStates || null, dstGet: (await api('GET', `/modules/${TK}/records/${dst}`)).s, srcHist: (await hist(src)).slice(0, 5) });
out('cleanup', await cleanAll()); log(JSON.stringify(R, null, 1));
