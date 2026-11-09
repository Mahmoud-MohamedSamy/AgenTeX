const rules = (await api('GET', '/workflow/assignment-rules?page_size=200&take=200')).j?.data; const mine = arr(rules).filter(r => /QA RT 2298/.test(r.name)).map(r => r.name + ' channels=' + JSON.stringify(r.allowedChannels) + ' active=' + r.isActive);
await page.getByRole('button', { name: 'Next' }).click(); await sleep(5000); await shot('2298-01-assign-step');
const cb = page.getByText(/Assign owner based on assignment rules/i).first(); await cb.click({ force: true }); await sleep(1500);
const sel = page.locator('select:visible'); let offered = [];
for (let i = 0; i < await sel.count(); i++) { const o = await sel.nth(i).evaluate(x => [...x.options].map(z => z.text)); if (o.some(t => /QA RT|rule/i.test(t))) offered = o; }
if (!offered.length) { const btn = page.getByRole('button', { name: /Select (a )?rule|Choose/i }).first(); if (await btn.count()) { await btn.click(); await sleep(1200); offered = await page.locator('[role=option]').allInnerTexts(); } }
await shot('2298-02-rule-list');
return done({ mine, offered: offered.filter(t => t.trim()).slice(0, 40) });
