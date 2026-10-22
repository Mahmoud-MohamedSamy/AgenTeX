const resp = []; const f = async r => { const u = r.url(); if (u.includes('/api/') && !/auth|notif|hubs/.test(u)) resp.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 140) + ' ' + r.status()); }; page.on('response', f);
const pend = new Set(); const rq = r => { if (r.url().includes('/api/')) pend.add(r.url().replace(H + '/api/v1', '').slice(0, 140)); }; const rd = r => pend.delete(r.url().replace(H + '/api/v1', '').slice(0, 140)); page.on('request', rq); page.on('requestfinished', rd); page.on('requestfailed', rd);
const errs = []; const fe = m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text().slice(0, 300)); }; page.on('console', fe);
await page.reload({ waitUntil: 'commit' }); await sleep(25000);
page.off('response', f); page.off('console', fe); page.off('request', rq);
return done({ loaded: !(await txt()).includes('Loading board'), resp: resp.filter(x => /modules\/f42|pipelines|stage|layouts|403|500/.test(x)), pending: [...pend], errs });
