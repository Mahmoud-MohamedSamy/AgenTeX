const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(H + '/modules/' + D + '/records/new', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-rule-field]', { timeout: 60000 }).catch(() => {});
await sleep(3000);
const f = page.locator('[data-rule-field="currency"]');
log('currency field count ' + await f.count());
if (await f.count()) {
  await f.first().scrollIntoViewIfNeeded(); await sleep(600);
  const trig = f.first().locator('button, [role=combobox], select').first(); await trig.click().catch(e => log('click ' + e.message.slice(0, 80))); await sleep(1500);
  const opts = await page.locator('[role=option]:visible').allInnerTexts(); log('options: ' + opts.join(' | '));
  await shot('t07-deal-create-currency.png');
  await page.keyboard.press('Escape');
} else { await shot('t07-deal-create.png'); const t = await text(); log(t.slice(0, 1500)); }
