const o = {}; await page.keyboard.press('Escape'); await sleep(500);
await page.locator('button[aria-label="Open menu for QA NDC ADM"]').click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1500);
o.menu = await page.$$eval('[role=menuitem], [role=menu] button, [role=menu] a', es => es.map(e => e.innerText.trim()).filter(Boolean));
o.shot = await shot('m17/tavi-adm-menu');
return JSON.stringify(o);
