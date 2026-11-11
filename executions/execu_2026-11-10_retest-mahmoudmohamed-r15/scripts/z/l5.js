async (page) => { await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(20000);
 const nn = page.getByText('Not Now',{exact:true}); if (await nn.count()) await nn.first().click().catch(()=>{});
 const cnt = async () => { const t = await page.innerText('body'); return { bar: t.split('\n').slice(19,22).join('|'), footer: (t.match(/\d+\/\d+/g)||[]).slice(-1)[0], title: (t.match(/All Tickets\s*\(\d+\)/)||[''])[0] }; };
 const r = { start: await cnt() };
 await page.mouse.move(122,132); await page.waitForTimeout(800); await page.mouse.click(122,132); await page.waitForTimeout(1500);
 await page.mouse.click(122,72); await page.waitForTimeout(2500); r.afterSelectAll = await cnt();
 await page.mouse.move(122,72); await page.waitForTimeout(1500); r.tooltip = (await page.innerText('body')).match(/Select All|Deselect All|Select all[^\n]*/i)?.[0];
 await page.screenshot({path:'../screenshots/raw/zoho-2823-selectall-50.png'});
 await page.mouse.move(800,500); for (let i=0;i<12;i++){ await page.mouse.wheel(0,2500); await page.waitForTimeout(2000); }
 r.afterScroll = await cnt(); await page.screenshot({path:'../screenshots/raw/zoho-2823-after-scroll.png'});
 return r; }
