await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup/landing', { waitUntil: 'commit' }).catch(() => {}); await page.waitForTimeout(10000);
const all = async () => { const t = []; for (const f of page.frames()) t.push(await f.innerText('body').catch(() => '')); return t.join(' ').replace(/\s+/g, ' '); };
out.u1 = page.url();
for (const f of page.frames()) { const l = f.getByText('Notifications', { exact: true }); if (await l.count()) { await l.first().click().catch(() => {}); break; } } await page.waitForTimeout(7000);
out.u2 = page.url(); let a = await all(); out.a = a.slice(0, 300);
for (const f of page.frames()) { const l = f.getByText(/Department Notifications|Notification Rules/); if (await l.count()) { await l.first().click().catch(() => {}); break; } } await page.waitForTimeout(7000);
a = await all(); out.u3 = page.url(); out.shared = a.match(/.{0,160}[Ss]hared [Tt]icket.{0,200}/)?.[0] || a.slice(0, 600); await shotZ(page, 'ac-notif-shared');
