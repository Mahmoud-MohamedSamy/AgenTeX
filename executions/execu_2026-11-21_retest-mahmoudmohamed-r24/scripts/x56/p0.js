await page.goto(H + '/views/all/tickets/7bec7744-755c-48bc-932f-6d3d5ce2191f', { waitUntil: 'domcontentloaded' }); await sleep(8000);
return { ls: await page.evaluate(() => Object.keys(localStorage)), cls: await page.evaluate(() => document.documentElement.className + ' | ' + JSON.stringify(document.documentElement.dataset)) };
