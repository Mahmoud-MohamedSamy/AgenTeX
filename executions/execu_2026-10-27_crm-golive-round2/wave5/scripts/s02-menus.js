const res = {};
const items = async () => page.evaluate(() => [...document.querySelectorAll('[role=menu] [role=menuitem], [role=menu] button, [role=dialog], [role=listbox] [role=option], [data-radix-popper-content-wrapper]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 25));
for (const b of ['Export', 'Share', 'More', 'Report actions', 'Format']) {
  const el = page.locator(`main button[aria-label="${b}"], main button`, { hasText: b }).first();
  const alt = page.locator(`main button[aria-label="${b}"]`).first();
  try { if (await alt.count()) await alt.click(); else await el.click(); } catch (e) { res[b] = 'click failed'; continue; }
  await sleep(1500); res[b] = await items(); await shot('s02-menu-' + b.replace(/\s+/g, '-').toLowerCase());
  await page.keyboard.press('Escape'); await sleep(700);
}
return res;
