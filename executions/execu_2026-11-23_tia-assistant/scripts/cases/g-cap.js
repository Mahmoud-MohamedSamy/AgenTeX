const C = JSON.parse(process.env.CAP);
const r = await setPol(d => { const t = d.features.tia; for (const [k, v] of Object.entries(C)) { if (v === null) delete t[k]; else t[k] = v; } });
const p = await getPol();
return { put: r.s, err: r.err?.code, msg: r.err?.message, tia: p.descriptor.features.tia, v: p.version };
