const mid = await modId(); const g = (await getRule(mid, I.rdeep)).j.data; return { cond: JSON.stringify(g.branches[0].condition), lm: g.lastModifiedAt || g.updatedAt, rv: g.rowVersion };
