const o = {}; await page.keyboard.press('Escape'); await sleep(800);
const tg = page.locator('button[aria-label="Toggle QA NDC ADM status"]');
o.before = await tg.getAttribute('aria-checked').catch(() => null) || await tg.getAttribute('data-state').catch(() => null);
if (o.before === 'false' || o.before === 'unchecked') { await tg.click(); await sleep(2500); const d = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /^(Activate|Enable|Confirm|Yes|OK)$/ }); if (await d.count()) { await d.first().click(); await sleep(2000); } }
o.after = await tg.getAttribute('aria-checked').catch(() => null) || await tg.getAttribute('data-state').catch(() => null);
o.shot = await shot('m17/tavi-adm-restored');
return JSON.stringify(o);
