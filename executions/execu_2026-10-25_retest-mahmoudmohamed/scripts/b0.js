const M = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', contacts: '6f553963-01d6-4b68-9fb3-143d23044c41' };
const me = (await api('GET', '/iam/me')).j.data;
const out = { user: me.email, at: new Date().toISOString(), prefs: {}, views: {} };
for (const [k, id] of Object.entries(M)) { const p = await api('GET', `/modules/${id}/list-preferences`); out.prefs[k] = p.j?.data ?? p.t.slice(0, 200);
  const v = await api('GET', `/modules/${id}/views`); out.views[k] = arr(v.j?.data).map(x => x.id + ' ' + x.name + (x.isSystem || x.is_system ? ' [system]' : '')); }
const lang = await api('GET', '/settings/resolved?app_key=general&key=general.user.locale.language&scope_type=User'); out.language = lang.j?.data?.value_json;
return done(out);
