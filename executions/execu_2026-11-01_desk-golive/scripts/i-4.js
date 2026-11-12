const o = {}; await go('/settings/personal/signatures', 10000);
const all = await page.locator('a').evaluateAll(as => as.map(a => [(a.innerText || '').trim(), a.getAttribute('href')]).filter(x => x[1] && x[1].startsWith('/')));
o.all = all.map(x => x.join(' ')).slice(0, 120);
for (const [n, h] of all.filter(x => /Company|Rebranding|Email|Mail|Channel|Template/i.test(x[0])).slice(0, 6)) { await go(h, 9000); const t = (await txt()).replace(/\s+/g, ' '); o['p ' + n] = h + ' :: ' + ((t.match(/.{0,250}signature.{0,350}/i) || ['-'])[0]); }
return done(o);
