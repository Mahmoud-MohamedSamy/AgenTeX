await go('/settings/organize-tabs', 6000); await page.getByRole('button', { name: 'Reset to default' }).click(); await sleep(2000);
const r = await api('GET', '/settings/resolved?app_key=general&key=general.user.desk.nav_tabs&scope_type=User');
rec('K.reset', 'INFO', `admin tab setting after reset ${r.j && r.j.data && r.j.data.value_json}`);
return done();
