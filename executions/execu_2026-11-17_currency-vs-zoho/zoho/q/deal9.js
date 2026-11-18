async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.mouse.click(1535, 78);
  for (let k = 0; k < 20; k++) { await page.waitForTimeout(1500); if (!/\/create/.test(page.url())) break; }
  await page.waitForTimeout(5000);
  await page.screenshot({ path: R + 'z28-deal-saved.png' });
  const t = await page.innerText('body'); out.url = page.url().replace(/[?].*$/, ''); out.text = t.slice(Math.max(0, t.indexOf('QA CUR1117'))).slice(0, 2200);
  return out;
}
