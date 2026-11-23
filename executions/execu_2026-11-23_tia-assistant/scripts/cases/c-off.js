const p0 = await getPol();
fs.writeFileSync(RUN + '/out/policy-before-C.json', JSON.stringify(p0, null, 1));
const off = await setPol(d => { d.features.tia.enabled = false; });
const p1 = await getPol();
const stale = await setPol(d => { d.features.tia.enabled = true; }, { version: p0.version });
const own = await api('GET', '/agents/tia/status');
return { off, p1v: p1.version, tia: p1.descriptor.features.tia, agents: p1.descriptor.features.agents, stale, ownStatus: own.j?.data };
