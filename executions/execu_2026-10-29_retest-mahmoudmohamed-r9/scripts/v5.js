const out = {}; for (let j = 0; j < 45 && /Loading activity/.test(await txt()); j++) await sleep(2000); await sleep(2000);
await shot('v5-deal-timeline'); out.timeline = (await txt()).split('\n').filter(l => /created|Created/.test(l)).slice(0, 4);
return done(out);
