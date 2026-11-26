const r = await api('GET', `/workflow/assignment-rules?moduleId=${M.leads}`); const l = arr(r.j?.data);
return { s: r.s, n: l.length, keys: l[0] ? Object.keys(l[0]) : null, rules: l.slice(0, 12).map(x => ({ name: x.name, active: x.isActive, entries: JSON.stringify(x.entries || x.ruleEntries || x.criteria || x.conditions || null).slice(0, 350) })) };
