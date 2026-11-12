async (page, ctx, h) => {
  await page.getByText('Modules and Fields', { exact: true }).first().click();
  await page.waitForTimeout(5000);
  await page.getByText('Leads', { exact: true }).first().click();
  await page.waitForTimeout(5000);
  const u1 = page.url();
  await page.getByText('Validation Rules', { exact: true }).first().click().catch(e=>0);
  await page.waitForTimeout(5000);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.screenshot({ path: ev + 'zoho-vr-list.png' });
  return { u1, url: page.url(), txt: (await page.innerText('body')).slice(-1500) };
}
