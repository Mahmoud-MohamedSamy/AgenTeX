async (page) => { await page.mouse.click(122,72); await page.waitForTimeout(2000);
 await page.screenshot({path:'../screenshots/raw/zoho-2823-selectall.png'});
 const bar = async () => (await page.innerText('body')).split('\n').slice(19,24).join(' | ');
 const rows = async () => (await page.innerText('body')).match(/#1\d\d\b/g)?.length;
 const a = { bar: await bar(), rows: await rows() };
 await page.mouse.move(800,500); for (let i=0;i<6;i++){ await page.mouse.wheel(0,1500); await page.waitForTimeout(2000); }
 await page.screenshot({path:'../screenshots/raw/zoho-2823-scrolled.png'});
 const b = { bar: await bar(), rows: await rows(), tail: (await page.innerText('body')).slice(-500) };
 return { a, b }; }
