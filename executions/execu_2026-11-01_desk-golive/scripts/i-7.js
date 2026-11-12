const o = {}; await page.locator('[role=tab]', { hasText: /^Replies/ }).first().click(); await sleep(7000);
const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Suppressions'); o.text = t.slice(i, i + 2500);
const s = page.getByText(/signature/i).first(); if (await s.count()) { await s.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1000); }
o.shot = await shot('../wave2n/i-company-signature');
return done(o);
