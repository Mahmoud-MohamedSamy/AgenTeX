const o = {};
await page.locator('button', { hasText: /^\s*Cancel\s*$/ }).first().click().catch(() => {}); await sleep(2000);
const d = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /^(Discard|Leave|Yes|OK)/ }); if (await d.count()) { await d.first().click(); await sleep(1500); }
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC/.test(t)) break; }
await page.locator('text=/^Workflow Rules$/').first().click().catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC Close Ticket/.test(t)) break; }
await page.locator('text=QA NDC Close Ticket').first().click().catch(e => o.e = e.message.slice(0, 60));
for (let i = 0; i < 20; i++) { await sleep(1500); const t = await txt(); if (/WHEN/.test(t) && /Close Ticket/.test(t)) break; }
await sleep(1500); await page.locator('text=/This rule will be executed/').first().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(2000);
o.t = (await txt()).replace(/\s+/g, ' ').match(/EXECUTE BASED ON.{0,500}/)?.[0];
o.shot = await shot('a3/tavi-trigger');
return JSON.stringify(o);
