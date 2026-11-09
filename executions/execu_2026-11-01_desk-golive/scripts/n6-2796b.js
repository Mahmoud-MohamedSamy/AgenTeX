const o = {};
await page.locator('button[aria-label="Open menu for QA NDC ADM"]').click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1200);
await page.locator('text=/^Layout Properties$/').first().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(2500);
const dlg = page.locator('[role=dialog]');
const row = dlg.locator('label, div, li').filter({ hasText: /^QA NDC Accounting/ }).first();
o.rowText = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
o.defaults = await dlg.evaluate(d => [...d.querySelectorAll('*')].filter(e => e.children.length === 0 && /Default/.test(e.textContent)).map(e => e.parentElement.innerText.replace(/\s+/g, ' ').slice(0, 60)).slice(0, 6));
o.shot = await shot('rt/2796-props2');
return JSON.stringify(o);
