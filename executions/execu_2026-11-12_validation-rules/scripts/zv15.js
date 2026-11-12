async (page, ctx, h) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/settings/modules/Leads/validation-rules', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(7000);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.screenshot({ path: ev + 'zoho-vr-list.png' });
  const t = await page.innerText('body'); const i = t.indexOf('Validation Rules', 1000);
  const btns = await page.$$eval('button', bs => bs.map(b => b.innerText.trim()).filter(Boolean).slice(0, 30));
  return { txt: t.slice(t.lastIndexOf('Validation Rules')-50).slice(0, 1200), btns };
}
