const org = await api('POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key: 'general.company.locale.timezone', scope_type: 'Org' }] });
const usr = await api('POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key: 'general.user.locale.timezone', scope_type: 'User' }] });
return done({ org: org.s + ' ' + org.t.slice(0, 600), user: usr.s + ' ' + usr.t.slice(0, 600) });
