const R = {};
await openRules(); const row = page.locator('tr', { hasText: 'QA RT18 basic' }).first(); await row.locator('button').nth(1).click(); await sleep(5000);
const t = await bodyText(); R.unknown = (t.match(/[^ ]{0,30} \(unknown field\)/g) || []).slice(0, 5); const i = t.indexOf('Partner'); R.rows = (t.match(/QA RT18 (text|amount|date|email2)[^.]{0,40}/g) || []).slice(0, 8);
const tb = page.locator('button', { hasText: /^QA RT18 text$/ }).first(); R.textBtn = await tb.count();
if (R.textBtn) { await tb.scrollIntoViewIfNeeded(); await sleep(500); await shot('2981-1-api-rows-in-editor.png'); R.bRows = await box(page.locator('button', { hasText: /^QA RT18 text$/ }).first()); await tb.click(); await sleep(1200); R.fieldOpts = (await page.locator('[role=option]').allInnerTexts()).map(s => s.trim()); await shot('2981-2-field-list.png'); R.bList = await box(page.locator('[role=listbox]').first()); await page.keyboard.press('Escape'); }
return R;
