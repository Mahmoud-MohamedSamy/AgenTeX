const o = {};
const def = DEF('3030 two editors', [ST('Open'), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('finish', 'Escalated', 'Closed')]);
const c = await mkBp(def, false); o.id = c.id; o.create = E(c.r);
const g0 = await getBp(c.id); o.rev0 = g0.revision; o.getKeys = Object.keys(g0);
// writer A (fresh copy) renames
const dA = JSON.parse(JSON.stringify(g0.definition)); dA.name = 'QA BP RT19 3030 two editors RENAMED A';
o.putA = E(await api('PUT', `/modules/${TK}/blueprints/${c.id}`, { definition: dA, isActive: false, revision: g0.revision }));
const g1 = await getBp(c.id); o.rev1 = g1.revision; o.name1 = g1.definition.name;
// writer B (stale copy rev0) changes description
const dB = JSON.parse(JSON.stringify(g0.definition)); dB.description = 'QA RT19 desc from stale B';
const pb = await api('PUT', `/modules/${TK}/blueprints/${c.id}`, { definition: dB, isActive: false, revision: g0.revision }); o.putBstale = E(pb);
// stale draft + publish path (designer uses draft/publish)
o.draftStale = E(await api('PUT', `/modules/${TK}/blueprints/${c.id}/draft`, { definition: dB, revision: g0.revision }));
const g2 = await getBp(c.id); o.after = { rev: g2.revision, name: g2.definition.name, desc: g2.definition.description, hasDraft: g2.hasDraft };
// stale save with no revision at all
o.putNoRev = E(await api('PUT', `/modules/${TK}/blueprints/${c.id}`, { definition: dB, isActive: false }));
const g3 = await getBp(c.id); o.afterNoRev = { rev: g3.revision, name: g3.definition.name, desc: g3.definition.description };
fs.writeFileSync(RUN + '/scripts/bp/3030.json', JSON.stringify(o, null, 1)); return o;
