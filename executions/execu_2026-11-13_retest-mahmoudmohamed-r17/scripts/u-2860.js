await page.setViewportSize({ width: 1272, height: 866 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
await page.getByText('Ticket Information', { exact: true }).first().waitFor({ timeout: 240000 }); await sleep(3000);
const box = async l => { const b = await l.boundingBox().catch(() => null); return b && { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
const popup = () => page.locator('[role=listbox], [role=menu], [data-radix-popper-content-wrapper], [cmdk-list]').last();
const fieldCtl = label => page.locator(`xpath=//*[normalize-space(text())="${label}"]/following::*[self::button or @role="combobox"][1]`).first();
const saveBtn = page.getByRole('button', { name: 'Save', exact: true }).first();
const header = page.locator('header').first();
const res = {};
for (const label of ['Department', 'Ticket Owner']) {
  const f = fieldCtl(label); await f.scrollIntoViewIfNeeded(); await sleep(500);
  await f.click(); await sleep(1500);
  const p = popup(); const r = { fieldBefore: await box(f), popupBefore: await box(p) };
  await shot(`2860-${label.replace(/ /g, '')}-1-open.png`);
  // scroll the form (wheel over the form area, away from the popup)
  await page.mouse.move(300, 600); await page.mouse.wheel(0, 400); await sleep(1500);
  r.popupOpenAfterScroll = await p.isVisible().catch(() => false);
  r.fieldAfter = await box(f); r.popupAfter = await box(p); r.header = await box(header); r.save = await box(saveBtn);
  if (r.popupOpenAfterScroll && r.popupAfter && r.fieldAfter) r.gapPopupToField = r.popupAfter.y - (r.fieldAfter.y + r.fieldAfter.h);
  if (r.popupOpenAfterScroll && r.popupAfter && r.save) { const s = r.save, q = r.popupAfter; r.coversSave = !(q.x > s.x + s.w || q.x + q.w < s.x || q.y > s.y + s.h || q.y + q.h < s.y); }
  await shot(`2860-${label.replace(/ /g, '')}-2-scrolled.png`);
  // can Save be hit? use elementFromPoint at Save center
  if (r.save) r.saveHit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.closest('button') ? e.closest('button').innerText.trim() : e.tagName + ' ' + (e.className || '').toString().slice(0, 60)) : null; }, [r.save.x + r.save.w / 2, r.save.y + r.save.h / 2]);
  res[label] = r;
  await page.keyboard.press('Escape'); await sleep(800); await page.mouse.wheel(0, -2000); await sleep(800);
}
log(res);
