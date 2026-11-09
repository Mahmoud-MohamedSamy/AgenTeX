const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC/.test(t)) break; }
await page.locator('text=/^Workflow Rules$/').first().click().catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/Workflow Rules for this module/.test(t) && /QA NDC/.test(t)) break; }
await sleep(1500); const t = (await txt()).replace(/\s+/g, ' '); o.head = t.match(/Workflow Rules for this module.{0,260}/)?.[0];
o.newRuleDisabled = await page.locator('button', { hasText: /New Rule/ }).first().isDisabled().catch(() => null);
o.shot = await shot('rt/2792-list');
return JSON.stringify(o);
