async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  const before = await page.innerText('body');
  await page.getByText('Select a field', { exact: true }).last().click(); await page.waitForTimeout(2000);
  await page.screenshot({ path: ev + 'zoho-Z5-massupdate.png' });
  const t = await page.innerText('body');
  const opts = await page.$$eval('lyte-drop-item, li', ls => ls.filter(l => l.offsetParent).map(l => l.innerText.trim()).filter(Boolean)).catch(()=>[]);
  return { hasCode: opts.includes('QA VR1112 Code'), hasCodeText: t.includes('QA VR1112 Code'), opts: opts.filter(o=>o.length<40).slice(0, 80) };
}
