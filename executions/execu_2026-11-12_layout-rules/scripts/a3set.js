const B = JSON.parse(fs.readFileSync(RUN + '/out/a3-user-before.json', 'utf8')); const cur = B.profiles_by_app.desk[0];
const pr = arr((await api('GET', '/iam/profiles?app_key=desk')).j.data); const want = pr.find(p => p.name === (process.env.UNDO ? 'Desk Administrator' : 'Desk Agent'));
const r = await api('POST', '/iam/users/' + B.user_id + '/profiles', { profile_id: want.profileId, scope_id: cur.scope_id, replace: true }); LED('A3: user Mahmoud Mohamed desk profile -> ' + want.name + ' (' + r.s + ')');
const u = await api('GET', '/iam/users/' + B.user_id + '/profiles'); return { set: SR(r).slice(0, 200), now: (u.t || '').slice(0, 400) };
