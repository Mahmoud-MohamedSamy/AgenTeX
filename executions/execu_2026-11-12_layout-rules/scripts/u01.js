async (page) => {
  await page.goto('https://staging-crm.taviportal.com/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3?tab=layout-rules', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  const shot = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/crm-list.png';
  await page.screenshot({ path: shot });
  return { url: page.url(), text: (await page.innerText('main').catch(()=>page.innerText('body'))).slice(0, 2500) };
}
