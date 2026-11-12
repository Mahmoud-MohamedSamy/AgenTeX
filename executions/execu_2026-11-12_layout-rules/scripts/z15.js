async (page) => {
  const EVd = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/';
  const c = page.getByText('Cancel', { exact: true }); for (let i = (await c.count()) - 1; i >= 0; i--) if (await c.nth(i).isVisible()) { await c.nth(i).click(); break; }
  await page.waitForTimeout(1500);
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads/create?layoutId=7687862000000091055', { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); if (await page.locator('#Crm_Leads_LASTNAME, [data-zcqa*="LASTNAME"] input').count()) break; }
  await page.waitForTimeout(2000);
  const ids = await page.evaluate(() => [...document.querySelectorAll('input[id^=Crm_Leads_], lyte-dropdown[id^=Crm_Leads_], [id^=Crm_Leads_]')].map(e => e.id).filter((v, i, a) => a.indexOf(v) === i).slice(0, 60));
  return { url: page.url().replace(/\?.*/, ''), ids };
}
