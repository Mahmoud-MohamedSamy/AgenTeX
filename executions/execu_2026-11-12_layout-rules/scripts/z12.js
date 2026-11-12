async (page) => {
  const EVd = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/evidence/';
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads/7687862000000765035', { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); if ((await page.innerText('body').catch(() => '')).includes('Industry')) break; }
  await page.waitForTimeout(3000);
  const lab = page.getByText('Industry', { exact: true }).first(); await lab.scrollIntoViewIfNeeded();
  const box = await lab.boundingBox();
  await page.mouse.move(box.x + 300, box.y + box.height / 2); await page.waitForTimeout(800);
  await page.screenshot({ path: EVd + 'zoho-G4-hover.png' });
  const html = await lab.evaluate(e => { let p = e; for (let i = 0; i < 4; i++) p = p.parentElement; return p.outerHTML.replace(/\s+/g, ' ').slice(0, 1500); });
  return { box, html };
}
