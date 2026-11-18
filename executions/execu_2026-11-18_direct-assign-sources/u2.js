const reqs = []; page.on('request', r => { if (/\/api\/v1\//.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+\/api\/v1/, '')); });
await page.goto(H + '/settings/channels/web-forms', { waitUntil: 'commit' }); await sleep(15000);
await shot('DA-webforms.png'); log((await text()).replace(/\s+/g, ' ').slice(-1500)); log(reqs.filter(x => /form/i.test(x)));
