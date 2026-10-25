const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAST = '13996de8-93e5-4437-b546-03d1caca1194';
const reqs = []; const f = async r => { const u = r.url(); if (/views|list-preferences/.test(u)) reqs.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 110) + ' ' + r.status()); }; page.on('response', f);
const toasts = [];
await page.goto(H + `/modules/${L}?view=${LAST}`, { waitUntil: 'commit' });
for (let k = 0; k < 40; k++) { await sleep(1000); for (const x of await page.locator('[data-sonner-toast]').allInnerTexts()) if (!toasts.includes(x)) toasts.push(x); }
page.off('response', f);
await shot('2098-04-own-by-url');
return done({ url: page.url(), toasts, bar: ((await txt()).split('Create Lead')[1] || '').slice(0, 80), reqs });
