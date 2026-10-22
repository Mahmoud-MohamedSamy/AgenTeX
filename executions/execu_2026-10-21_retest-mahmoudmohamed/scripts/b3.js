const stop = capOn();
await page.locator('#live-field-__pipeline__ button[aria-haspopup=listbox]').click(); await sleep(1500);
const opts = await page.locator('[role=option]').allInnerTexts();
await page.locator('[role=option]').filter({ hasText: /^1$|^1\s/ }).first().click(); await sleep(1500);
// stage options on create form
const stageField = page.locator('[id^=live-field-]').filter({ has: page.locator('label', { hasText: /^Stage$/ }) }).first();
await stageField.locator('button').first().click().catch(()=>{}); await sleep(1200);
const stageOpts = await page.locator('[role=option]').allInnerTexts(); await page.keyboard.press('Escape'); await sleep(500);
await page.locator('[id^=live-field-]').filter({ has: page.locator('label', { hasText: /^Amount$/ }) }).locator('input').fill('5000');
await page.locator('[id^=live-field-]').filter({ has: page.locator('label', { hasText: /Deal name/ }) }).locator('input').fill('QA RT 1302 deal');
await shot('1302-01-create-pipeline1');
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(8000);
stop();
return done({ opts, stageOpts, url: page.url(), cap: cap.filter(c => /^(POST|PATCH|PUT)/.test(c)), top: (await txt()).split('Meetings')[1]?.slice(0, 1500) });
