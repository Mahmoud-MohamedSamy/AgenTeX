async (page, ctx, h) => {
  const d = await zdPage(ctx);
  await d.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await d.waitForTimeout(9000);
  let t = await d.innerText('body');
  const i = t.indexOf('Validation');
  await d.getByText(/^Validation Rules$/).first().click({ timeout: 8000 }).catch(e=>0);
  await d.waitForTimeout(6000);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await d.screenshot({ path: ev + 'zoho-desk-vr.png' });
  t = await d.innerText('body');
  return { i, url: d.url(), txt: t.slice(0, 900) };
}
