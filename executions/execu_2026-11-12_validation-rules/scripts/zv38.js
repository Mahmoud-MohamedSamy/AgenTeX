async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await d.goto('https://desk.zoho.com/agent/techsolutionsegypt/setup/validation-rules', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await d.waitForTimeout(8000);
  const links = await d.$$eval('a', as => as.map(a => (a.innerText||'').trim()+'=>'+a.getAttribute('href')).filter(x => /valid/i.test(x)).slice(0, 10));
  await d.screenshot({ path: ev + 'zoho-desk-vr.png' });
  return { url: d.url(), links, txt: (await d.innerText('body')).slice(0, 800) };
}
