await page.getByText('Rename layout', { exact: true }).click(); await sleep(1500);
const inp = page.locator('input:focus, [role=dialog] input, header input').first();
await inp.fill('QA RT L2'); await sleep(1500);
const t = (await txt()).match(/(already|exists|in use|taken)[^\n]{0,120}/i)?.[0] || 'no inline warning text';
const ui = (await page.locator('[role=dialog]').allInnerTexts()).join('|').slice(0, 400);
await shot('2254-02-typed-duplicate');
// try to commit
await page.keyboard.press('Enter'); await sleep(1500);
const t2 = (await txt()).match(/(already|exists|in use|taken)[^\n]{0,160}/i)?.[0] || 'no warning after Enter';
await shot('2254-03-after-enter');
return done({ t, ui, t2 });
