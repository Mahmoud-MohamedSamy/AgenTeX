const o = {};
await page.locator('text=/^Layouts$/').first().click().catch(() => {}); await sleep(5000);
await page.locator('button[aria-label="Open menu for QA NDC ADM"]').click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1200);
await page.locator('text=/^Layout Properties$/').first().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(2500);
const dlg = page.locator('[role=dialog]'); o.dtext = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await dlg.locator('label', { hasText: /^QA NDC Accounting$/ }).first().click().catch(e => o.e3 = e.message.slice(0, 60)); await sleep(800);
o.before = await shot('rt/2796-props');
await dlg.locator('button', { hasText: /^Save$/ }).click().catch(e => o.e4 = e.message.slice(0, 60));
let t = ''; for (let i = 0; i < 10; i++) { await sleep(800); t = (await txt()).replace(/\s+/g, ' '); if (/only one layout|saved|updated/i.test(t) || !(await dlg.count())) break; }
o.err = t.match(/.{0,40}only one layout[^.]{0,120}/)?.[0]; o.dialogOpen = await dlg.count();
await sleep(2000); o.row = await page.$$eval('tr', trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim()).filter(t => /QA NDC ADM|QA NDC Accounting/.test(t)).slice(0, 3));
o.after = await shot('rt/2796-list');
return JSON.stringify(o);
