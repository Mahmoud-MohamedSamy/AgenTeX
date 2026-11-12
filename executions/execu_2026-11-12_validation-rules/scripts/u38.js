async (page) => {
  // M3 keyboard only: open New Rule, tab through the editor, check focus is visible, pick layout/field with keys, Escape closes
  const X = globalThis.__IDS; const R = { stops: [] };
  const cur = () => page.evaluate(() => { const e = document.activeElement; if (!e) return null; const s = getComputedStyle(e); const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || /rgb/.test(s.boxShadow) && s.boxShadow !== 'none'; return (e.getAttribute('aria-label') || e.innerText || e.placeholder || e.name || e.type || e.tagName).toString().trim().slice(0, 30) + (ring ? ' [ring]' : ' [NO RING]'); });
  try {
    await page.goto(HOST + '/settings/modules-and-fields/' + X.mid + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
    await page.getByRole('button', { name: /new rule/i }).first().focus(); R.newRuleFocus = await cur(); await page.keyboard.press('Enter'); await sleep(1500);
    R.dialogOpen = await page.locator('[role=dialog]').count();
    for (let i = 0; i < 18; i++) { await page.keyboard.press('Tab'); await sleep(150); R.stops.push(await cur()); }
    R.noRing = R.stops.filter(s => s && s.includes('NO RING')).length;
    // try opening the Layout picker with the keyboard
    const lay = page.locator('[role=dialog]').last().getByRole('button', { name: 'Layout', exact: true }).first(); await lay.focus(); await page.keyboard.press('Enter'); await sleep(800);
    R.layoutListOpen = await page.getByRole('option').count(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await sleep(800);
    R.layoutAfter = (await lay.innerText().catch(() => '')).trim();
    await page.screenshot({ path: EV + 'crm-M3-keyboard.png' });
    await page.keyboard.press('Escape'); await sleep(800); R.afterEsc = await page.locator('[role=dialog]').count();
    if (R.afterEsc) { await page.keyboard.press('Escape'); await sleep(800); R.afterEsc2 = await page.locator('[role=dialog]').count(); }
  } catch (e) { R.err = String(e.message).slice(0, 250); }
  return R;
}
