await page.goto(B + '/settings/personal/locale', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1000); if ((await page.$$('main select')).length) break; } await sleep(1500);
await page.locator('main select').first().selectOption('en'); await sleep(500);
await page.locator('main button:has-text("حفظ التغييرات"), main button:has-text("Save changes")').first().click(); await sleep(4000);
const keys = ['language'].map(k => ({ app_key: 'general', key: 'general.user.locale.' + k, scope_type: 'User' }));
out.stored = (await api('POST', '/settings/resolved-batch', { items: keys })).j.data.resolved.map(x => x.key + '=' + x.value_json + ' from ' + x.resolved_from + ' v' + x.version);
await page.evaluate(() => localStorage.setItem('anyware_language', 'en')); await page.reload(); await sleep(5000);
out.after = await page.evaluate(() => ({ lang: localStorage.getItem('anyware_language'), html: document.documentElement.lang, dir: document.documentElement.dir }));
