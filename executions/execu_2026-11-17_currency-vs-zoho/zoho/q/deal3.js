async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.mouse.click(654, 241); await page.keyboard.type('QA CUR1117 Deal');
  await page.mouse.click(640, 295); await page.keyboard.type('a'); await page.waitForTimeout(2500);
  const it = page.locator('lyte-drop-item:visible, li:visible[role=option], .lyteAutocompleteItem:visible, lyte-autocomplete-item:visible');
  out.acc = (await it.allInnerTexts()).slice(0, 3);
  if (await it.count()) await it.first().click(); else await page.keyboard.press('ArrowDown'), await page.keyboard.press('Enter');
  await page.waitForTimeout(1200);
  await page.mouse.click(1333, 241); await page.keyboard.type('31/12/2026'); await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  await page.screenshot({ path: R + 'z27-deal-filled.png' });
  await page.locator('button:visible, lyte-button:visible', { hasText: /^Save$/ }).last().click();
  for (let k = 0; k < 20; k++) { await page.waitForTimeout(1500); if (!/\/create/.test(page.url())) break; }
  await page.waitForTimeout(4000);
  await page.screenshot({ path: R + 'z28-deal-saved.png' });
  const t = await page.innerText('body'); out.url = page.url(); out.text = t.slice(t.indexOf('QA CUR1117')).slice(0, 2500);
  return out;
}
