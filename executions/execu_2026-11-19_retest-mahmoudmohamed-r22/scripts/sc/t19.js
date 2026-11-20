await updRec(I.A, { title: 'QA RT20 SC t9' }); await sleep(20000); return { A: await score(I.A), N: await score(I.N) };
