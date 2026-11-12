const mid = await modId(); const r = (await rules(mid)); return r.filter(x => /R4|R1 text/.test(x.name)).map(x => x.name + ' ' + x.status + ' ' + JSON.stringify(x.branches[0].message.en));
