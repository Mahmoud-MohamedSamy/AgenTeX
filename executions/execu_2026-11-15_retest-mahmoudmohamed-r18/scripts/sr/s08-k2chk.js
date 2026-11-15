const o = {}; o.recVal = (await recVals(I.k2ui.rec)).qa_rt18sr_pl3; o.score = await score(I.k2ui.rec);
await sleep(3000); o.recVal2 = (await recVals(I.k2ui.rec)).qa_rt18sr_pl3; o.score2 = await score(I.k2ui.rec);
const g = await getRule(I.k2ui.rule); o.rule = JSON.stringify({ e: g.j.data.entries, st: g.j.data.stale_entries, act: g.j.data.is_active });
// API-path record (K2b) kept Alpha and score
o.k2bVal = (await recVals(I.k2b.rec)).qa_rt18sr_pl2; o.k2bScore = await score(I.k2b.rec);
return o;
