const out = {}; const mods = arr((await api('GET', '/modules')).j?.data).filter(m => /leads|deals|contacts/.test(m.moduleKey));
for (const m of mods) { const b = arr((await api('GET', `/modules/${m.id}/blueprints`)).j?.data); for (const bp of b) { const full = (await api('GET', `/modules/${m.id}/blueprints/${bp.id}`)).j?.data || bp; const tr = full.definition?.transitions || []; const acts = tr.flatMap(t => (t.after?.actions || []).map(a => JSON.stringify(a).slice(0, 220))); if (acts.length) out[m.moduleKey + ' ' + (full.name || bp.id)] = [...new Set(acts)].slice(0, 6); } }
return done(out);
