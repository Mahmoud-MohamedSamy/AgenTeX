async (page, ctx) => {
  const p = await zdPage(ctx); const EVd = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/';
  await p.mouse.click(110, 500); await p.waitForTimeout(7000);
  await p.screenshot({ path: EVd + 'zoho-desk-lr.png' });
  const btn = (await p.locator('button:visible, a:visible').allInnerTexts()).map(s => s.trim()).filter(s => /rule|new|create/i.test(s)).slice(0, 10);
  return { url: p.url().replace(/\?.*/, ''), btn, t: (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 600) };
}
