async (page) => { const nn = page.getByText('Not Now',{exact:true}); if (await nn.count()) await nn.first().click().catch(()=>{}); await page.waitForTimeout(1000);
 // hover first row icon, click it to select
 await page.mouse.move(122,132); await page.waitForTimeout(800); await page.mouse.click(122,132); await page.waitForTimeout(1500);
 await page.screenshot({path:'../screenshots/raw/zoho-2823-one.png'});
 const t = (await page.innerText('body')).slice(0,500);
 const cbs = await page.$$eval('input[type=checkbox]', a=>a.length);
 return { t, cbs }; }
