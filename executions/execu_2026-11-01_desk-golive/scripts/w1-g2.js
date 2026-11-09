const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 160)) : undefined }); const o = {};
const sg = await api('GET', '/mail/signatures/me'); o.W1_58 = { ...S(sg), d: JSON.stringify(sg.j && sg.j.data).slice(0, 200) };
await page.goto(H + '/settings/personal/signatures', { waitUntil: 'commit', timeout: 45000 }); let t = ''; for (let i = 0; i < 30; i++) { await sleep(1000); t = await txt(); if (t.length > 400) break; } o.W1_58.ui = t.replace(/\s+/g, ' ').slice(-500); o.W1_58.final = page.url().replace(H, '');
// profile menu: find My profile link
await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 45000 }); await sleep(12000);
const av = page.getByRole('button', { name: /^EA$|account|profile|user menu/i }).first(); o.avatar = await av.count();
if (o.avatar) { await av.click(); await sleep(2000); o.menu = (await page.$$eval('[role=menuitem],[role=menu] a,[role=menu] button', ms => ms.map(m => m.innerText.trim()).filter(Boolean))).join(' | '); await page.keyboard.press('Escape'); }
return done(o);
