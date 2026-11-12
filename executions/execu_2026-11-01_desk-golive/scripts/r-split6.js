const o = {}; await go('/views/all/tickets', 12000);
await page.getByText('Spam Tickets', { exact: false }).first().click().catch(e => o.err = String(e).slice(0, 100)); await sleep(8000);
o.url = page.url(); o.text = (await txt()).replace(/\s+/g, ' ').slice(0, 900); o.shot = await shot('../wave2n/r-split-spam');
return done(o);
