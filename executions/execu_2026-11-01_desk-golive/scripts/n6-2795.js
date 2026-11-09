const o = {};
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC/.test(t)) break; }
await page.locator('text=/^Workflow Rules$/').first().click().catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/Workflow Rules for this module/.test(t) && /QA NDC/.test(t)) break; }
const s = page.locator('input[placeholder*="Search rules"]'); await s.fill('QA NDC GDS B2B'); await sleep(3000);
o.rows = await page.$$eval('tr', trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim().slice(0, 100)).filter(t => /GDS B2B/.test(t)));
o.shot = await shot('rt/2795-list');
return JSON.stringify(o);
