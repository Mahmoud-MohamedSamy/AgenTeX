const r = await api('GET', '/settings/resolved?app_key=general&key=general.user.desk.nav_tabs&scope_type=User');
rec('PREF', 'INFO', JSON.stringify(r.j && r.j.data).slice(0, 900));
return done();
