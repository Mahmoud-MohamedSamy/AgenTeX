await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; } await sleep(1500);
const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText('QA Text2', { exact: true }).first().boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down(); for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); } await sleep(400); await page.mouse.up(); await sleep(2500);
const ta = page.locator('#formula-expression'); await ta.click(); await page.keyboard.type('concat(qa_text, " ", "High value")', { delay: 50 }); await sleep(400);
log('string literal typed ->', JSON.stringify(await ta.inputValue())); await shot((H.includes('desk') ? 'desk-' : '') + 'SPACE-string-literal');
await page.getByText('GENERAL', { exact: true }).click(); await sleep(800); const en = page.locator('input').filter({ hasNot: page.locator('[type=checkbox]') }); 
const lab = page.getByRole('textbox').first(); await lab.click(); await page.keyboard.press('End'); await page.keyboard.type(' two', { delay: 50 }); log('label (first textbox) typed ->', JSON.stringify(await lab.inputValue()));
