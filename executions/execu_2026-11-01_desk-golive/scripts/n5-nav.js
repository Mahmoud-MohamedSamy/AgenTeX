const o = {};
await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/Notifications/.test(t)) break; }
await page.locator('a, button', { hasText: /^Notifications$/ }).first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(5000);
o.u1 = page.url().replace(H, ''); o.t1 = (await txt()).replace(/\s+/g, ' ').replace(/^.*?CRM ⇄ Desk Integr\S*/, '').slice(0, 900);
return JSON.stringify(o);
