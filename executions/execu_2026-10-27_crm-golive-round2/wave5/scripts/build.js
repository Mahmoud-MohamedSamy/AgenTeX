await page.goto(H + '/home', { waitUntil: 'domcontentloaded' }); await sleep(3000);
const scripts = await page.$$eval('script[src]', s => s.map(x => x.getAttribute('src')));
const bh = await call('GET', '/iam/tenant/business-hours');
return { scripts: scripts.filter(s => /index-/.test(s)), bhTz: bh.j.data.time_zone, bhPreset: bh.j.data.preset };
