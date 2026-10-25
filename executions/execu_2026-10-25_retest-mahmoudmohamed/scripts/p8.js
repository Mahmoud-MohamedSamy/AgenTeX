const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const reqs = []; const f = async r => { const q = r.request(); if (/records|query|search/.test(q.url()) && /\/api\//.test(q.url())) reqs.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 200) + ' ' + r.status() + ' body=' + (q.postData() || '').slice(0, 300) + ' -> ' + (await r.text().catch(() => '')).match(/"total[_a-z]*":\d+/)?.[0]); }; page.on('response', f);
await page.goto(H + `/modules/${L}?view=c60d7685-61a8-4f94-98cc-75ccbe0cdef0`, { waitUntil: 'commit', timeout: 90000 });
for (let i = 0; i < 150; i++) { await sleep(1000); const t = await txt().catch(() => ''); if (/QA RT 2122/.test(t) && /\d records/.test(t) && !/Loading/.test(t)) { await sleep(4000); break; } }
page.off('response', f);
const t = await txt(); await shot('2122-06-eval-api');
return done({ reqs, count: (t.match(/([\d,]+) records?/) || [])[1], label: /QA RT 2122/.test(t) });
