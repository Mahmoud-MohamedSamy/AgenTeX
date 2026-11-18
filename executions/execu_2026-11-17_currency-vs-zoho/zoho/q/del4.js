async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z42-after-delete.png' });
  const t = await page.innerText('body'); const i = t.indexOf('QA CUR1117'); return t.slice(Math.max(0, i - 200), i + 200);
}
