const mid = await modId(); return (await rules(mid)).map(r => [r.name, r.primaryField, r.status, r.layoutId && r.layoutId.slice(0, 8), JSON.stringify(r.branches.map(b => b.check))].join(' | '));
