const out = { resp: [] };
const fr = async r => { const m = r.request().method(); if (m !== 'GET' && r.url().includes('/api/') && !/notifications|presence/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch (e) { } out.resp.push(r.status() + ' ' + m + ' ' + r.url().replace(API, '') + ' ' + (r.request().postData() || '').slice(0, 300) + ' -> ' + b); } };
page.on('response', fr);
const D = page.locator('[role=dialog]').last();
await D.getByText('UTC · +00:00').first().click(); await sleep(1200);
const s = page.locator('input[placeholder*="earch" i]').last(); if (await s.count()) { await s.fill('Cairo'); await sleep(1000); }
out.opts = await page.locator('[role=option]').allInnerTexts();
await page.locator('[role=option]').filter({ hasText: /Cairo/ }).first().click(); await sleep(1000);
out.tzNow = (await D.innerText()).match(/[A-Za-z_\/]*Cairo[^\n]*/g);
await shot('NDC-2095-locale-cairo-selected');
await D.getByRole('button', { name: 'Save' }).click(); await sleep(4000);
await shot('NDC-2095-company-settings-after');
const v = await api('POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key: 'general.company.locale.timezone', scope_type: 'Org' }] });
out.orgTz = v.t.match(/value_json[^,]*,[^,]*/)[0];
page.off('response', fr); return done(out);
