async (page, ctx, h) => {
  const d = await zdPage(ctx);
  await d.getByText('Layouts and Fields', { exact: true }).first().click(); await d.waitForTimeout(5000);
  let t = await d.innerText('body');
  const a = t.slice(t.indexOf('APIs')).slice(0, 500);
  await d.getByText(/^Validation Rules$/).first().click({ timeout: 6000 }).catch(()=>0); await d.waitForTimeout(3000);
  await d.getByText(/^Tickets$/).nth(1).click({ timeout: 4000 }).catch(()=>0); await d.waitForTimeout(4000);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await d.screenshot({ path: ev + 'zoho-desk-vr.png' });
  t = await d.innerText('body');
  return { a, url: d.url(), txt: t.slice(t.indexOf('APIs')).slice(0, 900) };
}
