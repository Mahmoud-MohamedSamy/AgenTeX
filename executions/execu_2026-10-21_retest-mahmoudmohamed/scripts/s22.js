const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && /setting|locale|lang/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(API, '').slice(0, 100) + ' ' + r.status()); }; page.on('response', f);
await page.getByRole('button', { name: /^EN/ }).first().click(); await sleep(1000);
const opt = page.locator('[role=menuitem],[role=option],[role=menuitemradio],button').filter({ hasText: 'العربية' }).first();
await opt.click({ force: true }); await sleep(8000);
page.off('response', f);
const dir = await page.evaluate(() => document.documentElement.dir + ' ' + document.documentElement.lang);
const lines = (await txt()).split('\n').filter(l => /[A-Za-z]{4,}/.test(l) && !/QA RT|QA MF|Ctrl|Default|L2/.test(l));
await shot('2249-01-arabic-layouts');
return done({ resp, dir, englishLines: lines.slice(0, 40), total: lines.length });
