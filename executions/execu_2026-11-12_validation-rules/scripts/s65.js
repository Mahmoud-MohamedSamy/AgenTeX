const mid = await modId(); const g = (await getRule(mid, I.i8)).j.data; await delRule(mid, I.i8); return 'description now: ' + JSON.stringify(g.description) + ' rowVersion ' + g.rowVersion;
