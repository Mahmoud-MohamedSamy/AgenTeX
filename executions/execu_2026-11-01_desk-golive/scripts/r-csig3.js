const o = {}; await go('/settings/personal/signatures', 12000);
o.text = (await txt()).replace(/\s+/g, ' ').slice(0, 1500);
const srcs = await page.evaluate(() => [...document.querySelectorAll('script')].map(s => s.src || ('inline' + s.textContent.length)));
o.srcs = srcs; o.res = await page.evaluate(() => performance.getEntriesByType('resource').map(r => r.name).filter(n => /\.js|signature/i.test(n)).slice(-30));
return done(o);
