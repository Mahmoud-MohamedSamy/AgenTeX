const o = {};
await page.locator('text=/^Edit Properties$/').first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(2500);
o.dialog = (await page.$$eval('[role=dialog]', d => d.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 1500))))[0];
o.shot = await shot('a9/tavi-status-props');
return JSON.stringify(o);
