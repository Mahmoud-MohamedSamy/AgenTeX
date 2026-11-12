await page.goto(HC, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
await page.getByRole('link', { name: /^Knowledge base$/ }).first().click(); await page.waitForTimeout(5000);
out.kbUrl = page.url().replace(HC, '~/');
await page.getByText('QA GL W4 KB', { exact: true }).first().click().catch(e => out.e1 = e.message.slice(0, 60)); await page.waitForTimeout(5000);
await page.getByText('QA GL W4 article', { exact: true }).first().click().catch(e => out.e2 = e.message.slice(0, 60)); await page.waitForTimeout(7000);
out.artUrl = page.url().replace(HC, '~/');
out.imgs = await page.locator('main img').evaluateAll(is => is.map(i => ({ ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth, host: (i.currentSrc || i.src).replace(/^(https?:\/\/[^/]+).*/, '$1'), signed: /X-Amz-Expires|Signature|Expires=/i.test(i.src) })));
await shot('w4/W4-60-image-recheck');
