async (page, ctx, h) => {
  await page.getByRole('button', { name: 'Create New Validation Rule' }).click();
  await page.waitForTimeout(3000);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.screenshot({ path: ev + 'zoho-vr-new1.png' });
  const t = await page.innerText('body');
  return { txt: t.slice(t.indexOf('Create New Validation Rule')).slice(0, 1500) };
}
