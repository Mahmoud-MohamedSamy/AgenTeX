const out = {}; const bad = []; page.on('response', r => { if (/notifications/.test(r.url()) && r.status() >= 400) bad.push(r.status() + ' ' + r.url().replace(API, '')); });
await page.setViewportSize({ width: 1600, height: 900 });
await go('/', 9000); const bell = page.locator('button[aria-label*="otification" i]').first(); if (await bell.count()) { await bell.click(); } else { await page.mouse.click(1349, 28); } await sleep(4000); await shot('v21-bell');
out.bell = (await txt()).split('\n').map(l => l.trim()).filter(l => l && l.length < 120).slice(-25);
await page.keyboard.press('Escape');
await go('/settings', 9000); const link = page.getByText(/My Notifications|Notifications/).first(); out.hasLink = await link.count(); if (out.hasLink) { await link.click(); await sleep(9000); }
await shot('v21-my-notifications'); out.url = page.url();
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); out.rawKeys = t.filter(l => /^[a-z_]+\.[a-z_.*]+$/.test(l)).slice(0, 20); out.sample = t.slice(0, 120).filter(l => l.length < 60).slice(25, 85);
out.bad = bad; return done(out);
