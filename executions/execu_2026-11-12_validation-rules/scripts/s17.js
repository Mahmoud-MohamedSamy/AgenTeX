const mid = await modId(); return (await rules(mid)).filter(r => /R4 pick|I2 double/.test(r.name)).map(r => [r.name, r.description, r.rowVersion, r.lastModifiedAt]);
