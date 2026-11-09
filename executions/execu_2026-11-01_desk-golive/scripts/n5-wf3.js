const o = {};
await page.locator('tr', { hasText: 'QA NDC Ticket owner -1' }).locator('text=QA NDC Ticket owner -1').first().click().catch(e => o.e = e.message.slice(0, 60));
for (let i = 0; i < 20; i++) { await sleep(1500); const t = await txt(); if (/Action/i.test(t) && /Ticket owner -1/.test(t) && !/Loading/.test(t)) break; }
await sleep(2000); o.url = page.url().replace(H, ''); o.t = (await txt()).replace(/\s+/g, ' ').match(/QA NDC Ticket owner -1.{0,1500}/)?.[0];
o.shot = await shot('m20/tavi-rule');
return JSON.stringify(o);
