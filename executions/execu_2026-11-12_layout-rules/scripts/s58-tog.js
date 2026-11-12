const mid = await modId(); const g = (await getRule(mid, I.r2)).j.data; return SR(await putRule(mid, I.r2, { ...g, status: process.env.S }));
