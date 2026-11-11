async (page) => { const reqs=[]; const h = r => { const u=r.url(); if (/tickets/i.test(u) && /limit|from=/i.test(u)) reqs.push(u.replace(/^https:\/\/[^/]+/,'').slice(0,220)); }; page.on('request', h);
 await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(18000); page.off('request', h); return reqs.slice(0,10); }
