const o = { start: new Date().toISOString() };
const def = DEF('3029 audit', [ST('Open'), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('finish', 'Escalated', 'Closed')]);
const c = await mkBp(def, false); o.create = E(c.r); const id = c.id; o.id = id;
await sleep(1500);
def.description = 'QA RT19 retest - edited';
o.draft = E(await api('PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: def }));
o.publish = E(await api('POST', `/modules/${TK}/blueprints/${id}/publish`, {})); await sleep(1500);
// owner change on a transition, publish again
const d2 = JSON.parse(JSON.stringify(def)); d2.transitions[1].before = { allowedUserIds: [OWNER] };
o.draft2 = E(await api('PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: d2 }));
o.publish2 = E(await api('POST', `/modules/${TK}/blueprints/${id}/publish`, {})); await sleep(1500);
const g = await getBp(id); o.afterPub = { active: g?.isActive, rev: g?.revision, desc: g?.definition?.description };
fs.writeFileSync(RUN + '/scripts/bp/3029.json', JSON.stringify(o, null, 1));
return o;
