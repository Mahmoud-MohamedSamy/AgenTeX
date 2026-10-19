await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(1000); if (/Approval Processes/.test(await txt().catch(() => ''))) break; }
const links = await page.$$eval('a', as => as.map(a => a.innerText.trim() + ' => ' + a.getAttribute('href')).filter(x => /approval/i.test(x)));
return done({ links, has: /Approval Processes/.test(await txt()) });
