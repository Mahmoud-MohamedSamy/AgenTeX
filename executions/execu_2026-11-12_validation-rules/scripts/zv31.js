async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads/custom-view', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);
  const row = page.locator('text=QA VR1112 L-ok2').first();
  const box = row.locator('xpath=ancestor::*[self::tr or contains(@class,"row")][1]//input[@type="checkbox"] | ancestor::*[self::tr or contains(@class,"row")][1]//*[contains(@class,"checkbox")]').first();
  await box.click({ force: true }).catch(e => 0);
  await page.waitForTimeout(1500);
  await page.getByText('Mass Update', { exact: true }).first().click().catch(e => 0);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: ev + 'zoho-Z5-massupdate.png' });
  const t = await page.innerText('body');
  return { has: t.includes('Mass Update'), tail: t.slice(t.lastIndexOf('Mass Update')).slice(0, 600) };
}
