const id = '1499272000000451502';
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/edit/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
for (let i = 0; i < 15; i++) { await page.waitForTimeout(1500); if (/Department\*/.test(await body(page))) break; }
const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
await shotZ(page, 'c6-113-edit-before');
const inp = page.locator('input[value="TechEgySolutions"]').first(); out.depInputs = await page.locator('input[value="TechEgySolutions"]').count();
await inp.click(); await page.waitForTimeout(1500);
out.opts = await page.locator('li').evaluateAll(es => es.filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim()).filter(t => /^(Tech|TechEgySolutions|QA C10 Marketing)$/.test(t)));
await page.locator('li').filter({ hasText: /^\s*Tech\s*$/ }).first().click({ force: true }); await page.waitForTimeout(3000);
out.form = (await body(page)).match(/Ticket Owner.{0,80}/)?.[0]; out.dialog = (await body(page)).match(/.{0,120}(layout|department|Department).{0,200}/g)?.slice(-2);
await shotZ(page, 'c6-113-edit-after-dept');
