async (page) => { const S = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/';
 await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/1475109000000426945/workflows/rules', {waitUntil:'domcontentloaded'}); await page.reload(); await page.waitForTimeout(10000);
 const f = page.frames().find(x => /ShowHomePage/.test(x.url())); if (!f) return 'no frame';
 await f.getByText('Create Rule', {exact:true}).first().click({force:true}); await page.waitForTimeout(4000);
 await page.keyboard.press('Escape'); await f.locator('#ruleNameTmp').fill('QA SK13 picker view');
 await f.locator('#showWFRuleStep2Btn').click({force:true}); await page.waitForTimeout(3000);
 await f.getByText('Create', {exact:true}).first().click({force:true}); await page.waitForTimeout(800);
 await f.locator('input[type=button][value=Next]:visible').last().click({force:true}); await page.waitForTimeout(3000);
 await page.screenshot({path: S + 'ze3.png'}); return page.url(); }
