const r = await call('GET', '/iam/users?app_key=crm&limit=200');
const users = (r.j && r.j.data) || [];
const byId = Object.fromEntries(users.map(u => [u.id || u.user_id, u.email]));
const want = ['nameb56175@airhemp.com', 'valafo4080@94an.com', 'mahmoud.mmohamedsamy@gmail.com', 'mmohamed@anyware.software', 'mahmoud.mahamed1515@gmail.com'];
const res = {};
for (const u of users) if (want.includes(u.email)) {
  const d = await call('GET', `/iam/users/${u.id || u.user_id}`);
  const x = (d.j && d.j.data) || {};
  const m = x.reporting_manager_id || x.reportingManagerId || x.manager_id || (x.reporting_manager && x.reporting_manager.id);
  res[u.email] = { id: u.id || u.user_id, manager: m ? (byId[m] || m) : null, profile: (x.profile && x.profile.name) || x.profile_name || null };
}
res.ids = { d23fb4e0: byId['d23fb4e0-248d-41f6-af60-d28885a7007e'], '7e5e7c27': Object.entries(byId).find(([k]) => k.startsWith('7e5e7c27')) };
return res;
