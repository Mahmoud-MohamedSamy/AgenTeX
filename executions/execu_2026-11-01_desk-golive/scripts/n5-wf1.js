const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC/.test(t)) break; }
await page.locator('text=/^Workflow Rules$/').first().click().catch(e => o.e = e.message.slice(0, 60));
for (let i = 0; i < 30; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC/.test(t) && /Rule/.test(t)) break; }
await sleep(2000); o.url = page.url().replace(H, ''); o.t = (await txt()).replace(/\s+/g, ' ').replace(/^.*?Summary/, '').slice(0, 1200);
o.shot = await shot('m18/tavi-wf-list');
return JSON.stringify(o);
