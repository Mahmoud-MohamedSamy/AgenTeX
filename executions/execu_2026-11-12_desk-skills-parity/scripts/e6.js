async (page) => { const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
  await page.screenshot({ path: S + 'tavi-rr-rule-list.png' });
  await page.mouse.click(1398, 400); await page.waitForTimeout(2500);
  await page.screenshot({ path: S + 'tavi-rr-prefs-threshold40.png' }); return 'ok'; }
