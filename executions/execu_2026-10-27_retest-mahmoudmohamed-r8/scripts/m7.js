const bad = [], lay = []; page.on('response', async r => { const u = r.url(); if (!u.includes('/api/')) return; if (r.status() >= 400) bad.push(r.status() + ' ' + r.request().method() + ' ' + u.replace(API, '')); if (/layouts/.test(u)) lay.push(r.status() + ' ' + u.replace(API, '')); });
await page.reload({ waitUntil: 'commit' }); await sleep(45000); await shot('m7-after-wait');
const t = (await txt()).split('\n').filter(l => /QA RT r8|Standard|Wonder|All users|Profiles/i.test(l)).slice(0, 15);
return done({ bad, lay, t });
