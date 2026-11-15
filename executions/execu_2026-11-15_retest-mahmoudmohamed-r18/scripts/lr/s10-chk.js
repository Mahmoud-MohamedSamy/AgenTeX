const mid = await modId(); const dm = await modId('deals'); const a = await recVals(mid, I.bpRec); const d = await recVals(dm, I.dealRec);
return { bp: [a[FP + 'type'], a[FP + 'order']], deal: [d.stage, d.discount, d.qa_rt18_appnote] };
