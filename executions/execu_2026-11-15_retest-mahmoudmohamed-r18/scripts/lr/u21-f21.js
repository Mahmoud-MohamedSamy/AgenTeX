const R = {};
await openRules(); await page.locator('tr', { hasText: 'QA RT18 vip' }).first().locator('button').nth(1).click(); await sleep(5000);
await page.locator('main button', { hasText: /^Add action$/ }).last().click(); await sleep(900);
const types = page.locator('main button[aria-haspopup=listbox]', { hasText: /^Show fields$/ }); R.n = await types.count(); await types.last().click(); await sleep(700);
R.actionTypes = (await page.getByRole('option').allInnerTexts()).map(s => s.trim().split('\n')[0]);
await page.getByRole('option', { name: /^Show related lists/ }).click(); await sleep(900);
await page.locator('main button', { hasText: /^Choose…$/ }).last().click(); await sleep(900);
R.related = (await page.locator('[role=option]').allInnerTexts()).map(s => s.trim());
const cnt = {}; for (const r of R.related) cnt[r] = (cnt[r] || 0) + 1; R.dups = Object.entries(cnt).filter(([, c]) => c > 1); R.total = R.related.length; R.hasNotes = R.related.some(s => /^Notes/i.test(s));
await shot('2995-1-related-picker.png'); R.bList = await box(page.locator('[role=listbox]').first());
await page.keyboard.press('Escape'); await sleep(300);
await page.locator('main button', { hasText: /^Cancel$/ }).first().click().catch(() => {}); await sleep(1500);
// record page related list sections
await openRec(MID, I.massB); await page.mouse.wheel(0, 3000); await sleep(2000);
R.recSections = await page.evaluate(() => [...document.querySelectorAll('h2,h3,h4')].map(e => e.innerText.trim()).filter(Boolean).slice(0, 30));
R.tabs = (await page.getByRole('tab').allInnerTexts()).slice(0, 12);
return R;
