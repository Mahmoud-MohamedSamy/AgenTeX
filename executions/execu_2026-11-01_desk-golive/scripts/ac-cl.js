const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 100) : ''); };
const MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
out.dProf = await pr('POST', '/iam/users/' + US.D + '/profiles', { profile_id: '44444444-4444-4444-4444-444444444404', scope_id: MGR, replace: true });
const us = D((await api('GET', '/iam/users?app_key=desk&page_size=500&page=1')).j); out.dNow = ((us.items || us).find(u => u.userId === US.D) || {}).profileNames;
out.ovD = (await api('GET', '/iam/users/' + US.D + '/overrides?app_key=desk')).t.slice(0, 80); out.ovC = (await api('GET', '/iam/users/' + US.C + '/overrides?app_key=desk')).t.slice(0, 80);
out.cs = await pr('PUT', '/desk/departments/' + DEP.CS + '/agents', { agent_user_ids: ['2a7c1bc4-f6d4-4bd3-805e-0496ece13987', '5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1', '7e5e7c27-46e4-4bf6-b021-7bd219d34472', '97be04b6-0a08-4883-aa51-e1650b11cab7', '9d182dfa-05f3-4af7-9685-8615a2fbe537'], view_only_agent_user_ids: ['7e5e7c27-46e4-4bf6-b021-7bd219d34472'] });
const cs = D((await api('GET', '/desk/departments/' + DEP.CS)).j); out.csNow = cs.agent_user_ids.length + ' vo ' + cs.view_only_agent_user_ids.length;
out.teams = [await pr('DELETE', '/desk/teams/' + TEAM), await pr('DELETE', '/desk/teams/caf9df21-1fd5-49b5-8248-f09a64c8b4c6')];
out.prof = await pr('DELETE', '/iam/profiles/b1050a28-bda8-47ea-846d-12b34430d84c');
// tickets: everything titled QA AC
const all = []; for (const q of ['QA AC']) { const r = arr(D((await api('GET', '/modules/' + TM + '/records?limit=100&q=' + encodeURIComponent(q))).j)).map(flat); all.push(...r); }
const mine = all.filter(t => /^QA AC /.test(t.subject || ''));
out.found = mine.map(t => t.subject.replace('QA AC ', '').replace(' access run', '')).join(',');
out.del = []; for (const t of mine) out.del.push((await api('DELETE', '/modules/' + TM + '/records/' + t.id)).s);
out.ta = (await api('GET', '/desk/ticket-access/settings')).t.slice(0, 160);
out.vis = JSON.stringify(D((await api('GET', '/modules/' + TM)).j)).match(/"recordVisibility":"[a-z_]+"/)?.[0];
return fin({ out });
