const ou = await api('GET', '/iam/org-units?take=200'); log(ou.t.slice(0, 300));
const m = ou.t.match(/.{0,120}7972984b.{0,120}/); log('role', m && m[0]);
const r = await api('POST', '/workflow/rules', { moduleId: T, departmentIds: [D], name: 'QA AO WF probe', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA AO WF probe '), actions: [{ order: 0, delaySeconds: 0, type: 'OwnerAssignment', ownerTargetKind: 'RoleRoundRobin', ownerValue: 'x' }] });
log('probe', r.s, r.t.slice(0, 300)); if (r.j?.data?.id) log('del', (await api('DELETE', '/workflow/rules/' + r.j.data.id)).s);
