async (page) => { const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
  await page.goto('https://staging-desk.taviportal.com/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000); await page.screenshot({ path: S + 'tavi-rr-page.png' });
  return await page.evaluate(() => [...document.querySelectorAll('button,[role=combobox],[role=tab]')].filter(e => e.offsetParent).map(e => (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40)).filter(Boolean).slice(0, 60)); }
