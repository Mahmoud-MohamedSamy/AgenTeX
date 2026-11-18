await page.getByText('Notification Rules,Notifications', { exact: false }).first().click().catch(e => out.e = e.message.slice(0, 80)); await page.waitForTimeout(9000);
const all = async () => { const t = []; for (const f of page.frames()) t.push(await f.innerText('body').catch(() => '')); return t.join(' ').replace(/\s+/g, ' '); };
out.u = page.url(); let a = await all(); out.hit = a.match(/.{0,200}[Ss]hared.{0,250}/)?.[0] || a.slice(0, 700); await shotZ(page, 'ac2-notif-rules');
for (const f of page.frames()) { const l = f.getByText(/Department Notifications|Agent Notifications/).first(); if (await l.count()) { await l.click().catch(() => {}); break; } } await page.waitForTimeout(6000);
a = await all(); out.hit2 = a.match(/.{0,200}[Ss]hared.{0,300}/)?.[0] || a.slice(0, 500); await shotZ(page, 'ac2-notif-rules2');
