await go('/hq', 8000);
const links = await page.evaluate(() => [...document.querySelectorAll('a,button')].map(a => (a.innerText || a.getAttribute('aria-label') || '').trim() + ' -> ' + (a.getAttribute('href') || '')).filter(x => /ticket|new|create|\+/i.test(x)).slice(0, 30));
await go('/tickets', 8000); await shot('d1-form-0-list');
const l2 = await page.evaluate(() => [...document.querySelectorAll('a,button')].map(a => (a.innerText || a.getAttribute('aria-label') || '').trim() + ' -> ' + (a.getAttribute('href') || '')).filter(x => /new|create|add|\+/i.test(x)).slice(0, 30));
return done({ url: page.url(), links, l2 });
