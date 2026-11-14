await page.setViewportSize({ width: 1272, height: 866 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
await page.getByText('Ticket Information', { exact: true }).first().waitFor({ timeout: 240000 }); await sleep(3000);
const box = async l => { const b = await l.boundingBox().catch(() => null); return b && { y: Math.round(b.y), h: Math.round(b.height) }; };
const f = page.locator('xpath=//*[normalize-space(text())="Ticket Owner"]/following::*[self::button or @role="combobox"][1]').first();
const p = page.getByPlaceholder('Search users…').locator('xpath=ancestor::*[@role="dialog" or @data-radix-popper-content-wrapper or contains(@class,"popover") or contains(@class,"Popover")][1]');
const out = [];
for (const [startScroll, steps] of [[0, [100, 100, 100, 300, 600]], [300, [100, 200, 400]]]) {
  await page.mouse.move(300, 600); await page.mouse.wheel(0, -3000); await sleep(800); if (startScroll) { await page.mouse.wheel(0, startScroll); await sleep(800); }
  await f.click(); await sleep(1500); let acc = 0;
  out.push({ start: startScroll, at: 0, field: await box(f), popup: await box(p), open: await page.getByPlaceholder('Search users…').isVisible() });
  for (const s of steps) { await page.mouse.move(300, 600); await page.mouse.wheel(0, s); acc += s; await sleep(1200); out.push({ start: startScroll, at: acc, field: await box(f), popup: await box(p), open: await page.getByPlaceholder('Search users…').isVisible() }); if (acc === 300 && startScroll === 300) await shot('2860-owner-start300.png'); }
  await shot('2860-owner-end-' + startScroll + '.png');
  await page.keyboard.press('Escape'); await sleep(600);
}
log(out.map(o => `start ${o.start} +${o.at}: field y ${o.field && o.field.y} | popup ${o.open ? (o.popup ? o.popup.y + '..' + (o.popup.y + o.popup.h) : 'open') : 'CLOSED'}`));
