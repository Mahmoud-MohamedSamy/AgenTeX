const R = {};
await openRules(); const row = page.locator('tr', { hasText: 'QA RT18 basic' }).first(); await row.locator('button').nth(1).click(); await sleep(5000);
const opBtn = async label => page.locator('button', { hasText: new RegExp('^' + label + '$') }).first();
for (const [k, lab] of [['text', 'starts with'], ['amount', '>'], ['date', 'after']]) { const b = await opBtn(lab); if (!(await b.count())) { R[k] = 'no btn'; continue; } await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(900); R[k] = (await page.locator('[role=option]').allInnerTexts()).map(s => s.trim()); if (k === 'text') { await shot('2981-3-text-operators.png'); R.bOps = await box(page.locator('[role=listbox]').first()); } await page.keyboard.press('Escape'); await sleep(400); }
R.dateVal = await page.locator('input[type=date]').evaluateAll(es => es.map(e => e.value));
return R;
