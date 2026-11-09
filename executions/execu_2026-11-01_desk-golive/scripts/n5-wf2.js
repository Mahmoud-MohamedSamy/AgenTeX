const o = {};
o.rows = await page.$$eval('tr', trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim().slice(0, 140)).filter(t => /NDC/.test(t)).slice(0, 50));
return JSON.stringify(o);
