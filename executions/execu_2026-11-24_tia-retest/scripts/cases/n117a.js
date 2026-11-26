const t0 = Date.now(); const r = await ask('Give me a detailed summary of every open lead and every open deal I can see, grouped by owner and stage, with totals.');
return { app: process.env.APP, startedMs: 0, s: short(r), endMs: Date.now() - t0 };
