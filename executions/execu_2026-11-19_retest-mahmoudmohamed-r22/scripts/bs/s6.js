const b = await getBp('5392f456-66f9-4bc7-aa95-99bad990f4d5'); const vs = await api('GET', `/modules/${TK}/blueprints/5392f456-66f9-4bc7-aa95-99bad990f4d5/versions`);
const pick = d => (d?.states || []).map(s => [s.id, s.slaMinutes, s.slaPreExpiryMinutes, s.autoTransitionAfterMinutes]);
return { keys: Object.keys(b || {}), active: b?.isActive, def: pick(b?.definition), draft: pick(b?.draftDefinition || b?.draft?.definition), vs: vs.s, versions: L(vs.j?.data).map(v => [v.version, v.status, JSON.stringify(pick(v.definition))]) };
