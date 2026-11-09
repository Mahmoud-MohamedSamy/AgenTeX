const M = 'bb375218-6a5d-48ec-a832-fb062fd0311b', LB = 'f0bf4593-f455-4cee-8230-2e7c1b3d09d9', out = {};
const cur = (await call('GET', `/modules/${M}/layouts/${LB}`)).j.data;
const put = await call('PUT', `/modules/${M}/layouts/${LB}`, { name: cur.name, views: cur.views, assignedProfiles: ['11111111-1111-1111-1111-111111111103'], accessMode: 'selected', status: cur.status, rowVersion: cur.rowVersion });
out.assignViaLayout = put.s + ' ' + (put.s < 300 ? '' : put.t.slice(0, 200));
const back = (await call('GET', `/modules/${M}/layouts/${LB}`)).j.data; out.readBack = { accessMode: back.accessMode, assignedProfiles: back.assignedProfiles };
const g = await call('GET', `/modules/${M}/layouts/assignments`); out.getAssignments = g.s + ' ' + g.t.slice(0, 160);
const bad = await call('POST', `/modules/${M}/layouts/assignments`, { assignments: [{ profileId: '11111111-1111-1111-1111-111111111103', layoutId: LB }] }); out.postAssignmentsAgain = bad.s + ' ' + bad.t.slice(0, 160);
return out;
