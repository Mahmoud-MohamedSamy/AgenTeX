const reqs = []; page.on('request', r => { if (/api\/v1/.test(r.url()) && !/iam\/auth/.test(r.url())) reqs.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')); });
await page.goto(H + '/settings/global-sets', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Global/i.test(await text())) break; }
await sleep(3000); log((await text()).slice(0,3000)); await shot('2806-list.png'); log(reqs.slice(0,30));
