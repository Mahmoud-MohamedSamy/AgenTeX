async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await d.getByText('Not Now', { exact: true }).click().catch(()=>0);
  await d.mouse.click(1573, 447).catch(()=>0);
  await d.mouse.click(1475, 68); await d.waitForTimeout(4000);
  await d.screenshot({ path: ev + 'zoho-desk-vr-new.png' });
  const t = await d.innerText('body');
  return { txt: t.slice(t.indexOf('Validation Rule')).slice(0, 1200) };
}
