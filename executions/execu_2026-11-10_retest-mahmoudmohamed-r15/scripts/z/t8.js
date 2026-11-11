async (page) => { await page.mouse.click(835,522); await page.waitForTimeout(2500); await page.screenshot({path:'../screenshots/raw/zoho-2794-assign-picker.png'}); return 'ok'; }
