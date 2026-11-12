async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  const out = {};
  const before = await page.innerText('body');
  await page.getByText('Save Only', { exact: true }).first().click(); await page.waitForTimeout(1500);
  await page.screenshot({ path: ev + 'zoho-vr-validateon.png' });
  const a = await page.innerText('body'); out.validateOn = a.replace(before, '').slice(0, 600) || a.slice(-600);
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  await page.getByText('When criteria is met', { exact: true }).first().click(); await page.waitForTimeout(1500);
  const b = await page.innerText('body'); out.exec = b.slice(-600);
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  await page.getByText('IS', { exact: true }).first().click(); await page.waitForTimeout(2000);
  await page.screenshot({ path: ev + 'zoho-vr-cond.png' });
  out.cond = (await page.innerText('body')).slice(-1200);
  return out;
}
