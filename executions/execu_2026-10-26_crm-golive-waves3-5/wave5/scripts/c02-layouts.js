const M = 'bb375218-6a5d-48ec-a832-fb062fd0311b', L0 = '3a58c8a9-a334-4607-b4b3-c5129751f3ab', out = {}, made = [];
const std = (await call('GET', `/modules/${M}/layouts/${L0}`)).j.data;
const c = await call('POST', `/modules/${M}/layouts`, { name: 'QA W5 Layout A', views: std.views, assignedProfiles: [], accessMode: 'all_users', status: 'active' });
out.create = c.s + ' ' + (c.s < 300 ? '' : c.t.slice(0, 200)); const A = c.s < 300 ? c.j.data.id : null; if (A) made.push(A);
const dup = await call('POST', `/modules/${M}/layouts`, { name: 'QA W5 Layout A', views: std.views, assignedProfiles: [], accessMode: 'all_users', status: 'active' }); out.duplicateName = dup.s + ' ' + dup.t.slice(0, 160); if (dup.s < 300) made.push(dup.j.data.id);
if (A) {
  const cl = await call('POST', `/modules/${M}/layouts/${A}/clone`, { name: 'QA W5 Layout A clone' }); out.clone = cl.s + ' ' + (cl.s < 300 ? '' : cl.t.slice(0, 200)); if (cl.s < 300) made.push(cl.j.data.id);
  const sd = await call('POST', `/modules/${M}/layouts/${A}/set-default`, {}); out.setDefault = sd.s + ' ' + (sd.s < 300 ? '' : sd.t.slice(0, 200));
  const ls = await call('GET', `/modules/${M}/layouts`); out.defaultNow = JSON.stringify((ls.j.data.layouts || ls.j.data).map(l => l.name + (l.isDefault ? '*' : ''))).slice(0, 200);
  const asg = await call('POST', `/modules/${M}/layouts/assignments`, { profileId: '11111111-1111-1111-1111-111111111103', layoutId: A }); out.assignProfile = asg.s + ' ' + asg.t.slice(0, 200);
  const asl = await call('GET', `/modules/${M}/layouts/assignments`); out.assignments = asl.s + ' ' + asl.t.slice(0, 250);
  // a record on the default layout, then reassign it to A
  const r = await call('POST', `/modules/${M}/records`, { layout_id: L0, data: [{ field: 'name', value: { kind: 'string', value: 'QA W5 rec reassign' } }] }); out.record = r.s + ' ' + (r.s < 300 ? r.j.data.id : r.t.slice(0, 150));
  const usage0 = await call('GET', `/modules/${M}/layouts/${L0}/record-usage`); out.usageBefore = usage0.s + ' ' + usage0.t.slice(0, 150);
  const ra = await call('POST', `/modules/${M}/layouts/${L0}/reassign-records`, { targetLayoutId: A }); out.reassign = ra.s + ' ' + ra.t.slice(0, 200);
  const usage1 = await call('GET', `/modules/${M}/layouts/${A}/record-usage`); out.usageAfterOnA = usage1.s + ' ' + usage1.t.slice(0, 150);
  const sd0 = await call('POST', `/modules/${M}/layouts/${L0}/set-default`, {}); out.defaultBack = sd0.s;
  const delA = await call('DELETE', `/modules/${M}/layouts/${A}`); out.deleteLayoutWithRecords = delA.s + ' ' + delA.t.slice(0, 200);
}
out.made = made; return out;
