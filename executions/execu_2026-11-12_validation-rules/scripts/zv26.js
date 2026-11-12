async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.fill('#Crm_Leads_LASTNAME_LInput', 'QA VR1112 UI-E2');
  const fill = async (lbl, v) => { const loc = page.locator(`xpath=//*[normalize-space(text())='${lbl}']/following::input[1]`).first(); await loc.fill(v); };
  await fill('Company', 'QA VR1112');
  await fill('QA VR1112 Code', 'X');
  await page.getByRole('button', { name: /^Save$/ }).first().click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: ev + 'zoho-E2-alert.png' });
  return { url: page.url(), tail: (await page.innerText('body')).slice(0, 0) + (await page.innerText('body')).match(/QA VR1112 [^\n]*/g) };
}
