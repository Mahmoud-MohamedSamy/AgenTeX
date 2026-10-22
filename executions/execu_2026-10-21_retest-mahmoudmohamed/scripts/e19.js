const h = page.getByText('QA RT 1325 pipeline', { exact: true }).first();
const btn = h.locator('xpath=ancestor::div[.//button][1]//button').last();
const cnt = await h.locator('xpath=ancestor::div[.//button][1]//button').count();
await btn.click(); await sleep(1200);
const menu = await page.locator('[role=menu]').allInnerTexts();
await shot('1325-05-menu');
return done({ cnt, menu });
