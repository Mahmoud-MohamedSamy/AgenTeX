await sleep(1500); const t0 = Date.now(); const r = await ask('How many open tickets can I see?');
return { app: process.env.APP, s: short(r), raw: r.notStream ? { status: r.status, j: r.j } : undefined, endMs: Date.now() - t0 };
