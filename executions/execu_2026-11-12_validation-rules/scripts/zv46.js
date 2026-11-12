async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await d.reload({ waitUntil: 'domcontentloaded' }); await d.waitForTimeout(9000);
  const pre = await d.innerText('body');
  const b = d.locator('button:has-text("Create Rule"), [role=button]:has-text("Create Rule")').first();
  await b.click({ force: true, timeout: 8000 }).catch(async () => { await d.mouse.click(1477, 73); });
  await d.waitForTimeout(5000);
  await d.screenshot({ path: ev + 'zoho-desk-vr-new.png' });
  const t = await d.innerText('body');
  return { diff: t.split('\n').filter(l => !pre.includes(l)).join(' | ').slice(0, 1500) };
}
