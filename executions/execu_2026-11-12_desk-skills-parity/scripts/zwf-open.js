// Opens a fresh Zoho "New Workflow" (Tickets, Tech, on Create, no criteria) and opens action ACTION from the + menu. Lists the picker options.
async (page) => { const ACTION = globalThis.__ACT || 'Add Skills';
 const S = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/';
 await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/1475109000000426945/workflows/rules', {waitUntil:'domcontentloaded'}); await page.reload(); await page.waitForTimeout(9000);
 const f = page.frames().find(x => /ShowHomePage/.test(x.url()));
 await f.getByText('Create Rule', {exact:true}).first().click({force:true}); await page.waitForTimeout(4000);
 await page.keyboard.press('Escape'); await f.locator('#ruleNameTmp').fill('QA SK13 WF skills');
 await f.locator('#showWFRuleStep2Btn').click({force:true}); await page.waitForTimeout(3000);
 await f.getByText('Create', {exact:true}).first().click({force:true}); await page.waitForTimeout(800);
 await f.locator('input[type=button][value=Next]:visible').last().click({force:true}); await page.waitForTimeout(3000);
 await page.mouse.click(1296, 527); await page.waitForTimeout(1500); await page.mouse.click(1150, 560); await page.keyboard.type(ACTION, {delay:50}); await page.waitForTimeout(1500);
 await page.mouse.click(1061, 647); await page.waitForTimeout(3000);
 await page.mouse.click(600, 160); await page.waitForTimeout(2500);
 await page.screenshot({path: S + 'z-wf9.png'});
 return await f.evaluate(() => [...document.querySelectorAll('li')].filter(l => l.offsetParent).map(l => l.innerText.trim()).filter(Boolean).slice(0, 40)); }
