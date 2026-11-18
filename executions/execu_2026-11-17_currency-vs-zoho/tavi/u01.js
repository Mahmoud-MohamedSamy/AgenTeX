await page.goto(H + '/settings/company/details', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/Home currency/i.test(await text())) break; }
await sleep(1500);
const cur = page.getByText('Currencies', { exact: true }).first(); await cur.scrollIntoViewIfNeeded().catch(() => {});
await sleep(800); await shot('t01-currencies.png');
const t = await text(); const i = t.indexOf('Currencies\n'); log(t.slice(i, i + 700));
await page.getByRole('button', { name: 'Add currency' }).click(); await sleep(1500);
await shot('t02-add-dialog.png');
const cb = page.getByRole('combobox').first(); await cb.click().catch(() => {}); await sleep(1200);
const opts = await page.locator('[role=option]').allInnerTexts(); log('options ' + opts.length + ' ' + opts.slice(0, 6).join(' | '));
await shot('t03-add-picker.png');
await page.keyboard.press('Escape'); await sleep(400); await page.keyboard.press('Escape');
