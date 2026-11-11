async (page) => { await page.mouse.click(808,541); await page.waitForTimeout(2500); await page.screenshot({path:'../screenshots/raw/zoho-2794-teams-tab.png'}); return 'ok'; }
