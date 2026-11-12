async (page) => { await page.mouse.click(494, 203); await page.waitForTimeout(1200);
 const opt = page.getByText('QA SK12 Dept A', { exact: true }).last(); await opt.scrollIntoViewIfNeeded().catch(()=>{}); await opt.click(); await page.waitForTimeout(4000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-skills-qa.png' });
 const literal = await page.getByText('QA SK12 <b>x</b>').count(); const bold = await page.locator('main b').count();
 return { literal, bold }; }
