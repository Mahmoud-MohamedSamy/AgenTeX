const o = {};
// D1: history API rows for automatic steps on #4166
const h = await histRaw('759aac1f-1608-4239-aaae-e81cb8dd3104');
o.d1 = h.filter(x => x.action === 'ticket.blueprint_transition').map(x => ({ at: x.occurred_at.slice(11, 19), actor: x.actor?.kind, summary: x.summary, old: x.old_value, new: x.new_value }));
// D4: malformed owner id
const bad = { name: 'QA BP RT19 D4 bad id', description: 'QA', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP RT19 D4 ' }, states: [ST('Open'), ST('Closed', { isTerminal: true })], transitions: [TR('x', 'Open', 'Closed', { before: { allowedUserIds: ['not-a-uuid'] } })] };
const r4 = await api('POST', `/modules/${TK}/blueprints`, { definition: bad, isActive: false }); o.d4 = { s: r4.s, body: r4.t.slice(0, 600) }; if (r4.j?.data?.id) { made.bps.push(r4.j.data.id); keep(); }
// D5: no-revision overwrite on cca267b4 (inactive)
const id = 'cca267b4-989c-47e8-8fa2-70b9d5935626'; const g0 = await getBp(id); o.d5 = { start: { rev: g0.revision, name: g0.definition.name, desc: g0.definition.description } };
const dA = JSON.parse(JSON.stringify(g0.definition)); dA.name = 'QA BP RT19 D5 renamed by A'; o.d5.putA = E(await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: dA, isActive: false, revision: g0.revision }));
const g1 = await getBp(id); o.d5.afterA = { rev: g1.revision, name: g1.definition.name };
const dB = JSON.parse(JSON.stringify(g0.definition)); dB.description = 'QA RT19 D5 desc from stale B (no revision)';
o.d5.putBnoRev = E(await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: dB, isActive: false }));
o.d5.draftBnoRev = E(await api('PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: dB }));
const g2 = await getBp(id); o.d5.final = { rev: g2.revision, name: g2.definition.name, desc: g2.definition.description, active: g2.isActive };
LED('D5 evidence: blueprint cca267b4 renamed then overwritten by a no-revision PUT (inactive)');
fs.writeFileSync(RUN + '/scripts/bp/bugsapi.json', JSON.stringify(o, null, 1)); return o;
