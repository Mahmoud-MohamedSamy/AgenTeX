async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  const pre = await d.innerText('body');
  await d.getByText('Create Rule', { exact: true }).first().click(); await d.waitForTimeout(4000);
  await d.screenshot({ path: ev + 'zoho-desk-vr-new.png' });
  const t = await d.innerText('body');
  const diff = t.split('\n').filter(l => !pre.includes(l)).join(' | ');
  return { diff: diff.slice(0, 1500) };
}
