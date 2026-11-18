async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const box = async () => { await page.mouse.click(900, 570, { clickCount: 3 }); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); };
  const state = async () => { const t = await page.innerText('body'); const i = t.lastIndexOf('1 EGP'); const sv = page.locator('button:visible, lyte-button:visible', { hasText: /^Save$/ }).last(); return { txt: t.slice(i, i + 120).replace(/\n/g, ' | '), saveDisabled: await sv.evaluate(e => e.hasAttribute('disabled') || e.getAttribute('lt-prop-disabled') === 'true' || !!e.closest('[disabled]') || getComputedStyle(e).opacity < 0.9).catch(() => 'n/a') }; };
  for (const v of ['-5', 'abc', '0.123456789012', '1234567890123456']) { await box(); await page.keyboard.type(v); await page.waitForTimeout(800); const s = await state(); const val = await page.evaluate(() => document.activeElement && document.activeElement.value); out[v] = { ...s, value: val }; }
  await box(); await page.keyboard.type('0.0175'); await page.waitForTimeout(800); out.valid = await state();
  await page.screenshot({ path: R + 'z14-valid-rate.png' });
  return out;
}
