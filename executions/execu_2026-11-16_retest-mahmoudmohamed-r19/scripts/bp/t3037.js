const o = {}; const GHOST = crypto.randomUUID(); o.ghost = GHOST;
const mk = (tag, ids) => DEF(tag, [ST('Open'), ST('Closed', { isTerminal: true, position: { x: 400, y: 0 } })], [TR('ghost', 'Open', 'Closed', { before: { allowedUserIds: ids } })]);
const before = L((await api('GET', `/modules/${TK}/blueprints`)).j?.data).length;
const r1 = await api('POST', `/modules/${TK}/blueprints`, { definition: mk('3037 ghost', [GHOST]), isActive: false }); o.createGhost = E(r1); if (r1.j?.data?.id) { made.bps.push(r1.j.data.id); keep(); LED('UNEXPECTED blueprint saved with ghost owner ' + r1.j.data.id); }
const r1b = await api('POST', `/modules/${TK}/blueprints`, { definition: mk('3037 ghost mix', [OWNER, GHOST]), isActive: false }); o.createMix = E(r1b); if (r1b.j?.data?.id) { made.bps.push(r1b.j.data.id); keep(); }
o.countSame = L((await api('GET', `/modules/${TK}/blueprints`)).j?.data).length === before;
// edit path: valid bp, then draft/PUT with ghost
const ok = await mkBp(mk('3037 valid', [OWNER]), false); o.createValid = E(ok.r);
const g = await getBp(ok.id); const d = JSON.parse(JSON.stringify(g.definition)); d.transitions[0].before.allowedUserIds = [GHOST];
o.draftGhost = E(await api('PUT', `/modules/${TK}/blueprints/${ok.id}/draft`, { definition: d, revision: g.revision }));
o.putGhost = E(await api('PUT', `/modules/${TK}/blueprints/${ok.id}`, { definition: d, isActive: false, revision: g.revision }));
const g2 = await getBp(ok.id); o.storedOwners = g2.definition.transitions[0].before.allowedUserIds.map(x => x === OWNER ? 'OWNER' : x === GHOST ? 'GHOST' : x);
// other-tenant style control: a malformed id
o.createBadUuid = E(await api('POST', `/modules/${TK}/blueprints`, { definition: mk('3037 bad', ['not-a-uuid']), isActive: false }));
fs.writeFileSync(RUN + '/scripts/bp/3037.json', JSON.stringify(o, null, 1)); return o;
