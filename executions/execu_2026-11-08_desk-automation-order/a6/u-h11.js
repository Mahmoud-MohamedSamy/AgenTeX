const net = []; page.on('response', r => { if (/\/api\/v1\/(modules\/[^/]+\/blueprints|iam\/auth)/.test(r.url()) && r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.status() + ' ' + r.url().split('/api/v1')[1].slice(0, 70)); });
await go('/settings/automation/blueprints/2add01bb-78f0-4492-9a28-5c5c7edf3fd1'); await sleep(9000);
log('ls keys', await page.evaluate(() => Object.keys(localStorage)));
log('cookies', (await ctx.cookies()).map(c => c.name));
// change: description
const ed = page.getByRole('button', { name: 'Edit' }).first(); if (await ed.count()) { await ed.click(); await sleep(1000); }
await page.locator('textarea').first().fill('QA H11 change before expiry'); await sleep(800);
await shot('h11-before');
// expire the session: drop every cookie and auth item in storage
await ctx.clearCookies(); await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/auth|token|session|refresh/i.test(k)) localStorage.removeItem(k); for (const k of Object.keys(sessionStorage)) if (/auth|token|session|refresh/i.test(k)) sessionStorage.removeItem(k); });
await page.getByRole('button', { name: 'Save and Publish' }).click(); await sleep(6000);
log('url after', page.url().replace(H, ''));
log('screen', (await text()).replace(/\s+/g, ' ').slice(0, 400)); await shot('h11-after-publish');
log('net', net);
log('ls draft keys', await page.evaluate(() => Object.keys(localStorage).filter(k => /draft|blueprint/i.test(k))));
await go('/settings/automation/blueprints/2add01bb-78f0-4492-9a28-5c5c7edf3fd1'); await sleep(9000); log('back url', page.url().replace(H, ''));
const ed2 = page.getByRole('button', { name: 'Edit' }).first(); if (await ed2.count()) { await ed2.click(); await sleep(1000); } log('description after sign-in', await page.locator('textarea').first().inputValue().catch(() => '?')); await shot('h11-after-signin');
