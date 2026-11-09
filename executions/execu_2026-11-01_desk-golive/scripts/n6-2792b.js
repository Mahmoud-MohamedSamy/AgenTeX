const o = {}; await page.reload({ waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/Workflow Rules for this module/.test(t) && /QA NDC/.test(t)) break; }
if (!/Workflow Rules for this module/.test(await txt())) { await page.locator('text=/^Workflow Rules$/').first().click().catch(() => {}); await sleep(6000); }
const t = (await txt()).replace(/\s+/g, ' '); o.head = t.match(/New Rule.{0,160}/)?.[0];
const s = page.locator('input[placeholder*="Search rules"]'); if (await s.count()) { await s.fill('QA RT 2792'); await sleep(2500); }
o.rows = await page.$$eval('tr', trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim().slice(0, 90)).filter(t => /QA RT 2792/.test(t)));
o.shot = await shot('rt/2792-after');
return JSON.stringify(o);
