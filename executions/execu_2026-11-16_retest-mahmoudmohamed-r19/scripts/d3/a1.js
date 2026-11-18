const o = {};
const cnt = async () => L((await api('GET', `/modules/${TK}/blueprints`)).j?.data).filter(b => /QA BP RT19 D3/.test(b.definition?.name || '')).length;
o.before = await cnt();
const base = (tag, before) => DEF(tag, [ST('Open'), ST('Closed', { isTerminal: true })], [TR('x', 'Open', 'Closed', { before })]);
const tryPost = async (tag, before) => { const r = await api('POST', `/modules/${TK}/blueprints`, { definition: base(tag, before), isActive: false }); if (r.j?.data?.id) { made.bps.push(r.j.data.id); keep(); LED('UNEXPECTED blueprint stored ' + r.j.data.id); } return { s: r.s, code: r.j?.error?.code, msg: r.j?.error?.message, det: r.j?.error?.details }; };
// 3069
o.p1 = await tryPost('D3 3069 bad', { allowedUserIds: ['not-a-uuid'] });
o.p2 = await tryPost('D3 3069 bad2', { allowedUserIds: [OWNER, '12345'] });
o.p3 = await tryPost('D3 3069 num', { allowedUserIds: [42] });
o.p4 = await tryPost('D3 3069 unknown', { allowedUserIds: ['00000000-0000-0000-0000-0000000000aa'] });
o.afterPosts = await cnt();
// 3070: my own inactive blueprint
const b = await mkBp(base('D3 3070 rev', {}), false); o.mk = E(b.r); const id = b.id; o.id = id;
const g0 = await getBp(id); o.g0 = { rev: g0.revision, name: g0.definition.name };
// put bad id on existing (3069 PUT path)
const dBad = JSON.parse(JSON.stringify(g0.definition)); dBad.transitions[0].before = { allowedUserIds: ['not-a-uuid'] };
const rp = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: dBad, isActive: false, revision: g0.revision }); o.p5put = { s: rp.s, code: rp.j?.error?.code, msg: rp.j?.error?.message, det: rp.j?.error?.details };
const g0b = await getBp(id); o.g0b = { rev: g0b.revision, owners: g0b.definition.transitions[0].before };
const dA = JSON.parse(JSON.stringify(g0b.definition)); dA.name = 'QA BP RT19 D3 3070 renamed by A';
o.putA = E(await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: dA, isActive: false, revision: g0b.revision }));
const g1 = await getBp(id); o.g1 = { rev: g1.revision, name: g1.definition.name };
const dB = JSON.parse(JSON.stringify(g0b.definition)); dB.description = 'QA RT19 D3 stale B no revision';
const r1 = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: dB, isActive: false }); o.putNoRev = { s: r1.s, code: r1.j?.error?.code, msg: r1.j?.error?.message, det: r1.j?.error?.details };
const r2 = await api('PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: dB }); o.draftNoRev = { s: r2.s, code: r2.j?.error?.code, msg: r2.j?.error?.message, det: r2.j?.error?.details };
const r2n = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: dB, isActive: false, revision: null }); o.putNullRev = { s: r2n.s, code: r2n.j?.error?.code, msg: r2n.j?.error?.message, det: r2n.j?.error?.details };
const r3 = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: dB, isActive: false, revision: g0b.revision }); o.putStale = { s: r3.s, code: r3.j?.error?.code, msg: r3.j?.error?.message };
const r3d = await api('PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: dB, revision: g0b.revision }); o.draftStale = { s: r3d.s, code: r3d.j?.error?.code, msg: r3d.j?.error?.message };
const g2 = await getBp(id); o.g2 = { rev: g2.revision, name: g2.definition.name, desc: g2.definition.description, active: g2.isActive, hasDraft: !!g2.draft || !!g2.draftDefinition, keys: Object.keys(g2) };
// control: correct revision works
const dC = JSON.parse(JSON.stringify(g2.definition)); dC.description = 'QA RT19 D3 current-rev save';
o.putCur = E(await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: dC, isActive: false, revision: g2.revision }));
const g3 = await getBp(id); o.g3 = { rev: g3.revision, name: g3.definition.name, desc: g3.definition.description, active: g3.isActive };
fs.writeFileSync(RUN + '/scripts/d3/a1.json', JSON.stringify(o, null, 1)); return o;
