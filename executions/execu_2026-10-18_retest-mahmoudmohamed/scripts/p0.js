capOn(); await page.goto(H + '/', { waitUntil: 'load', timeout: 90000 }); await sleep(12000);
await shot('_probe');
return done({ url: page.url(), hdr: hdr ? Object.keys(hdr) : null, calls: cap.slice(0, 30), cookies: (await page.context().cookies()).map(c => c.name + '@' + c.domain), body: (await txt()).slice(0, 600) });
