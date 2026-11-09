const M = 'bb375218-6a5d-48ec-a832-fb062fd0311b', L0 = '3a58c8a9-a334-4607-b4b3-c5129751f3ab', LB = 'f0bf4593-f455-4cee-8230-2e7c1b3d09d9', out = {};
const ra = await call('POST', `/modules/${M}/layouts/${L0}/reassign-records`, { target_layout_id: LB }); out.reassign = ra.s + ' ' + ra.t.slice(0, 200);
const u = await call('GET', `/modules/${M}/layouts/${LB}/record-usage`); out.usageOnClone = u.t.slice(0, 160);
const rec = await call('GET', `/modules/${M}/records/c244c747-b0cf-45ba-9b3f-c4e08b831a78`); out.recordLayout = rec.j.data && (rec.j.data.layout_id || rec.j.data.layoutId);
for (const body of [{ assignments: [{ profileId: '11111111-1111-1111-1111-111111111103', layoutId: LB }] }, { assignments: [{ profile_id: '11111111-1111-1111-1111-111111111103', layout_id: LB }] }]) { const a = await call('POST', `/modules/${M}/layouts/assignments`, body); out['assign ' + Object.keys(body.assignments[0])[0]] = a.s + ' ' + a.t.slice(0, 200); if (a.s < 300) break; }
const acc = await call('GET', `/modules/${M}/layouts/accessible`); out.accessible = acc.s + ' ' + acc.t.slice(0, 200);
return out;
