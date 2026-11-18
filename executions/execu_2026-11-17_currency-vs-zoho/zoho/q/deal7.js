async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.keyboard.press('Escape');
  const setText = async (x, y, v) => { await page.mouse.click(x, y); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await page.keyboard.type(v); await page.waitForTimeout(400); };
  await setText(654, 241, 'QA CUR1117 Deal');
  if (!(await page.innerText('body')).includes('King (Sample)')) { await page.mouse.click(831, 295); await page.waitForTimeout(3500); await page.getByText('King (Sample)', { exact: true }).first().click(); await page.waitForTimeout(2000); }
  await page.mouse.click(1333, 511); await page.waitForTimeout(1200);
  await page.locator('lyte-drop-item:visible', { hasText: 'EUR' }).first().click(); await page.waitForTimeout(1500);
  await setText(1340, 187, '1000');
  await setText(1333, 241, '31/12/2026'); await page.keyboard.press('Escape'); await page.mouse.click(1000, 620); await page.waitForTimeout(800);
  await page.screenshot({ path: R + 'z27-deal-filled.png' });
  const t0 = await page.innerText('body'); out.before = t0.slice(t0.indexOf('Deal Information'), t0.indexOf('Description Information')).replace(/\n/g, ' | ');
  return out;
}
