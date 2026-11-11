async (page) => { await page.mouse.click(958,628); await page.waitForTimeout(2000); await page.screenshot({path:'../screenshots/raw/zoho-2794-team-agents.png'}); return 'ok'; }
