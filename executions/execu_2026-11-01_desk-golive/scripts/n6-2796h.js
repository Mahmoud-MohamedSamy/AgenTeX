const o = {};
await page.getByRole('menuitem', { name: /Change Layout/ }).click().catch(e => o.e = e.message.slice(0, 60)); await sleep(2000);
o.dialog = (await page.$$eval('[role=dialog]', d => d.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 600))))[0];
o.shot = await shot('rt/2796-change-layout');
return JSON.stringify(o);
