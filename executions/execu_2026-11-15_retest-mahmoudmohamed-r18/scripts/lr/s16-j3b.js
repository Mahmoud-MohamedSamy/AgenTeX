const mid = await modId(); const out = {};
for (const k of ['rVip', 'rBasic']) { const g = (await getRule(mid, I[k])).j.data; out[k] = { staleTargets: g.staleTargets, warnings: g.warnings, branches: JSON.stringify(g.branches).slice(0, 300) }; }
return out;
