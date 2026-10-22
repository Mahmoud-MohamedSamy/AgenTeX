await page.getByRole('button', { name: 'Add Stages' }).nth(1).click(); await sleep(2500);
const dlg = await page.locator('[role=dialog]').allInnerTexts();
await shot('1295-01-addstages');
return done({ dlg });
