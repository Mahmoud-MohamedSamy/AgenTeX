async (page) => { const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
  await page.mouse.click(1381, 358); await page.waitForTimeout(1200);
  await page.keyboard.type('QA SK13 Dept A', { delay: 30 }); await page.waitForTimeout(1200);
  const opt = page.getByRole('option', { name: 'QA SK13 Dept A' }); if (await opt.count()) await opt.first().click(); else await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  await page.mouse.click(1531, 358); await page.waitForTimeout(1500);
  await page.screenshot({ path: S + 'tavi-rr-menu.png' });
  return await page.evaluate(() => [...document.querySelectorAll('[role=menuitem],[role=dialog] *')].filter(e => e.offsetParent && e.childElementCount === 0).map(e => e.textContent.trim()).filter(Boolean).slice(0, 30)); }
