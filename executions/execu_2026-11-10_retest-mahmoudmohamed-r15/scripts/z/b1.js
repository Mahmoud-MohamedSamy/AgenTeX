async (page, frame) => { await page.mouse.click(341,72); await page.waitForTimeout(1500);
 await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/blueprint',{waitUntil:'domcontentloaded'}).catch(()=>{}); await page.waitForTimeout(35000);
 const f = frame(); const t = (await f.innerText('body').catch(()=>'')).replace(/\n+/g,' | ').slice(0,1500);
 await page.screenshot({path:'z/b1.png'}); return { url: page.url(), frames: page.frames().map(x=>x.url().slice(0,100)), t }; }
