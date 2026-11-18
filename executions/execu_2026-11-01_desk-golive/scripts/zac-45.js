const all = async () => { const t = []; for (const f of page.frames()) t.push(await f.innerText('body').catch(() => '')); return t.join(' ').replace(/\s+/g, ' '); };
await page.getByText('Notifications', { exact: true }).first().click().catch(e => out.e = e.message.slice(0, 80)); await page.waitForTimeout(9000); out.u = page.url();
let a = await all(); out.h = a.match(/.{0,250}[Ss]har.{0,300}/)?.[0]; if (!out.h) out.h0 = a.slice(a.indexOf('AUTOMATION') + 200, a.indexOf('AUTOMATION') + 1500);
for (const f of page.frames()) { const l = f.getByText(/^Department/).first(); if (await l.count()) { await l.click().catch(() => {}); break; } } await page.waitForTimeout(5000);
a = await all(); out.h2 = a.match(/.{0,250}[Ss]har.{0,300}/)?.[0]; await shotZ(page, 'ac2-notifications');
