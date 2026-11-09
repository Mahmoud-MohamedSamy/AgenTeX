const o = {};
await page.mouse.click(615, 707); await sleep(2000);
o.opts = await page.$$eval('[role=option]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').trim().replace(/\S+@\S+/g, '<e>')).slice(0, 15));
o.n = await page.locator('[role=option]').count();
o.shot = await shot('rt/2794-agent-picker');
return JSON.stringify(o);
