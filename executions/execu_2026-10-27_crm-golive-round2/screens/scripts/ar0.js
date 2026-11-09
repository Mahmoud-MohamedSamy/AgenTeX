const keys = ['language','country','date_format','time_format','distance_unit','timezone','number_grouping','number_decimal'].map(k => ({ app_key: 'general', key: 'general.user.locale.' + k, scope_type: 'User' }));
const r = await api('POST', '/settings/resolved-batch', { items: keys });
out.locale = r.s + ' ' + r.t.slice(0, 1500);
out.me = (await api('GET', '/iam/me/profile')).t.slice(0, 300);
out.perms = (await api('GET', '/iam/me/permissions')).t.slice(0, 1500);
out.ls = await page.evaluate(() => ({ lang: localStorage.getItem('anyware_language'), html: document.documentElement.lang, dir: document.documentElement.dir }));
