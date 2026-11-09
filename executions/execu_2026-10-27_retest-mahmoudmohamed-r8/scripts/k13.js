const P_USER = '11111111-1111-1111-1111-111111111103'; const out = {};
const r = await api('POST', '/iam/users/invite', { email: 'qa.rt.2542.minus1@example.com', profile_id: P_USER, lifetime_days: -1, app_key: 'crm' });
out.minus1 = r.s + ' ' + (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || (r.s < 300 ? 'ACCEPTED' : r.t.slice(0, 150)));
if (r.s < 300) out.note = 'created — cancel at cleanup';
await go('/settings/pipelines', 25000); await shot('2386-01-direct-load');
out.pipelines = (await txt()).includes('Loading board') ? 'STILL LOADING' : (await txt()).split('\n').filter(l => /Standard|Pipeline|stage/i.test(l)).slice(0, 6);
return done(out);
