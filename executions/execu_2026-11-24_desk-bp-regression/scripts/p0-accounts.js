// Read-only: which Desk users we have sign-ins for (labels only, never emails or passwords), with their Desk profile and departments.
const CSVP = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/Credentials/TAVI Desk Credentials.csv';
const csv = fs.readFileSync(CSVP, 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(','));
const byMail = Object.fromEntries(csv.map(r => [String(r[1] || '').trim().toLowerCase(), r[0]]));
const users = arr((await api('GET', '/iam/users?app_key=desk&page_size=200')).j?.data);
const deps = arr((await api('GET', '/desk/departments')).j?.data);
const out = [];
for (const u of users) {
  const label = byMail[String(u.email || '').toLowerCase()];
  if (!label || u.status !== 'active') continue;
  const inDeps = deps.filter(d => (d.agent_user_ids || []).includes(u.userId)).map(d => d.name);
  const vo = deps.filter(d => (d.view_only_agent_user_ids || []).includes(u.userId)).map(d => d.name);
  out.push({ label, id: u.userId, name: u.displayName, profiles: u.profileNames, depts: inDeps.length > 4 ? inDeps.length + ' depts' : inDeps, viewOnly: vo });
}
return { withSignIn: out.length, users: out };
