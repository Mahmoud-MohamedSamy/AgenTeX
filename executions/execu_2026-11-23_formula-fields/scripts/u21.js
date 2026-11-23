await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; } await sleep(1500);
const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText('QA Text2', { exact: true }).first().boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down(); for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); } await sleep(400); await page.mouse.up(); await sleep(2500);
const ta = page.locator('#formula-expression'); await ta.click(); await page.keyboard.type('qa_num * 2 + 1', { delay: 60 }); await sleep(500); log('typed with keyboard ->', JSON.stringify(await ta.inputValue()));
await ta.fill(''); await ta.click(); for (const k of ['a', 'Space', 'b']) await page.keyboard.press(k); log('a Space b ->', JSON.stringify(await ta.inputValue()));
await ta.fill(''); await ta.click(); await page.keyboard.insertText('x y'); log('insertText (paste-like) ->', JSON.stringify(await ta.inputValue())); await shot('SPACE-typed');
// label field in GENERAL, to compare
await page.getByText('GENERAL', { exact: true }).click(); await sleep(800); const lab = page.locator('input[value="Formula"]').first(); if (await lab.count()) { await lab.click(); await page.keyboard.press('End'); await page.keyboard.type(' two words', { delay: 50 }); log('label typed ->', JSON.stringify(await lab.inputValue())); }
// the record create form (a normal text box) for comparison
await page.goto(H + `/modules/${made.mod}/records/new`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 25; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; }
const nm = page.getByPlaceholder('Name').first(); await nm.click(); await page.keyboard.type('a b c', { delay: 50 }); log('record form typed ->', JSON.stringify(await nm.inputValue()));
