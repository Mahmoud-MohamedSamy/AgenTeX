// Read-only inventory of TAVI ticket-access setup (17 Nov access run)
const g = async p => { const r = await api('GET', p); return { s: r.s, j: r.j }; };
out.me = (await g('/desk/me/departments'));
out.depts = (await g('/desk/departments?limit=50'));
out.teams = (await g('/desk/teams'));
out.ta = (await g('/desk/ticket-access/settings'));
out.ta2 = (await g('/desk/settings/ticket-access'));
out.ds = (await g('/desk/data-sharing'));
out.roles = (await g('/iam/roles?app_key=desk'));
out.profiles = (await g('/iam/profiles?app_key=desk'));
out.agents = (await g('/desk/agents/?limit=100'));
return fin({ out });
