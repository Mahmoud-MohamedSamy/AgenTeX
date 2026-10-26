const v = await call('GET', `/modules/${MODS.leads}/views?kind=list&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288`);
const names = (v.j.data.views || []).map(x => x.name);
const s = v2 => ({ kind: 'string', value: v2 });
const c = await call('POST', `/modules/${MODS.leads}/records`, { layout_id: 'bf971461-2edc-45f2-b6e4-6e180aa64288', data: [{ field: 'first_name', value: s('QA W2 U1 lead') }, { field: 'phone', value: s('01016000001') }, { field: 'single_line_3_9', value: s('QA W2') }] });
let del = null; if (c.s < 300) { const d = await call('DELETE', `/modules/${MODS.leads}/records/${c.j.data.id}`); del = d.s + ' ' + d.t.slice(0, 150); }
const delOwner = await call('DELETE', `/modules/${MODS.leads}/records/9207f81e-cd86-4911-b5c9-5dddeec174c1`);
return { seesShared: names.includes('QA W2 CV shared u1'), seesOwnerPrivate: names.includes('QA W2 CV main renamed'), viewNames: names.slice(0, 12), create: c.s + ' ' + (c.s < 300 ? c.j.data.id : c.t.slice(0, 150)), deleteOwn: del, deleteOwnersLead: delOwner.s + ' ' + delOwner.t.slice(0, 150) };
