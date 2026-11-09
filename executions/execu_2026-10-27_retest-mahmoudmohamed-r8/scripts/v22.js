const out = {};
await page.setViewportSize({ width: 1600, height: 900 }); await go('/settings', 9000);
for (let j = 0; j < 60 && !(await txt()).includes('Personal Settings'); j++) await sleep(2000);
await page.getByText('Personal Settings', { exact: true }).first().click(); await sleep(8000); out.url = page.url();
out.tabs = (await txt()).split('\n').map(l => l.trim()).filter(l => /otification/i.test(l)).slice(0, 6);
const n = page.getByText(/^(My )?Notifications$/).first(); if (await n.count()) { await n.click(); await sleep(9000); }
await shot('v22-my-notifications'); out.url2 = page.url();
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean);
out.rawKeys = t.filter(l => /^[a-z_]+\.[a-z_.*]+$/.test(l)).slice(0, 25);
const i = t.findIndex(l => /otification/i.test(l)); out.list = t.slice(i, i + 70).filter(l => l.length < 70);
return done(out);
