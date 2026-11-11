async (page) => { await page.mouse.click(834,794); await page.waitForTimeout(2000); await page.screenshot({path:'../screenshots/raw/zoho-2794-teams-list.png'}); return 'ok'; }
