async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  const pre = await d.innerText('body');
  await d.mouse.click(940, 222); await d.waitForTimeout(2500);
  await d.screenshot({ path: ev + 'zoho-desk-vr-fieldpicker.png' });
  const t = await d.innerText('body');
  const opts = await d.$$eval('li', ls => ls.filter(l => l.offsetParent && l.getBoundingClientRect().left > 700 && l.getBoundingClientRect().top > 200).map(l => l.innerText.trim()).filter(Boolean));
  return { opts, diff: t.split('\n').filter(l => !pre.includes(l)).join(' | ').slice(0, 1200) };
}
