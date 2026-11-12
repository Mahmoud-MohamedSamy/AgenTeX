const t = await api('GET', '/desk/community/topics/604d7a0c-6e28-44cc-af76-9d68b1576888'); const d = D(t.j) || {}; out.counts = { report_count: d.report_count, reply_report_count: d.reply_report_count };
await go('/community', 9000);
out.nav = (await page.locator('body').innerText()).replace(/\s+/g, ' ').match(/(Reported|Spam|Moderation)[^.]{0,120}/gi);
const m = page.getByText(/Reported/i).first(); if (await m.count()) { await m.click().catch(() => {}); await sleep(5000); }
out.reported = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 500);
await shot('w4/W4-57-desk-reported');
return fin({ out });
