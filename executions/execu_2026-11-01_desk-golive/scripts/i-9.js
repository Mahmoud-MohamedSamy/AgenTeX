const o = {}; await page.getByText('Departments', { exact: true }).first().click(); await sleep(8000);
await page.getByText('Marketing', { exact: true }).first().click().catch(e => o.e = String(e).slice(0, 60)); await sleep(8000);
const t = (await txt()).replace(/\s+/g, ' '); o.url = page.url(); o.sig = (t.match(/.{0,300}signature.{0,700}/i) || ['-'])[0];
o.tabs = await page.locator('[role=tab]').allInnerTexts().catch(() => []);
for (const tb of o.tabs.filter(x => /sign|mail|email/i.test(x))) { await page.locator('[role=tab]', { hasText: tb }).first().click(); await sleep(5000); const t2 = (await txt()).replace(/\s+/g, ' '); o['tab ' + tb] = (t2.match(/.{0,300}signature.{0,700}/i) || ['-'])[0]; if (/signature/i.test(t2)) { await page.getByText(/signature/i).first().scrollIntoViewIfNeeded().catch(() => {}); o.shot = await shot('../wave2n/i-dept-signature'); } }
return done(o);
