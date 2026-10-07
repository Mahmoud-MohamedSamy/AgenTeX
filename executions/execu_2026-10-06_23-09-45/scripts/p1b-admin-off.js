// Remove Desk Administrator from mahmoud.mohamed1 — try the scopes it may sit on, stop at the first that works.
const U = '18ba78c4-20c2-49e3-b159-55e1af2043ae', ADMIN = '44444444-4444-4444-4444-444444444401';
const names = async () => arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
const tries = [];
for (const [lab, q] of [['CEO', '?scopeId=7972984b-b5cc-034a-bd96-6de61e3937d0'], ['no scope', ''], ['Organization', '?scopeId=a9de6b1e-a5be-ed4c-b485-af6f22ea8b5e']]) {
  const d = await api('DELETE', `/iam/users/${U}/profiles/${ADMIN}${q}`); const n = await names(); tries.push(`${lab} → ${d.s}, now "${n}"`);
  if (!/Desk Administrator/.test(n)) { rec('SETUP.agent', n === 'Desk Agent' ? 'PASS' : 'FAIL', tries.join(' ; '), { removedWithScope: lab }); return done(); }
}
rec('SETUP.agent', 'FAIL', tries.join(' ; '));
return done();
