const o = JSON.parse(fs.readFileSync('../a4/a10.json')); const r = (await api('GET', '/workflow/rules/' + o.rule)).j?.data;
log({ sameName: r.name === o.name, sameUpdated: (r.updatedAt || r.updated_at) === o.updatedAt, active: r.isActive, exec: (await execs(o.t)).filter(e => e.rule === o.rule).length });
