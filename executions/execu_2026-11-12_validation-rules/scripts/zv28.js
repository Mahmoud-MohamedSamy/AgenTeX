async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.locator('input[data-tabindex="group1-2"]').first().fill('QA VR1112');
  await page.fill('#Crm_Leads_LEADCF2_LInput', 'x');
  await page.fill('#Crm_Leads_LASTNAME_LInput', 'QA VR1112 UI-E2');
  await page.getByRole('button', { name: /^Save$/ }).first().click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: ev + 'zoho-E2-alert.png' });
  const t = await page.innerText('body');
  return { url: page.url(), msgs: t.match(/QA VR1112 [^\n]*/g) };
}
