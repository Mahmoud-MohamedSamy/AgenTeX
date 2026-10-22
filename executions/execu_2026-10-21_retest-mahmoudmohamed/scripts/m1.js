await page.getByText('Modules', { exact: true }).first().click().catch(() => {}); await sleep(5000);
const btns = await page.getByRole('button').allInnerTexts();
const cm = page.getByRole('button', { name: /Create (New )?Module/i }).first();
let dlg = null;
if (await cm.count()) { await cm.click(); await sleep(2500); dlg = await page.locator('[role=dialog]').allInnerTexts(); await shot('1229-01-create-module'); }
return done({ url: page.url(), btns: btns.filter(x => x.trim()).slice(0, 40), dlg });
