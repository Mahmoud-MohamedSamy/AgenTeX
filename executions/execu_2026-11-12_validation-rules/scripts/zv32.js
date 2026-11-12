async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.mouse.click(550, 208); await page.waitForTimeout(1500);
  const t0 = await page.innerText('body');
  const m = t0.match(/Mass Update|Send Email|Actions/g);
  await page.getByText('Mass Update', { exact: true }).first().click({ timeout: 5000 }).catch(async e => { await page.getByRole('button', { name: /Actions|More/ }).first().click().catch(()=>0); await page.waitForTimeout(1000); await page.getByText('Mass Update', { exact: true }).first().click({ timeout: 5000 }).catch(()=>0); });
  await page.waitForTimeout(2500);
  // open field picker
  await page.screenshot({ path: ev + 'zoho-Z5-massupdate.png' });
  const t = await page.innerText('body');
  return { m, tail: t.slice(t.lastIndexOf('Mass Update')).slice(0, 500) };
}
