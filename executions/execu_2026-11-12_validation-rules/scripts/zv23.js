async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads/create?layoutId=7687862000000091055', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(7000);
  const ids = await page.$$eval('input', is => is.map(i => i.id || i.name || i.getAttribute('aria-label')).filter(x => x && /Last|Company|VR1112/i.test(x)));
  return { url: page.url(), ids };
}
