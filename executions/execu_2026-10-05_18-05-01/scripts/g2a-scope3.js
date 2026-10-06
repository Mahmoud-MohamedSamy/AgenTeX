// Read-only: desk-scoped user list (org unit per user in the Desk app).
const r = await api('GET', '/iam/users?app_key=desk&page_size=200');
const ou = Object.fromEntries(arr((await api('GET', '/iam/org-units')).j.data).map(o => [o.orgUnitId, o.name + '/' + o.app_key]));
page.off('request', onReq);
return JSON.stringify(arr(r.j.data).map(u => ({ who: u.userId.slice(0, 8), profiles: u.profileNames, orgUnit: ou[u.orgUnitId] || u.orgUnitId })));
