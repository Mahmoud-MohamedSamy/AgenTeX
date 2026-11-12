const mid = await modId(); const n = await delAllQARules(mid); I.rules = []; SAVE(); return { deleted: n, left: (await rules(mid)).map(r => r.name) };
