const out = {};
const d = await api.O('GET', '/desk/departments');
const deps = arr(d.j?.data?.departments || d.j?.data);
const mk = deps.find(x => x.name === 'Marketing'); ST.MK = mk && mk.id; saveState();
for (const p of [`/desk/resolution-confirmation/settings?department_id=${ST.CS}`, `/desk/departments/${ST.CS}/agents`, `/desk/departments/${ST.CS}/members`, `/desk/departments/${ST.MK}/agents`, `/desk/me`, '/desk/agents/me', `/iam/users/${ST.C_ID}?app_key=desk`]) {
  const r = await api[p.includes('/me') ? 'C' : 'O']('GET', p);
  let j = r.j?.data;
  if (p.includes('/agents') || p.includes('/members')) { const l = arr(j?.agents || j?.members || j); j = { n: l.length, hasC: l.some(a => [a.id, a.user_id, a.agent_id].includes(ST.C_ID)), hasO: l.some(a => [a.id, a.user_id].includes(ST.O_ID)) }; }
  out[p] = r.s + ' ' + short(j, 600);
}
const perm = await api.C('GET', '/iam/me/permissions?app_key=desk');
const ps = arr(perm.j?.data?.permissions || perm.j?.data).map(x => x.key || x.code || x);
out.Cperms = perm.s + ' n=' + ps.length + ' ' + ps.filter(x => /time|resolution|parent|ticket.*(edit|update)|settings/i.test(String(x))).join(',').slice(0, 600);
return out;
