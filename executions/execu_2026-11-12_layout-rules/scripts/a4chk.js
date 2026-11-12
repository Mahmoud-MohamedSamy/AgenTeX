const mid = await modId(); return (await rules(mid, '?layoutId=' + I.layout)).map(x => x.name + ':' + x.sortOrder + ':' + x.status);
