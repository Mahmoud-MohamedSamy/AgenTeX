const resp = []; const f = async r => { const u = r.url(); if (/audit\/(logs|events|entries)|audit\?|\/audit\/log/i.test(u) && r.request().method() === 'GET') resp.push(u.replace(H + '/api/v1', '').slice(0, 300) + ' ' + r.status()); }; page.on('response', f);
await page.getByPlaceholder('Search').last().fill('Module Conf'); await sleep(800);
await page.getByText('Module Configuration', { exact: true }).last().click(); await sleep(5000);
page.off('response', f);
const feed = (await txt()).split('Any time')[1]?.slice(0, 1500);
await shot('1344-03-module-configuration');
return done({ resp, feed });
