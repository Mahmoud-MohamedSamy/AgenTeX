const o = {};
await page.locator('button[aria-label="Open menu for QA NDC ADM"]').click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1200);
await page.locator('text=/^Layout Properties$/').first().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(2500);
o.dialog = (await page.$$eval('[role=dialog]', d => d.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 800))))[0];
o.shot = await shot('m17/tavi-adm-props');
return JSON.stringify(o);
