await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Checks/.test(await text())) break; } await sleep(2000);
const ln = page.getByText('Line', { exact: true }).first(); await ln.scrollIntoViewIfNeeded(); await sleep(500); const b = await ln.boundingBox();
await page.mouse.move(b.x, b.y + 30); await sleep(700); await page.mouse.click(b.x + 104, b.y + 25); await sleep(1500); await shot('F9-dots');
const pop = await page.locator('[role=menu], [role=dialog], [data-radix-popper-content-wrapper], [role=listbox]').allInnerTexts(); log('popups', JSON.stringify(pop).slice(0, 400));
const it = page.getByText(/^(Edit|Properties|Edit properties|Field properties|Settings)$/i).first(); if (await it.count()) { await it.click(); await sleep(2000); }
log('panel', /Field Properties/.test(await text()));
if (/Field Properties/.test(await text())) {
  await page.getByText('ADVANCED', { exact: true }).click().catch(() => { }); await sleep(1500); await shot('F9-subform-advanced');
  const box = page.locator('[data-testid^="subform-formula-"] textarea').first(); log('boxes', await page.locator('[data-testid^="subform-formula-"]').count(), 'value', await box.inputValue().catch(() => '?'));
  const msg = async () => (await page.locator('[data-testid^="subform-formula-"]').first().innerText()).split('\n').slice(0, 2).join(' / ');
  for (const [k, e] of Object.entries({ F9: 'qa_items3.qty * 2', F10self: 'line + 1', unknown: 'nope * 2', empty: '', ok: 'qty * price' })) { await box.fill(e); await sleep(500); log(k, JSON.stringify(e), '->', await msg()); }
  await box.fill('line + 1'); await sleep(300); await shot('F10-self-ref');
}
