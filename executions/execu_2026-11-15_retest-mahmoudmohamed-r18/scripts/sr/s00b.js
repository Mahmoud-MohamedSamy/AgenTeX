const v = await recVals(I.k2ui.rec); const o = { val: String(v.qa_rt18sr_pl3), scoreBefore: v.score };
const u = await updRec(I.k2ui.rec, { first_name: 'QA k2ui' }); o.save = u.s; o.scoreAfter = await score(I.k2ui.rec); return o;
