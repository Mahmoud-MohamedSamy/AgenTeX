async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.goto('https://crm.zoho.com/crm/org946877290/tab/Potentials/7666662000000728013', { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2500); const t = await page.innerText('body').catch(() => ''); if (/Exchange Rate\n/.test(t)) break; }
  await page.waitForTimeout(1500);
  let t = await page.innerText('body'); let i = t.indexOf('Exchange Rate\n'); out.deal = t.slice(i, i + 200).replace(/\n/g, ' | ');
  await page.screenshot({ path: R + 'z38-deal-after-deactivate.png' });
  await page.goto('https://crm.zoho.com/crm/org946877290/tab/Potentials/create', { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2500); const tt = await page.innerText('body').catch(() => ''); if (/Deal Name/.test(tt) && /Currency/.test(tt)) break; }
  await page.waitForTimeout(1500);
  await page.mouse.click(1333, 511); await page.waitForTimeout(1500);
  out.createOpts = await page.locator('lyte-drop-item:visible').allInnerTexts();
  await page.screenshot({ path: R + 'z39-create-after-deactivate.png' });
  await page.keyboard.press('Escape');
  return out;
}
