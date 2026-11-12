async (page, ctx, h) => {
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await page.mouse.click(264, 526); await page.waitForTimeout(1200);
  const m = (await page.innerText('body')).slice(-200);
  await page.getByText(/^Edit$/).first().click().catch(()=>0); await page.waitForTimeout(2000);
  // open comparator dropdown if any
  const sel = page.locator('text=/^is$/i').last(); await sel.click().catch(()=>0); await page.waitForTimeout(1500);
  await page.screenshot({ path: ev + 'zoho-vr-comparators.png' });
  return { m, tail: (await page.innerText('body')).slice(-900) };
}
