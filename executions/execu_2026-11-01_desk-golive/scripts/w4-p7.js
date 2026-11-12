await go('/community', 9000);
await page.getByText(/^Reported spam/i).first().click().catch(() => {}); await sleep(4000);
await page.locator('main').last().getByText(/^Replies/).first().click().catch(e => out.e = e.message.slice(0, 80)); await sleep(4000);
out.reported = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 600);
await shot('w4/W4-57-desk-reported');
return fin({ out });
