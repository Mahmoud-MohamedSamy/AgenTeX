// K7 step 1 (admin): hide Social for me.
await go('/settings/organize-tabs', 6000); await page.getByRole('button', { name: 'Hide Social' }).click(); await sleep(1500);
const r = await api('GET', '/settings/resolved?app_key=general&key=general.user.desk.nav_tabs&scope_type=User');
rec('K7.admin', 'INFO', `admin setting now ${r.j && r.j.data && r.j.data.value_json} (scope User)`);
return done();
