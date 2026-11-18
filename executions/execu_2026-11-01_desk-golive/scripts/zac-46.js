const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
await page.getByPlaceholder(/Search in Setup/).fill('Notifications'); await page.waitForTimeout(2500);
out.res = (await body(page)).replace(/\s+/g, ' ').match(/Search in Setup.{0,300}/)?.[0];
const items = page.locator('text=/^Notifications$/'); out.n = await items.count();
await items.last().click().catch(e => out.e = e.message.slice(0, 60)); await page.waitForTimeout(8000); out.u = page.url();
const t = (await body(page)).replace(/\s+/g, ' '); const i = t.indexOf('Notifications', t.indexOf('Time Tracking')); out.page = t.slice(t.lastIndexOf('AUTOMATION') > 0 ? t.lastIndexOf('Time Tracking') : 0).slice(0, 1500);
out.shared = t.match(/.{0,150}(shared ticket|Shared Ticket|ticket is shared).{0,200}/)?.[0]; await shotZ(page, 'ac2-notifications2');
