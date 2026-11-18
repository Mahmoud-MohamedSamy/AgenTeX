async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  await page.goto('https://crm.zoho.com/crm/org946877290/settings/index', { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); if (await page.locator(':text-is("Recycle Bin"):visible').count()) break; }
  await page.locator(':text-is("Recycle Bin"):visible').first().click();
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2000); const t = await page.innerText('body'); if (/QA CUR1117|No records|Deleted By/i.test(t)) break; }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: R + 'z43-recycle.png' });
  const t = await page.innerText('body'); const i = t.indexOf('QA CUR1117'); return i >= 0 ? t.slice(i - 300, i + 200) : t.slice(-800);
}
