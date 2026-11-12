async (page, ctx, h) => {
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'Cancel' }).click().catch(()=>0);
  await page.waitForTimeout(1000);
  await page.getByText('QA VR1112 Code', { exact: true }).first().click();
  await page.waitForTimeout(4000);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.screenshot({ path: ev + 'zoho-vr-edit.png' });
  const t = await page.innerText('body');
  return { txt: t.slice(t.indexOf('Help')).slice(0, 2000) };
}
