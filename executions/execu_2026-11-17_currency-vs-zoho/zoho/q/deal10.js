async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.goto('https://crm.zoho.com/crm/org946877290/tab/Potentials/7666662000000728013', { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2500); const t = await page.innerText('body').catch(() => ''); if (/Exchange Rate\n/.test(t)) break; }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: R + 'z35-deal-after-rate-change.png' });
  const t = await page.innerText('body'); const i = t.indexOf('Deal Information'); return t.slice(i, i + 900);
}
