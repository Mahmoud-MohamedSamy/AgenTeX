const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + String(r.j.error.message).slice(0, 160)) : null });
const FED = '9d182dfa-05f3-4af7-9685-8615a2fbe537'; const ORIG = '7972984b-b5cc-034a-bd96-6de61e3937d0';
const roles = async () => (await api('GET', '/iam/org-units?app_key=desk')).j.data;
let r0 = await roles(); o.roles = r0.map(x => x.name + ':' + x.orgUnitId.slice(0, 8));
let q = r0.find(x => x.name === 'QA GL N Role');
if (!q) { o.create = S(await api('POST', '/iam/org-units', { parent_id: ORIG, name: 'QA GL N Role', app_key: 'desk' })); q = (await roles()).find(x => x.name === 'QA GL N Role'); }
const rid = q && q.orgUnitId; o.rid = rid;
if (rid) {
  o.assign = S(await api('PATCH', '/iam/users/' + FED, { org_unit_id: rid }));
  const u = (await api('GET', '/iam/users?limit=200')).j.data.find(x => x.userId === FED); o.fedRole = u.orgUnitId === rid;
  o.deleteInUse = S(await api('DELETE', '/iam/org-units/' + rid)); o.stillThere = !!(await roles()).find(x => x.orgUnitId === rid);
  o.restore = S(await api('PATCH', '/iam/users/' + FED, { org_unit_id: ORIG })); const u2 = (await api('GET', '/iam/users?limit=200')).j.data.find(x => x.userId === FED); o.fedBack = u2.orgUnitId === ORIG;
  if (o.stillThere) o.cleanup = S(await api('DELETE', '/iam/org-units/' + rid));
  o.goneAtEnd = !(await roles()).find(x => x.orgUnitId === rid);
}
return done(o);
