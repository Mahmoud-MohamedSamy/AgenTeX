const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = '8dceae79-4e80-459c-801b-5291dd0714f0'; const out = { resp: [] };
const fr = async r => { const u = r.url(); if (u.includes('/api/') && !/notifications|telephony|unread|presence/.test(u)) out.resp.push(r.status() + ' ' + r.request().method() + ' ' + u.replace(API, '').slice(0, 140)); };
page.on('response', fr);
out.ck = (await page.context().cookies()).map(c => c.name);
await page.goto(H + '/modules/' + L + '/views/' + V + '/edit', { waitUntil: 'load', timeout: 90000 }); await sleep(20000);
out.editor = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 900);
await shot('NDC-2097-user1-editor');
page.off('response', fr); out.resp = out.resp.slice(-25); return done(out);
