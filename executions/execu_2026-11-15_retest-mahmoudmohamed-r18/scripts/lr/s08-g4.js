const mid = await modId(); const v = await recVals(mid, I.massA); const w = await recVals(mid, I.massB);
return { A: [v[FP + 'type'], v[FP + 'order']], B: [w[FP + 'type'], w[FP + 'order'], w[FP + 'note']] };
