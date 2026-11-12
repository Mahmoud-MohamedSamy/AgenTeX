const o = {}; await go('/settings/personal/signatures', 12000);
const inp = page.locator('input[placeholder="Search"]').first(); await inp.fill('signature'); await sleep(2500);
o.search = (await txt()).replace(/\s+/g, ' ').match(/Setup Home.{0,600}/)?.[0];
o.hrefs = await page.locator('a').evaluateAll(as => as.map(a => (a.innerText || '').trim().slice(0, 40) + ' ' + a.getAttribute('href')).filter(x => /signature/i.test(x)));
return done(o);
