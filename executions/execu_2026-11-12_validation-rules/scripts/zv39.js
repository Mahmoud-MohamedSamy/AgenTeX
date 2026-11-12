async (page, ctx, h) => {
  const d = await zdPage(ctx);
  await d.goto('https://desk.zoho.com/agent/techsolutionsegypt/setup/landing', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await d.waitForTimeout(7000);
  await d.getByText('Validation Rules', { exact: true }).first().click({ timeout: 10000 }).catch(e=>0);
  await d.waitForTimeout(6000);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await d.screenshot({ path: ev + 'zoho-desk-vr.png' });
  const btns = await d.$$eval('button', bs => bs.map(b => b.innerText.trim()).filter(Boolean).slice(0, 20));
  const t = await d.innerText('body');
  return { url: d.url(), btns, txt: t.slice(t.indexOf('Validation')).slice(0, 800) };
}
