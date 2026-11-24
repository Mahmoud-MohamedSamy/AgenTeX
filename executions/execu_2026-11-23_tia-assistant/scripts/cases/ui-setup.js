await go('/settings/integrations/tia');
await page.waitForFunction(() => document.body.innerText.includes('Tia switch') || document.querySelector('input[type=password]'), null, { timeout: 90000 }).catch(() => {});
await page.waitForTimeout(3000);
log('url', page.url(), 'pw', await page.locator('input[type=password]').count());
if (await page.locator('input[type=password]').count()) return 'not signed in';
await shot('B01-setup-desk'); await shot('B01-setup-desk-full', { fullPage: true });
const t = (await text()); log('setup text', t.replace(/\n+/g, ' / ').slice(0, 2500));
log('testids', (await page.$$eval('[data-testid^="tia"]', e => [...new Set(e.map(x => x.getAttribute('data-testid')))])).join(' '));
return 'ok';
