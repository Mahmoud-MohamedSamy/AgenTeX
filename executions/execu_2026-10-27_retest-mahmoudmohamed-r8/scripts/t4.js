const id = 'f7082675-ea1b-4220-bfd2-47925ef97570'; const out = {};
for (const v of ['everyone', 'all_users', 'public', 'org_units', 'profiles']) { const r = await api('PATCH', `/teamspaces/${id}/access-mode`, { access_mode: v }); out[v] = r.s + ' ' + (r.j?.error?.code || 'ALLOWED'); if (r.s < 300 || r.s === 403) break; }
out.modeNow = (await api('GET', `/teamspaces/${id}`)).j?.data?.accessMode;
await go('/settings/teamspace', 12000); await shot('1701-01-member-settings');
const t = (await txt()).split('\n').filter(l => l.trim()); out.page = t.filter(l => /teamspace|QA RT TS|denied|permission|Create/i.test(l)).slice(0, 10);
return done(out);
