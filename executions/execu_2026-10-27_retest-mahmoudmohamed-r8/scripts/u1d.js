const out = {}; const res = []; page.on('response', r => { if (/\/search/.test(r.url())) res.push(r.status() + ' ' + r.url().replace(API, '').slice(0, 80)); });
await page.setViewportSize({ width: 1600, height: 900 }); await go('/', 8000); for (let j = 0; j < 30 && !/Search or jump/.test(await txt()); j++) await sleep(2000);
await page.getByText('Search or jump to…').first().click(); await sleep(1500); await page.keyboard.type('QA RT r8', { delay: 60 }); await sleep(6000); await shot('u1d-search');
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); out.access = t.filter(l => /access to search|don't have/i.test(l)); out.results = t.filter(l => /QA RT r8/.test(l)).slice(0, 8); out.res = res;
return done(out);
