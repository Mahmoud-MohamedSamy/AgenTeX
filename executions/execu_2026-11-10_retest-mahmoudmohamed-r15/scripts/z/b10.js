async (page) => { await page.mouse.click(1552,387); await page.waitForTimeout(4000);
 await page.screenshot({path:'../screenshots/raw/zoho-2729-fu-new.png'}); return (await page.innerText('body')).split('\n').filter(Boolean).slice(13,60).join(' | '); }
