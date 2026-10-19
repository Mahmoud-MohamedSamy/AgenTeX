const g = await api('GET', '/workflow/approval-processes/059cb7ce-f538-4d3a-98d1-d32822dff08b'); const d = g.j.data;
const rule = d.rules[0]; const strip = o => JSON.stringify(o, (k, v) => (v === null ? undefined : v));
return done({ entryGuard: strip(d.entryGuard), ruleKeys: Object.keys(rule), levelKeys: Object.keys(rule.levels[0]), lockish: strip(Object.fromEntries(Object.entries(rule).filter(([k]) => /lock|modif|approv|reject|access|edit/i.test(k)))).slice(0, 1500) });
