const reqs = []; const h = async r => { const q = r.request(); if (q.url().includes('/api/v1/settings') && q.method() !== 'GET') reqs.push(q.method() + ' ' + q.url().split('/api/v1')[1] + ' ' + (q.postData() || '').slice(0, 300) + ' -> ' + r.status()); };
page.on('response', h);
await page.locator('main select').first().selectOption('ar'); await sleep(500);
await page.locator('main button:has-text("حفظ التغييرات")').click(); await sleep(4000);
page.off('response', h); out.reqs = reqs;
const keys = ['language', 'date_format'].map(k => ({ app_key: 'general', key: 'general.user.locale.' + k, scope_type: 'User' }));
out.stored = (await api('POST', '/settings/resolved-batch', { items: keys })).j.data.resolved.map(x => x.key + '=' + x.value_json + ' from ' + x.resolved_from + ' v' + x.version);
await page.screenshot({ path: RAW + 'ar-locale-saved.png' });
