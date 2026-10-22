const all = []; const f = r => { const u = r.url(); if (!/\.(js|css|png|svg|woff2?)(\?|$)|\/iam\/auth|\/auth\//.test(u)) all.push(r.method() + ' ' + u.slice(0, 200)); }; page.on('request', f);
await page.reload({ waitUntil: 'commit' }); await sleep(15000);
page.off('request', f);
return done({ url: page.url(), all: all.slice(0, 60), body: (await txt()).split('Storage Requests')[1] });
