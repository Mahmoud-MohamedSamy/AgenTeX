async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.goto('https://crm.zoho.com/crm/org944965048/settings/modules/Leads?tab=validationrules', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: ev + 'zoho-vr-list.png' });
  return { url: page.url(), txt: (await page.innerText('body')).slice(0, 1500) };
}
