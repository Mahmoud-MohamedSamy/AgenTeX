const o = {};
for (let i = 0; i < 6; i++) { await page.mouse.click(1255, 199); await sleep(400); }
await page.getByText(/^HISTORY$/).first().click().catch(e => o.e = String(e).slice(0, 80)); await sleep(6000);
o.hist = (await txt()).replace(/\s+/g, ' ').match(/Ticket History.{0,1200}/)?.[0];
o.shot = await shot('../wave2n/i-move-history');
return done(o);
