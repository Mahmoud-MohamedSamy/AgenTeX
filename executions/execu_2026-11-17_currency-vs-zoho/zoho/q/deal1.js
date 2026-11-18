async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.goto('https://crm.zoho.com/crm/org946877290/tab/Potentials/create?layoutId=', { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(3000); const t = await page.innerText('body').catch(() => ''); if (/Deal Name/.test(t) && /Currency/.test(t)) break; }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: R + 'z25-deal-create.png' });
  const t = await page.innerText('body'); const i = t.indexOf('Deal Information'); return { url: page.url(), text: t.slice(i >= 0 ? i : 0).slice(0, 2000) };
}
