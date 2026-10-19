await sleep(6000); await shot('NDC-1821-recycle-bin-after');
return done((await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 700));
