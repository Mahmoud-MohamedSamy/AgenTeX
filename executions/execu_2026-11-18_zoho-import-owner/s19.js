const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.locator('[data-id="findByField_textBox"]').first().click(); await page.waitForTimeout(2000);
for (const l of await page.locator('li:visible').all()) { if ((await l.innerText()).trim() === 'None') { await l.click(); out.none = 1; break; } }
await page.waitForTimeout(1500);
out.vals = await page.$$eval('input', es => es.filter(e=>e.offsetParent && /^(dest_|findBy)/.test(e.getAttribute('data-id')||'')).map(e => e.value));
await page.getByText(/^Save$/).first().click(); await page.waitForTimeout(8000);
await page.screenshot({ path: D + 'shots/15-A-saved.png' });
const t = await body(page); const i = t.indexOf('import'); out.after = t.slice(i, i + 1500);
