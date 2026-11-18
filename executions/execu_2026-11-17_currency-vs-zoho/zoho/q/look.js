async (page) => {
  for (let k = 0; k < 60; k++) { const t = await page.innerText('body').catch(() => ''); if (/Home Currency|Currencies/i.test(t) && t.length > 600) break; await page.waitForTimeout(3000); }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/z01-currencies.png' });
  const t = await page.innerText('body'); const i = t.indexOf('Company Details'); return { url: page.url(), text: t.slice(Math.max(0, t.lastIndexOf('Developer Hub')), 99999).slice(0, 5000) };
}
