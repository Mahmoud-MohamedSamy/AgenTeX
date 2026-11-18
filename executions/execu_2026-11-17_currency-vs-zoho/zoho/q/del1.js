async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.goto('https://crm.zoho.com/crm/org946877290/tab/Potentials/7666662000000728013', { waitUntil: 'commit', timeout: 120000 });
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(2500); const t = await page.innerText('body').catch(() => ''); if (/Exchange Rate\n/.test(t)) break; }
  await page.waitForTimeout(1500);
  const more = page.locator('[data-zcqa="detailView_moreOptions"], [data-zcqa*="more" i]:visible, lyte-button:visible:has-text("...")');
  out.more = await more.count();
  await page.screenshot({ path: R + 'z40-deal-top.png', clip: { x: 240, y: 50, width: 1360, height: 120 } });
  return out;
}
