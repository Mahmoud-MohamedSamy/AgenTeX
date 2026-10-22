await page.getByText('QA RT 1172', { exact: true }).first().click(); await sleep(6000);
const t = (await txt()).split('Storage Requests')[1]?.slice(0, 1200);
await shot('1172-06-open-from-settings');
return done({ url: page.url(), t, toasts: await page.locator('[data-sonner-toast]').allInnerTexts() });
