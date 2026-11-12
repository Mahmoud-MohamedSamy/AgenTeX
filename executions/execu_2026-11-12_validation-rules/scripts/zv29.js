async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.getByRole('button', { name: /^Cancel$/ }).first().click().catch(()=>0); await page.waitForTimeout(1500);
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads/7687862000000765076/edit', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#Crm_Leads_LASTNAME_LInput', { timeout: 40000 }); await page.waitForTimeout(2000);
  await page.fill('#Crm_Leads_DESIGNATION_LInput', 'QA G3 ui edit').catch(e => 'nofill');
  await page.getByRole('button', { name: /^Save$/ }).first().click();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: ev + 'zoho-G3-edit-other-field.png' });
  const t = await page.innerText('body');
  const rec = await zf(page, 'GET', '/crm/v8/Leads/7687862000000765076?fields=Designation,QA_VR1112_Code');
  return { url: page.url(), msgs: t.match(/QA VR1112 C[^\n]*/g), rec: rec.t.slice(0, 200) };
}
