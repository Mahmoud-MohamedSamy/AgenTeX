const gets = []; const f = r => { if (r.url().includes('/api/v1/') && r.method() === 'GET') gets.push(r.url().replace(API, '').split('?')[0]); }; page.on('request', f);
await go('/settings/integrations/custom-actions', 10000); await shot('b09-custom-actions');
const t1 = (await txt()).split('\n').filter(l => l.trim()).slice(20, 60);
const nb = page.getByRole('button', { name: /new|create|add/i }).first(); if (await nb.count()) { await nb.click().catch(() => {}); await sleep(4000); await shot('b09-new'); }
const t2 = (await txt()).split('\n').filter(l => l.trim()).slice(20, 80);
page.off('request', f); await page.keyboard.press('Escape');
return done({ url: page.url(), gets: [...new Set(gets)].filter(u => !/presence|heartbeat|notif/.test(u)).slice(0, 30), t1, t2 });
