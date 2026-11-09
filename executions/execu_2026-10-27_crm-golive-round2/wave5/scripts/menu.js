await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); await sleep(6000);
const links = await page.$$eval('a[href], [role=link], nav button, aside button', as => as.map(a => (a.innerText || '').trim().replace(/\s+/g, ' ') + ' => ' + (a.getAttribute('href') || a.tagName)));
return [...new Set(links)].slice(0, 120);
