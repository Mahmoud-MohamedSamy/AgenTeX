const L = [];
const rr = await mkRR('QA AR FB seq', IDS.DB, SW('QA AR FB'), 'sequential', [IDS.A1, IDS.A2]); IDS.RR_FB = rr.id; saveIds(); L.push('rule ' + rr.s + (rr.e || ''));
L.push({ db: await openByType(IDS.DB), wl: { A1: await wlo(IDS.A1, IDS.DB), A2: await wlo(IDS.A2, IDS.DB) } });
return L;
